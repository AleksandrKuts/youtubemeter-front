import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Channels, Channel, YoutubeVideo, YoutubeVideoShort, Metric, GlobalCounts } from './backend';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { MessageService } from '../message.service';

@Injectable( {
    providedIn: 'root',
} )
export class BackEndService {
    private UrlChannels: string;
    private UrlAdmin: string;
    private UrlVideo: string;
    private UrlMetrics: string;
    private UrlVideos: string;
    private UrlGlobalCounts: string;

    private handleError: HandleError;

    public globalCounts: GlobalCounts;

    constructor( private http: HttpClient, httpErrorHandler: HttpErrorHandler,
            private messageService: MessageService) {

        this.handleError = httpErrorHandler.createHandleError( 'ChannelsService' );
        this.UrlChannels = environment.URL_BACKEND + '/channels';
        this.UrlAdmin = environment.URL_BACKEND + '/channels/admin';
        this.UrlVideo = environment.URL_BACKEND + '/view/video';
        this.UrlMetrics = environment.URL_BACKEND + '/view/metrics';
        this.UrlVideos = environment.URL_BACKEND + '/view/videos';
        this.UrlGlobalCounts = environment.URL_BACKEND + '/view/counts';
    }

    getChannels( onlyEnable: boolean ): Observable<Channels> {
        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        let url = this.UrlAdmin;
        if ( onlyEnable ) {
            url = this.UrlChannels;
        }
        const options = { params: params };

        return this.http.get<Channels>( url, options )
            .pipe(
                catchError( this.handleError( 'getChannels', null ) )
            );
    }


    addChannel( playlist: Channel ): Observable<{}> {
        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );
        const options = { params: params };

        return this.http.post<Channel>( this.UrlAdmin, playlist, options )
            .pipe(
                tap( _ => this.messageService.addSuccess( 'Доданий запис:<br />' +
                     playlist.title + ' (' + playlist.id + ')')
                ),
                catchError( this.handleError( 'addChannel', playlist ) )
            );
    }

    updateChannel( id: string, playlist: Channel ): Observable<Channel> {
        if ( id === undefined ) {
            this.messageService.addError( 'playlist id is emtpy' );
            return new Observable;
        }

        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };
        const url = `${this.UrlAdmin}/${id}`;

        return this.http.put<Channel>( url, playlist, options )
            .pipe(
                tap( _ => this.messageService.addSuccess( 'Оновлений запис:<br />' +
                        playlist.title + ' (' + playlist.id + ')' )
                ),
                catchError( this.handleError( 'updateChannel', playlist ) )
            );
    }

    deleteChannel( playlist: Channel ): Observable<{}> {
        let params = new HttpParams();

        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };
        const url = `${this.UrlAdmin}/${playlist.id}`;

        return this.http.delete( url, options )
            .pipe(
                tap( _ =>
                    this.messageService.addSuccess( 'Видалений запис:<br />' +
                        playlist.title + ' (' + playlist.id + ')' )
                ),
                catchError( this.handleError( 'deleteChannel', playlist ))
            );
    }

    getVideoId( id: string ): Observable<YoutubeVideo> {
        if ( id === undefined ) {
            this.messageService.addError( 'video id is emtpy' );
            return new Observable;
        }

        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };
        const url = `${this.UrlVideo}/${id}`;

        return this.http.get<YoutubeVideo>( url, options )
            .pipe(
                catchError( this.handleError( 'getVideoId', null ) )
        );
    }

    getMetricsByVideoId( id: string, dateFrom: Date, dateTo: Date ): Observable<Metric[]> {
        if ( id === undefined ) {
            this.messageService.addError( 'video id is emtpy' );
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
        const url = `${this.UrlMetrics}/${id}`;

        return this.http.get<Metric[]>( url, options )
            .pipe(
                catchError( this.handleError( 'getMetricsByVideoId', null ) )
            );
    }

    getVideosByChannelId( id: string, skip: number ): Observable<YoutubeVideoShort[]> {
        if ( id === undefined ) {
            this.messageService.addError( 'playlist id is emtpy' );
            return new Observable;
        }

        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );
        if ( skip !== undefined ) {
            params = params.set( 'skip', skip.toString() );
        }

        const options = { params: params };
        const url = `${this.UrlVideos}/${id}`;

        return this.http.get<YoutubeVideoShort[]>( url, options )
            .pipe(
                catchError( this.handleError( 'getVideosByChannelId', null ) )
            );
    }

    getVideos( skip: number ): Observable<YoutubeVideoShort[]> {
        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );
        if ( skip !== undefined ) {
            params = params.set( 'skip', skip.toString() );
        }

        const options = { params: params };
        const url = `${this.UrlVideos}`;

        return this.http.get<YoutubeVideoShort[]>( url, options )
            .pipe(
                catchError( this.handleError( 'getVideos', null ) )
        );
    }

    getGlobalCounts(): Observable<GlobalCounts> {
        if ( this.globalCounts !== undefined ) {
            const now = new Date();
            const update = new Date( this.globalCounts.timeupdate );
            const diff = now.valueOf() - update.valueOf();
            if ( diff < this.globalCounts.periodvideocache ) {
                return of( this.globalCounts );
            }
        }
        return this.getGlobalCountsFromService();
    }

    getGlobalCountsFromService(): Observable<GlobalCounts> {
        let params = new HttpParams();
        params = params.set( 'req', Date.now().toString() );

        const options = { params: params };

        return this.http.get<GlobalCounts>( this.UrlGlobalCounts, options )
            .pipe(
                    tap( event => {
                        this.globalCounts = event;
                    }),
                    catchError( this.handleError( 'UrlGlobalCounts', null ) )
            );
    }

    loadConfigurationData(): Promise<GlobalCounts> {
        return new Promise( (resolve, reject) => {
        this.http.get( this.UrlGlobalCounts ).toPromise().then( result => {
                const data = result as any;
                this.globalCounts = data;
                resolve();
            }).catch(this.handleErrorPromise());
        });
    }

    handleErrorPromise(data?: any) {
        return (error: any ) => {
          console.log(error);
        };
    }
}

