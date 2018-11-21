import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackEndService } from '../../backend/backend.service';
import { YoutubeVideoShort, GlobalCounts } from '../../backend/backend';

import { MessageService } from '../../message.service';
import { SelectItem } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

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

    constructor( private backEndService: BackEndService, private messageService: MessageService,
        private titleService: Title, public translate: TranslateService ) {
        console.log('VideoAllComponent constructor');
    }

    ngOnInit() {
        console.log('VideoAllComponent ngOnInit');
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
}

