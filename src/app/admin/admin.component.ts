import { Component, OnInit } from '@angular/core';
import { BackEndService } from '../backend/backend.service';
import { Channel } from '../backend/backend';
import { ConfirmationService } from 'primeng/api';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component( {
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css', '../../assets/css/table.css']
} )

export class AdminComponent implements OnInit {
    mode = 'Observable';

    errorMessage: string = null;

    channels: Channel[];

    sortBy: string = undefined;
    sortOrder = false; // true = asc, false = desc

    selectedChannel: Channel;
    display = false;
    modeEdit = false;

    displayEnabled = false;

    userform: FormGroup;

    constructor( private backEndService: BackEndService,
        private confirmationService: ConfirmationService, private fb: FormBuilder ) {
    }


    ngOnInit() {
        this.getChannels();
        this.setEditForm( '', '', true );

        this.backEndService.getGlobalCounts();
    }

    setEditForm( id: string, title: string, enable: boolean ) {
        this.userform = this.fb.group( {
            'id': new FormControl( id, Validators.compose( [Validators.required, Validators.minLength( 24 ),
                                                                Validators.maxLength( 24 )] ) ),
            'title': new FormControl( title, Validators.required ),
            'enable': new FormControl( enable )
        } );
    }

    getChannels() {

        this.channels = null;

        this.backEndService.getChannels( false ).subscribe(
            responsePlaylists => {
                this.channels = responsePlaylists.channels;
            },
            error => this.errorMessage = <any>error,
            () => this.sort() );
    }

    comparatorNumber( n1: number, n2: number ): number {
        return +n1 < +n2 ? -1 :
            ( +n1 > +n2 ? 1 : 0 );
    }
    comparatorString( s1: string, s2: string ): number {
        return s1 < s2 ? -1 :
            ( s1 > s2 ? 1 : 0 );
    }
    comparatorBoolean( s1: boolean, s2: boolean ): number {
        return s1 < s2 ? -1 :
            ( s1 > s2 ? 1 : 0 );
    }

    sortI( sortBy: string ) {
        this.sortBy = sortBy;
        this.sort();
    }


    sort() {
        if ( this.sortBy === undefined || this.channels === null || this.channels === undefined ) {
            return;
        }

        if ( this.sortBy !== this.sortBy ) {
            this.sortBy = this.sortBy;
            this.sortOrder = true;
        } else {
            this.sortOrder = !this.sortOrder;
        }


        switch ( this.sortBy ) {
            case 'id':
                if ( this.sortOrder ) {
                    this.channels = this.channels.sort(( c1, c2 ) => this.comparatorString( c1.id, c2.id ) );
                } else {
                    this.channels = this.channels.sort(( c1, c2 ) => this.comparatorString( c2.id, c1.id ) );
                }
                break;
            case 'title':
                if ( this.sortOrder ) {
                    this.channels = this.channels.sort(( c1, c2 ) => this.comparatorString( c1.title, c2.title ) );
                } else {
                    this.channels = this.channels.sort(( c1, c2 ) => this.comparatorString( c2.title, c1.title ) );
                }
                break;
        }
    }

    addOrUpdatechannel( channel: Channel ) {
        if ( this.selectedChannel ) {
            this.updateChannel( this.selectedChannel.id, channel );
        } else {
            this.addChannel( channel );
        }
    }

    addChannel( channel: Channel ) {
        this.backEndService.addChannel( channel ).subscribe(
            ret => {
                if ( !ret ) {
                    this.channels.push( channel );
                }
            },
            error => this.errorMessage = <any>error,
        );

        this.display = false;
    }

    updateChannel( id: string, channel: Channel ) {
        this.backEndService.updateChannel( id, channel ).subscribe(
            ret => {
                if ( !ret ) {
                    this.selectedChannel.id = channel.id;
                    this.selectedChannel.title = channel.title;
                    this.selectedChannel.enable = channel.enable;
                }

            },
            error => this.errorMessage = <any>error,
        );

        this.display = false;
    }

    newChannel() {
        this.selectedChannel = null;
        this.setEditForm( '', '', true );
        this.modeEdit = false;
        this.display = true;
    }

    editChannel( ch: Channel ) {
        this.selectedChannel = ch;
        this.setEditForm( ch.id, ch.title, ch.enable );
        this.modeEdit = true;
        this.display = true;
    }

    confirm() {
        this.display = false;

        this.confirmationService.confirm( {
            message: 'Ви дійсно хочете видалити запис?',
            header: 'Підтвердження видалення',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.backEndService.deleteChannel( this.selectedChannel ).subscribe(
                    ret => {
                        if ( !ret ) {
                            const updatedChannelResp: Channel[] = [];

                            for ( const el of this.channels ) {
                                if ( el.id !== this.selectedChannel.id ) {
                                    updatedChannelResp.push( el );
                                }
                            }
                            this.channels = updatedChannelResp;

                            this.selectedChannel = null;
                        }
                    }
                );
            },
            reject: () => {
                this.display = true;
            }
        } );
    }

}
