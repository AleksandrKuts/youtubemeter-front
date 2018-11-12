import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { PlayLists, PlayList, YoutubeVideo, YoutubeVideoShort, Metric } from './backend';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { MessageService } from '../message.service';


@Injectable( {
    providedIn: 'root',
} )
export class BackEndService {
    private PlayListsUrl: string;
    private adminPlayListUrl: string;
    private getUrlByVideoId: string;
    private getUrlMetricsByVideoId: string;
    private getUrlVideosByPlaylistId: string;

    private handleError: HandleError;


    constructor( private http: HttpClient,
        httpErrorHandler: HttpErrorHandler, private messageService: MessageService ) {

        this.handleError = httpErrorHandler.createHandleError( 'PlayListsService' );
        this.PlayListsUrl = environment.URL_BACKEND + '/playlists';
        this.adminPlayListUrl = environment.URL_BACKEND + '/playlists/admin';
        this.getUrlByVideoId = environment.URL_BACKEND + '/view/video';
        this.getUrlMetricsByVideoId = environment.URL_BACKEND + '/view/metrics';
        this.getUrlVideosByPlaylistId = environment.URL_BACKEND + '/view/videos';
    }

    getPlayLists(onlyEnable: boolean): Observable<PlayLists> {
        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        let url = this.adminPlayListUrl;
        if ( onlyEnable ) {
            url = this.PlayListsUrl;
        }
        const options = { params: params };

        return this.http.get<PlayLists>( url, options )
            .pipe(
            catchError( this.handleError( 'getPlayLists', null ) )
            );

    }


    addPlayList( playlist: PlayList ): Observable<{}> {
        let params = new HttpParams();

        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };

        return this.http.post<PlayList>( this.adminPlayListUrl, playlist, options )
            .pipe(
            tap( _ => this.messageService.addSuccess( 'Доданий запис:<br />' + playlist.title + ' (' + playlist.id + ')' ) ),
            catchError( this.handleError( 'addPlayList', playlist ) )
            );
    }

    updatePlayList( id: string, playlist: PlayList ): Observable<PlayList> {
        if ( id === undefined ) {
            this.messageService.addError('playlist id is emtpy');
            return new Observable;
        }

        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };
        const url = `${this.adminPlayListUrl}/${id}`;

        return this.http.put<PlayList>( url, playlist, options )
            .pipe(
            tap( _ => this.messageService.addSuccess( 'Оновлений запис:<br />' + playlist.title + ' (' + playlist.id + ')') ),
            catchError( this.handleError( 'updatePlayList', playlist ) )
            );
    }

    deletePlayList( playlist: PlayList ): Observable<{}> {
        let params = new HttpParams();

        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };
        const url = `${this.adminPlayListUrl}/${playlist.id}`;

        return this.http.delete( url, options )
            .pipe(
            tap( _ => this.messageService.addSuccess( 'Видалений запис:<br />' + playlist.title + ' (' + playlist.id + ')' ) ),
            catchError( this.handleError( 'deletePlayList', playlist ) )
            );
    }

    getVideoId(id: string): Observable<YoutubeVideo> {
        if ( id === undefined ) {
            this.messageService.addError('video id is emtpy');
            return new Observable;
        }

        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };
        const url = `${this.getUrlByVideoId}/${id}`;

        return this.http.get<YoutubeVideo>( url, options )
            .pipe(
            catchError( this.handleError( 'getVideoId', null ) )
            );

    }

    getMetricsByVideoId(id: string, dateFrom: Date, dateTo: Date): Observable<Metric[]> {
        if ( id === undefined ) {
            this.messageService.addError('video id is emtpy');
            return new Observable;
        }

        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );
        if ( dateFrom ) {
            params = params.set( 'from', dateFrom.valueOf().toString() );
        }
        if ( dateTo ) {
            params = params.set( 'to', dateTo.valueOf().toString() );
        }

        const options = { params: params };
        const url = `${this.getUrlMetricsByVideoId}/${id}`;

        return this.http.get<Metric[]>( url, options )
            .pipe(
            catchError( this.handleError( 'getMetricsByVideoId', null ) )
            );
    }

    getVideosByPlaylistId(id: string): Observable<YoutubeVideoShort[]> {
        if ( id === undefined ) {
            this.messageService.addError('playlist id is emtpy');
            return new Observable;
        }

        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };
        const url = `${this.getUrlVideosByPlaylistId}/${id}`;

        return this.http.get<YoutubeVideoShort[]>( url, options )
            .pipe(
            catchError( this.handleError( 'getVideosByPlaylistId', null ) )
            );
    }

}

