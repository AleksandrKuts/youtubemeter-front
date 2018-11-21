import { Component, OnInit } from '@angular/core';
import { BackEndService } from '../backend/backend.service';
import { PlayList } from '../backend/backend';
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

    playlists: PlayList[];

    sortBy: string = undefined;
    sortOrder = false; // true = asc, false = desc

    selectedPlayList: PlayList;
    display = false;
    modeEdit = false;

    displayEnabled = false;

    userform: FormGroup;

    constructor( private backEndService: BackEndService,
        private confirmationService: ConfirmationService, private fb: FormBuilder ) {
    }


    ngOnInit() {
        this.getPlayLists();
        this.setEditForm( '', '', true, '' );

        this.backEndService.getGlobalCounts();
    }

    setEditForm( id: string, title: string, enable: boolean, idch: string ) {
        this.userform = this.fb.group( {
            'id': new FormControl( id, Validators.compose( [Validators.required, Validators.minLength( 24 ),
                                                                Validators.maxLength( 24 )] ) ),
            'title': new FormControl( title, Validators.required ),
            'enable': new FormControl( enable ),
            'idch': new FormControl( idch, Validators.compose( [Validators.required, Validators.minLength( 24 ),
                                                                Validators.maxLength( 24 )] ) )
        } );
    }

    getPlayLists() {

        this.playlists = null;

        this.backEndService.getPlayLists( false ).subscribe(
            responsePlaylists => {
                this.playlists = responsePlaylists.playlists;
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
        if ( this.sortBy === undefined || this.playlists === null || this.playlists === undefined ) {
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
                    this.playlists = this.playlists.sort(( c1, c2 ) => this.comparatorString( c1.id, c2.id ) );
                } else {
                    this.playlists = this.playlists.sort(( c1, c2 ) => this.comparatorString( c2.id, c1.id ) );
                }
                break;
            case 'title':
                if ( this.sortOrder ) {
                    this.playlists = this.playlists.sort(( c1, c2 ) => this.comparatorString( c1.title, c2.title ) );
                } else {
                    this.playlists = this.playlists.sort(( c1, c2 ) => this.comparatorString( c2.title, c1.title ) );
                }
                break;
            case 'idch':
                if ( this.sortOrder ) {
                    this.playlists = this.playlists.sort(( c1, c2 ) => this.comparatorString( c1.idch, c2.idch ) );
                } else {
                    this.playlists = this.playlists.sort(( c1, c2 ) => this.comparatorString( c2.idch, c1.idch ) );
                }
                break;
        }
    }

    addOrUpdateplaylist( playlist: PlayList ) {
        if ( this.selectedPlayList ) {
            this.updatePlayList( this.selectedPlayList.id, playlist );
        } else {
            this.addPlayList( playlist );
        }
    }

    addPlayList( playlist: PlayList ) {
        this.backEndService.addPlayList( playlist ).subscribe(
            ret => {
                if ( !ret ) {
                    this.playlists.push( playlist );
                }
            },
            error => this.errorMessage = <any>error,
        );

        this.display = false;
    }

    updatePlayList( id: string, playlist: PlayList ) {
        this.backEndService.updatePlayList( id, playlist ).subscribe(
            ret => {
                if ( !ret ) {
                    this.selectedPlayList.id = playlist.id;
                    this.selectedPlayList.title = playlist.title;
                    this.selectedPlayList.enable = playlist.enable;
                    this.selectedPlayList.idch = playlist.idch;
                }

            },
            error => this.errorMessage = <any>error,
        );

        this.display = false;
    }

    newPlayList() {
        this.selectedPlayList = null;
        this.setEditForm( '', '', true, '' );
        this.modeEdit = false;
        this.display = true;
    }

    editPlayList( ch: PlayList ) {
        this.selectedPlayList = ch;
        this.setEditForm( ch.id, ch.title, ch.enable, ch.idch );
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
                this.backEndService.deletePlayList( this.selectedPlayList ).subscribe(
                    ret => {
                        if ( !ret ) {
                            const updatedPlayListResp: PlayList[] = [];

                            for ( const el of this.playlists ) {
                                if ( el.id !== this.selectedPlayList.id ) {
                                    updatedPlayListResp.push( el );
                                }
                            }
                            this.playlists = updatedPlayListResp;

                            this.selectedPlayList = null;
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
