import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackEndService } from '../../backend/backend.service';
import { PlayList, YoutubeVideoShort, GlobalCounts } from '../../backend/backend';

import { MessageService } from '../../message.service';
import { SelectItem } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

const PLAYLISTID_TAG = 'playlistid';

@Component( {
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
} )

export class VideoPlayListComponent implements OnInit {
    selectedPlayList: PlayList;
    playlistItems: SelectItem[];
    youtubeVideosShort: YoutubeVideoShort[];

    initPlayListID: string = undefined;
    maxCountVideoInPlayLists: number;

    visibleSidebar1: boolean;

    coockePlayListId: string;

    constructor( private route: ActivatedRoute, private backEndService: BackEndService,
        private cookieService: CookieService,   private messageService: MessageService,
        private titleService: Title, public translate: TranslateService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(( p ) => {
            const id = p['id'];
            if ( id ) {
                this.initPlayListID = id;
            }

        } );

        this.getPlayLists();
        this.coockePlayListId = this.cookieService.get(PLAYLISTID_TAG);
    }

    getPlayLists() {
        this.playlistItems = null;
        this.selectedPlayList = undefined;

        this.backEndService.getPlayLists( true ).subscribe(
            responsePlaylists => {
                if ( responsePlaylists ) {
                    this.maxCountVideoInPlayLists = responsePlaylists.maxvideocount;
                    const playlistsItem: SelectItem[] = [];

                    for ( const playlist of responsePlaylists.playlists ) {
                        playlistsItem.push( { label: playlist.title, value: playlist } );

                        if ( playlist.id === this.initPlayListID ) {
                            this.selectedPlayList = playlist;
                        }
                    }

                    this.playlistItems = playlistsItem;

                    if ( this.initPlayListID !== undefined && this.selectedPlayList === undefined ) {
                        this.messageService.addError( 'Невідомий плейлист з id: ' + this.initPlayListID);
                    }

                    if (this.selectedPlayList === undefined ) {
                        for ( const playlist of responsePlaylists.playlists ) {
                            if ( playlist.id === this.coockePlayListId ) {
                                this.selectedPlayList = playlist;
                                break;
                            }
                        }
                    }

                    if (this.selectedPlayList === undefined && this.playlistItems.length > 0 ) {
                        this.selectedPlayList = responsePlaylists.playlists[0];
                    }

                    if (this.selectedPlayList ) {
                        this.getVideos(0);
                    }
                }
            } );

    }

    getVideos(skip: number) {
        this.youtubeVideosShort = null;

        if ( this.selectedPlayList ) {
            this.setTitle( this.selectedPlayList.title );
            this.cookieService.set(PLAYLISTID_TAG, this.selectedPlayList.id );

            this.backEndService.getVideosByPlaylistId( this.selectedPlayList.id, skip ).subscribe(
                youtubeVideosShort => {
                    if ( youtubeVideosShort ) {
                        this.youtubeVideosShort = youtubeVideosShort;
                    }
                } );
        }

        this.visibleSidebar1 = false;
    }

    setTitle(title: string) {
        this.translate.get('PLAYLIST.TITLE').subscribe( s =>
            this.titleService.setTitle( s + ': ' + title)
        );
    }

    paginate(event) {
        if (event) {
            this.getVideos(event.page * this.maxCountVideoInPlayLists);
        }
    }
}

