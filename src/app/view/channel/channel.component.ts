import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackEndService } from '../../backend/backend.service';
import { Channel, YoutubeVideoShort } from '../../backend/backend';

import { MessageService } from '../../message.service';
import { SelectItem } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Meta } from '@angular/platform-browser';

const CHANNEL_TAG = 'channelid';

@Component( {
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.css']
} )

export class VideoChannelComponent implements OnInit {
    selectedChannel: Channel;
    channelItems: SelectItem[];
    youtubeVideosShort: YoutubeVideoShort[];

    initChannelID: string = undefined;
    maxCountVideoInChannels: number;

    visibleSidebar1: boolean;

    coockeChannelId: string;

    constructor( private route: ActivatedRoute, private backEndService: BackEndService,
        private cookieService: CookieService,   private messageService: MessageService,
        private titleService: Title, public translate: TranslateService,
        private meta: Meta) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(( p ) => {
            const id = p['id'];
            if ( id ) {
                this.initChannelID = id;
            }

        } );

        this.getChannels();
        this.coockeChannelId = this.cookieService.get(CHANNEL_TAG);
        this.updateMETA();
    }

    getChannels() {
        this.channelItems = null;
        this.selectedChannel = undefined;

        this.backEndService.getChannels( true ).subscribe(
            responseChannels => {
                if ( responseChannels ) {
                    this.maxCountVideoInChannels = responseChannels.maxvideocount;
                    const channelsItem: SelectItem[] = [];

                    for ( const channel of responseChannels.channels ) {
                        channelsItem.push( { label: channel.title, value: channel } );

                        if ( channel.id === this.initChannelID ) {
                            this.selectedChannel = channel;
                        }
                    }

                    this.channelItems = channelsItem;

                    if ( this.initChannelID !== undefined && this.selectedChannel === undefined ) {
                        this.messageService.addError( 'Невідомий канал з id: ' + this.initChannelID);
                    }

                    if (this.selectedChannel === undefined ) {
                        for ( const channel of responseChannels.channels ) {
                            if ( channel.id === this.coockeChannelId ) {
                                this.selectedChannel = channel;
                                break;
                            }
                        }
                    }

                    if (this.selectedChannel === undefined && this.channelItems.length > 0 ) {
                        this.selectedChannel = responseChannels.channels[0];
                    }

                    if (this.selectedChannel ) {
                        this.getVideos(0);
                    }
                }
            } );

    }

    getVideos(skip: number) {
        this.backEndService.getGlobalCounts().subscribe(); // update globalCounts

        this.youtubeVideosShort = null;

        if ( this.selectedChannel ) {
            this.setTitle( this.selectedChannel.title );
            this.cookieService.set(CHANNEL_TAG, this.selectedChannel.id );

            this.backEndService.getVideosByChannelId( this.selectedChannel.id, skip ).subscribe(
                youtubeVideosShort => {
                    if ( youtubeVideosShort ) {
                        this.youtubeVideosShort = youtubeVideosShort;
                    }
                } );
        }

        this.visibleSidebar1 = false;
    }

    setTitle(title: string) {
        this.translate.get('CHANNEL.TITLE').subscribe( s =>
            this.titleService.setTitle( s + ': ' + title)
        );
    }

    paginate(event) {
        if (event) {
            this.getVideos(event.page * this.maxCountVideoInChannels);
        }
    }

    updateMETA() {
        this.translate.get( 'META.TITLE' ).
            subscribe( s => this.meta.updateTag( { name: 'title', content: s } ) );
        this.translate.get( 'META.DESCRIPTION' ).
            subscribe( s => this.meta.updateTag( { name: 'description', content: s } ) );
    }

}

