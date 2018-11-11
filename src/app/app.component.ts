import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Meta } from '@angular/platform-browser';

const LANGUAGE_TAG = 'langinterface';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
} )
export class AppComponent implements OnInit {
    langSelect: any;

    constructor( public translate: TranslateService, private cookieService: CookieService,
        private meta: Meta ) {

        translate.addLangs( ['en', 'ua', 'ru'] );
        translate.setDefaultLang( 'ua' );

    }

    ngOnInit() {
        const lang = this.cookieService.get(LANGUAGE_TAG);

        if ( lang && lang.match( /en|ua|ru/ ) ) {
            this.langSelect = lang;
        } else {
            this.langSelect = 'ua';
        }

        this.translate.use( this.langSelect );

        this.addMETA();
    }

    setLang() {
        this.cookieService.set( LANGUAGE_TAG, this.langSelect );
        this.translate.use( this.langSelect );
        this.updateMETA();
    }

    addMETA() {
        this.translate.get('META.TITLE').
            subscribe( s =>  this.meta.addTag({ name: 'title', content: s }));
        this.translate.get('META.DESCRIPTION').
            subscribe( s =>  this.meta.addTag({ name: 'description', content: s }));
    }

    updateMETA() {
        this.translate.get('META.TITLE').
            subscribe( s =>  this.meta.updateTag({ name: 'title', content: s }));
        this.translate.get('META.DESCRIPTION').
            subscribe( s =>  this.meta.updateTag({ name: 'description', content: s }));
    }

}
