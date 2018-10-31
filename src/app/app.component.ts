import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Статистика роботи каналів Youtube';

  constructor(public translate: TranslateService) {
      translate.addLangs(['en', 'ua', 'ru']);
      translate.setDefaultLang('ua');

      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|ua|ru/) ? browserLang : 'ua');
    }

}
