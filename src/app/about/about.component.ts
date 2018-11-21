import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { BackEndService } from '../backend/backend.service';

@Component( {
    selector: 'app-about',
    template: `<div [innerHTML]="myVal"></div>`
})

export class AboutComponent implements OnInit {
    myVal: any;

    constructor(private http: HttpClient, public translate: TranslateService,
            private backEndService: BackEndService) {

        const url = '/assets/html/about-' + translate.currentLang + '.html';
        console.log('AboutComponent constructor');

        http.get(url, { responseType: 'text' })
        .subscribe(
           html => this.myVal = html) ;
    }

    ngOnInit() {
        console.log('AboutComponent ngOnInit');
        this.backEndService.getGlobalCounts();
    }
}

