import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { BackEndService } from '../../backend/backend.service';
import { PlayList, YoutubeVideoShort } from '../../backend/backend';

import { MessageService } from '../../message.service';
import { SelectItem } from 'primeng/api';


@Component( {
    selector: 'playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
} )

export class VideoPlayListComponent implements OnInit {
    mode = 'Observable';

    sortBy: string = undefined;
    sortOrder = false; // true = asc, false = desc

    selectedPlayList: PlayList;
    playlistItems: SelectItem[];
    youtubeVideosShort: YoutubeVideoShort[];

    initPlayListID: string = undefined;
    maxCountVideoInPlayLists: number;

    visibleSidebar1: boolean;

    constructor( private route: ActivatedRoute, private backEndService: BackEndService,
            private messageService: MessageService  ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(( p ) => {
            const id = p['id'];
            if ( id ) {
                this.initPlayListID = id;
            }

        } );

        this.getPlayLists();
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

                    if ( this.initPlayListID !== undefined && this.selectedPlayList === undefined ) {
                        this.messageService.addError( 'Невідомий плейлист з id: ' + this.initPlayListID);
                    }

                    this.playlistItems = playlistsItem;

                    if (this.selectedPlayList === undefined && this.playlistItems.length > 0 ) {
                        this.selectedPlayList = responsePlaylists.playlists[0];
                    }
                    this.getVideos();
                }
            } );
    }

    getVideos() {
        this.youtubeVideosShort = null;

        if ( this.selectedPlayList ) {
            this.backEndService.getVideosByPlaylistId( this.selectedPlayList.id ).subscribe(
                youtubeVideosShort => {
                    if ( youtubeVideosShort ) {
                        this.youtubeVideosShort = youtubeVideosShort;
                    }
                } );
        }

        this.visibleSidebar1 = false;
    }

}

