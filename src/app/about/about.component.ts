import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { BackEndService } from '../backend/backend.service';
import { Meta } from '@angular/platform-browser';

@Component( {
    selector: 'app-about',
    template: `<div [innerHTML]="myVal"></div>`
})

export class AboutComponent implements OnInit {
    myVal: any;

    constructor( http: HttpClient, public translate: TranslateService,
            private backEndService: BackEndService, private meta: Meta) {

        const url = '/assets/html/about-' + translate.currentLang + '.html';

        http.get(url, { responseType: 'text' })
        .subscribe(
           html => this.myVal = html) ;
    }

    ngOnInit() {
        this.backEndService.getGlobalCounts();
        this.updateMETA();
    }

    updateMETA() {
        this.translate.get( 'META.TITLE' ).
            subscribe( s => this.meta.updateTag( { name: 'title', content: s } ) );
        this.translate.get( 'META.DESCRIPTION' ).
            subscribe( s => this.meta.updateTag( { name: 'description', content: s } ) );
    }
}

