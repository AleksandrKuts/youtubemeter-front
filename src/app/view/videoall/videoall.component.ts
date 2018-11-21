import { Component, OnInit } from '@angular/core';

import { BackEndService } from '../../backend/backend.service';
import { YoutubeVideoShort, GlobalCounts } from '../../backend/backend';

import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Meta } from '@angular/platform-browser';

@Component( {
    selector: 'app-videoall',
    templateUrl: './videoall.component.html',
    styleUrls: ['./videoall.component.css']
} )

export class VideoAllComponent implements OnInit {
    youtubeVideosShort: YoutubeVideoShort[];
    globalCounts: GlobalCounts;
    videoStart: number;
    videoEnd: number;

    constructor( private backEndService: BackEndService, private titleService: Title, private meta: Meta,
         public translate: TranslateService ) {
    }

    ngOnInit() {
        this.updateMETA();
        this.setTitle();
        this.getVideos( 0 );
    }

    getVideos( skip: number ) {
        this.getGlobalCounts();

        this.youtubeVideosShort = null;
        this.backEndService.getVideos( skip ).subscribe(
            youtubeVideosShort => {
                if ( youtubeVideosShort ) {
                    this.youtubeVideosShort = youtubeVideosShort;

                    this.videoStart = skip + 1;
                    this.videoEnd = this.videoStart + youtubeVideosShort.length - 1;
                }
            } );
    }

    setTitle() {
        this.translate.get( 'METRICS.TITLE' ).subscribe( s =>
            this.titleService.setTitle( s )
        );
    }

    paginate( event ) {
        if ( event ) {
            this.getVideos( event.page * this.globalCounts.maxcountvideo );
        }
    }

    getGlobalCounts() {
        this.backEndService.getGlobalCounts().subscribe(
                g => {
                    if ( g ) {
                        this.globalCounts = g;
                    }
                } );
    }

    updateMETA() {
        this.translate.get( 'META.TITLE_VIDEOS' ).
            subscribe( s => this.meta.updateTag( { name: 'title', content: s } ) );
        this.translate.get( 'META.DESCRIPTION_VIDEOS' ).
            subscribe( s => this.meta.updateTag( { name: 'description', content: s } ) );
    }

}

