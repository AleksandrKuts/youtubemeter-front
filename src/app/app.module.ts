import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePipe} from '@angular/common';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { HttpClientModule } from '@angular/common/http';

import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';
import { MessagesComponent } from './messages/messages.component';

import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DialogModule} from 'primeng/dialog';
import {SpinnerModule} from 'primeng/spinner';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {GrowlModule} from 'primeng/growl';
import {TableModule} from 'primeng/table';
import {FieldsetModule} from 'primeng/fieldset';
import {PanelModule} from 'primeng/panel';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ChartModule } from 'primeng/chart';
import {OverlayPanelModule } from 'primeng/overlaypanel';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {DropdownModule} from 'primeng/dropdown';

import { CookieService } from 'ngx-cookie-service';

import { AdminComponent } from './admin/admin.component';
import { VideoMetricsComponent } from './view/video/videometrics.component';
import { VideoPlayListComponent } from './view/playlist/playlist.component';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    AdminComponent,
    VideoPlayListComponent,
    AboutComponent,
    VideoMetricsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PanelModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CheckboxModule,
    CalendarModule,
    DialogModule,
    SpinnerModule,
    KeyFilterModule,
    ConfirmDialogModule,
    GrowlModule,
    TableModule,
    FieldsetModule,
    MessagesModule,
    MessageModule,
    ChartModule,
    OverlayPanelModule,
    ScrollPanelModule,
    DropdownModule,
    routing
  ],
  providers: [HttpErrorHandler,
              MessageService,
              CookieService,
              ConfirmationService,
              DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
