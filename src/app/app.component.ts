import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
} )
export class AppComponent {
    langSelect: any;

    tagLanguage = 'langinterface';

    constructor( public translate: TranslateService, private cookieService: CookieService ) {
        translate.addLangs( ['en', 'ua', 'ru'] );
        translate.setDefaultLang( 'ua' );
    }

    ngOnInit(): void {
        const lang = this.cookieService.get( this.tagLanguage );

        if ( lang && lang.match( /en|ua|ru/ ) ) {
            this.langSelect = lang;
        } else {
            this.langSelect = 'ua';
        }

        this.translate.use( this.langSelect );
    }

    setLang() {
        this.cookieService.set( this.tagLanguage, this.langSelect );
        this.translate.use( this.langSelect );
    }

}
