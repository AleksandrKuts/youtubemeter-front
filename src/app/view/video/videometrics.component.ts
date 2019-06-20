import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackEndService } from '../../backend/backend.service';
import { YoutubeVideo, Metric } from '../../backend/backend';
import { TranslateService } from '@ngx-translate/core';
import { UIChart } from 'primeng/primeng';
import { Title } from '@angular/platform-browser';
import { MessageService } from '../../message.service';
import { Meta } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';

@Component( {
    selector: 'app-videometrics',
    templateUrl: './videometrics.component.html',
    styleUrls: ['./videometrics.component.css']
} )

export class VideoMetricsComponent implements OnInit {
    @ViewChild( 'metricschart' ) metricsChart: UIChart;
    @ViewChild( 'metricsdiffchart' ) metricsDiffChart: UIChart;

    metrics: Metric[];

    dateFrom: Date;
    dateTo: Date;

    newDateFrom: Date;
    newDateTo: Date;
    videoId: string;
    editVideoId: string;

    curUrl: string;
    fullUrlVideo: string;

    youtubeVideo: YoutubeVideo;

    chartData: any;
    chartOptions: any;

    chartDiffData: any;
    chartDiffOptions: any;

    LANG_METRICS_METRICS: string = 'metrics';
    LANG_METRICS_FROM: string = 'from';
    LANG_METRICS_TO: string = 'to';
    LANG_METRICS_CHANGE: string = 'change';
    LANG_METRICS_LIKES: string = 'likes';
    LANG_METRICS_DISLIKES: string = 'dislikes';
    LANG_METRICS_COMMENTS: string = 'comments';
    LANG_METRICS_VIEWS: string = 'views';
    LANG_DATE_ALREADY_SELECTED: string = 'Date already selected';

    hidenLike: boolean;
    hidenDisLike: boolean;
    hidenComment: boolean;
    hidenView: boolean;
    hidenDiffLike: boolean;
    hidenDiffDisLike: boolean;
    hidenDiffComment: boolean;
    hidenDiffView: boolean;

    onClickLegendChart = ( function( e, legendItem ) {
        const index = legendItem.datasetIndex;
        const ci = this.metricsChart.chart;
        const meta = ci.getDatasetMeta( index );

        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
        ci.update();
        this.setRefUrl();
    }).bind(this);

    onClickLegendDiffChart = ( function( e, legendItem ) {
        const index = legendItem.datasetIndex;
        const ci = this.metricsDiffChart.chart;
        const meta = ci.getDatasetMeta( index );

        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
        ci.update();
        this.setRefUrl();
    }).bind(this);


    /**
     * Встановлення написів на графіках згідно з обраною мовою. Потрібне оновлення сторінки
     */
    setValueLang() {
        this.translate.get( 'METRICS.METRICS' ).subscribe( s => this.LANG_METRICS_METRICS = s );
        this.translate.get( 'METRICS.FROM' ).subscribe( s => this.LANG_METRICS_FROM = s );
        this.translate.get( 'METRICS.TO' ).subscribe( s => this.LANG_METRICS_TO = s );
        this.translate.get( 'METRICS.CHANGE' ).subscribe( s => this.LANG_METRICS_CHANGE = s );
        this.translate.get( 'METRICS.LIKES' ).subscribe( s => this.LANG_METRICS_LIKES = s );
        this.translate.get( 'METRICS.DISLIKES' ).subscribe( s => this.LANG_METRICS_DISLIKES = s );
        this.translate.get( 'METRICS.COMMENTS' ).subscribe( s => this.LANG_METRICS_COMMENTS = s );
        this.translate.get( 'METRICS.VIEWS' ).subscribe( s => this.LANG_METRICS_VIEWS = s );
        this.translate.get( 'METRICS.DATE_ALREADY_SELECTED' ).subscribe( s => this.LANG_DATE_ALREADY_SELECTED = s );
    }

    constructor( public translate: TranslateService, private route: ActivatedRoute,
        private backEndService: BackEndService, private titleService: Title,
        private meta: Meta, private messageService: MessageService) {

        this.curUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
		this.setValueLang();
    }

    isValidDate( date ) {
        return !!( Object.prototype.toString.call( date ) === '[object Date]' && +date );
    }

    ngOnInit() {
        this.dateFrom = undefined;
        this.dateTo = undefined;
        this.videoId = '';
        this.hidenLike = false;
        this.hidenDisLike = false;
        this.hidenComment = false;
        this.hidenView = false;
        this.hidenDiffLike = false;
        this.hidenDiffDisLike = false;
        this.hidenDiffComment = false;
        this.hidenDiffView = false;

        this.route.queryParams.subscribe(( p ) => {
            const dateFrom = p['from'];
            if ( dateFrom ) {
                const dt = new Date( +dateFrom );

                if ( this.isValidDate( dt ) ) {
                    this.dateFrom = dt;
                    this.newDateFrom = dt;
                }
            }

            const dateTo = p['to'];
            if ( dateTo ) {
                const dt = new Date( +dateTo );

                if ( this.isValidDate( dt ) ) {
                    this.dateTo = dt;
                    this.newDateTo = dt;
                }
            }

            const videoId = p['idvideo'];
            if ( videoId ) {
                this.editVideoId = videoId;
            }

            const hidenLike = p['like'];
            if ( hidenLike ) {
                this.hidenLike = true;
            }

            const hidenDisLike = p['dislike'];
            if ( hidenDisLike ) {
                this.hidenDisLike = true;
            }

            const hidenComment = p['comment'];
            if ( hidenComment ) {
                this.hidenComment = true;
            }

            const hidenView = p['view'];
            if ( hidenView ) {
                this.hidenView = true;
            }

            const hidenDiffLike = p['difflike'];
            if ( hidenDiffLike ) {
                this.hidenDiffLike = true;
            }

            const hidenDiffDisLike = p['diffdislike'];
            if ( hidenDiffDisLike ) {
                this.hidenDiffDisLike = true;
            }

            const hidenDiffComment = p['diffcomment'];
            if ( hidenDiffComment ) {
                this.hidenDiffComment = true;
            }

            const hidenDiffView = p['diffview'];
            if ( hidenDiffView ) {
                this.hidenDiffView = true;
            }
        } );

        this.setValueLang();
        delay(500);
        this.getMetrics();
    }

    resetRequest() {
        this.newDateTo = this.newDateFrom;
        this.newDateFrom = undefined;
        this.editVideoId = this.videoId;
    }

    getMetrics() {
        this.setHideLegends();

        if ( this.newDateFrom === undefined && this.newDateTo === undefined ) {
            this.dateFrom = undefined;
            this.dateTo = undefined;

            this.getMetricsByDates( this.dateFrom, this.dateTo );
        } else {
            this.getMetricsByDates( this.newDateFrom, this.newDateTo );
        }
    }

    getMetricsByDates( dateFrom: Date, dateTo: Date ) {
        this.backEndService.getMetricsByVideoId( this.editVideoId, dateFrom, dateTo ).subscribe(
            metrics => {
                const comments: any[] = [];
                const likes: any[] = [];
                const dislikes: any[] = [];
                const views: any[] = [];

                const commentsDiff: any[] = [];
                const likesDiff: any[] = [];
                const dislikesDiff: any[] = [];
                const viewsDiff: any[] = [];

                if ( metrics ) {
                    let commentsPrev: number;
                    let likesPrev: number;
                    let dislikesPrev: number;
                    let viewsPrev: number;
                    let mtimePrev: Date;

                    let isFirst = true;
                    for ( const metric of metrics ) {
                        comments.push( { x: metric.mtime, y: metric.comment } );
                        likes.push( { x: metric.mtime, y: metric.like } );
                        dislikes.push( { x: metric.mtime, y: metric.dislike } );
                        views.push( { x: metric.mtime, y: metric.view } );

                        if ( isFirst ) {
                            isFirst = false;
                        } else {
                            commentsDiff.push( { x: mtimePrev, y: metric.comment - commentsPrev } );
                            likesDiff.push( { x: mtimePrev, y: metric.like - likesPrev } );
                            dislikesDiff.push( { x: mtimePrev, y: metric.dislike - dislikesPrev } );
                            viewsDiff.push( { x: mtimePrev, y: metric.view - viewsPrev } );
                        }

                        commentsPrev = metric.comment;
                        likesPrev = metric.like;
                        dislikesPrev = metric.dislike;
                        viewsPrev = metric.view;
                        mtimePrev = metric.mtime;
                    }
                    if ( mtimePrev ) {
                        commentsDiff.push( { x: mtimePrev, y: 0 } );
                        likesDiff.push( { x: mtimePrev, y: 0 } );
                        dislikesDiff.push( { x: mtimePrev, y: 0 } );
                        viewsDiff.push( { x: mtimePrev, y: 0 } );

                    }

                    /**
                     * Встановлення потрібної часової сітки
                     */
                    const minTime = new Date( metrics[0].mtime );
                    const maxTime = new Date( metrics[metrics.length - 1].mtime );
                    const diffTime = maxTime.valueOf() - minTime.valueOf();

                    const msInMinutes = 60000;
                    const msInHour = 3600000;
                    const msInDay = 86400000;

                    const countLinesX = 50;

                    let xUnit = 'month';
                    let xStepSize = 1;

                    if ( diffTime > countLinesX * msInDay ) {
                        xUnit = 'day';
                        xStepSize = 1;
                    } else if ( diffTime > countLinesX * msInHour ) {
                        xUnit = 'hour';
                        xStepSize = Math.ceil(( diffTime / msInHour ) / countLinesX );
                    } else if ( diffTime > countLinesX * msInMinutes ) {
                        xUnit = 'minute';
                        xStepSize = Math.ceil(( diffTime / msInMinutes ) / countLinesX );
                    } else if ( diffTime > msInMinutes ) {
                        xUnit = 'minute';
                        xStepSize = 1;
                    }

                    this.chartOptions = {
                        title: {
                            display: true,
                            text: this.LANG_METRICS_FROM +
                            minTime.toLocaleString() +
                            this.LANG_METRICS_TO +
                            maxTime.toLocaleString() +
                            this.LANG_METRICS_METRICS +
                            metrics.length,
                            fontSize: 12
                        },
                        tooltips: {
                            mode: 'nearest',
                            backgroundColor: '#696969',
                            callbacks: {
                                title: function( tooltipItem, data ) {
                                    let label = '';

                                    if ( tooltipItem && tooltipItem[0] ) {
                                        label = new Date( tooltipItem[0].xLabel ).toLocaleString();
                                    }

                                    return label;
                                }
                            }
                        },
                        legend: {
                            position: 'bottom',
                            onClick: this.onClickLegendChart
                        },
                        elements: {
                            line: {
                                tension: 0,
                                backgroundColor: 'transparent',
                                borderWidth: 2
                            },
                            point:
                            {
                                radius: 2,
                                hitRadius: 2,
                                hoverRadius: 2
                            }
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                distribution: 'linear',
                                time: {
                                    unit: xUnit,
                                    stepSize: xStepSize,
                                    displayFormats: {
                                        second: 'HH:mm:ss',
                                        minute: 'HH:mm',
                                        hour: 'DD_HH:mm',
                                        day: 'DD.MM',
                                        week: 'DD.MM.YYYY',
                                        month: 'MM.YYYY',
                                        quarter: 'MM.YYYY',
                                        year: 'YYYY'
                                    }
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        },
                        animation: {
                            duration: 0,
                        },
                        hover: {
                            animationDuration: 0,
                        },
                        responsiveAnimationDuration: 0,
                    };

                    this.chartData = {
                        datasets: [
                            {
                                label: this.LANG_METRICS_LIKES,
                                borderColor: 'green',
                                data: likes,
                                hidden: this.hidenLike
                            },
                            {
                                label: this.LANG_METRICS_DISLIKES,
                                backgroundColor: 'transparent',
                                borderColor: 'red',
                                data: dislikes,
                                hidden: this.hidenDisLike
                            },
                            {
                                label: this.LANG_METRICS_COMMENTS,
                                borderColor: 'black',
                                data: comments,
                                hidden: this.hidenComment
                            },
                            {
                                label: this.LANG_METRICS_VIEWS,
                                borderColor: 'blue',
                                data: views,
                                hidden: this.hidenView
                            }
                        ]
                    };

                    this.chartDiffOptions = {
                        title: {
                            display: true,
                            text: this.LANG_METRICS_CHANGE
                        },
                        tooltips: {
                            mode: 'nearest',
                            backgroundColor: '#696969',
                            callbacks: {
                                title: function( tooltipItem, data ) {
                                    let label = '';

                                    if ( tooltipItem && tooltipItem[0] ) {
                                        label = new Date( tooltipItem[0].xLabel ).toLocaleString();
                                    }

                                    return label;
                                }
                            }
                        },
                        legend: {
                            position: 'bottom',
                              onClick: this.onClickLegendDiffChart
                        },
                        elements: {
                            line: {
                                tension: 0,
                                borderWidth: 1
                            },
                            point:
                            {
                                radius: 1,
                                hitRadius: 1,
                                hoverRadius: 1
                            }
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                distribution: 'linear',
                                time: {
                                    unit: xUnit,
                                    stepSize: xStepSize,
                                    displayFormats: {
                                        second: 'HH:mm:ss',
                                        minute: 'HH:mm',
                                        hour: 'DD_HH:mm',
                                        day: 'DD.MM',
                                        week: 'DD.MM.YYYY',
                                        month: 'MM.YYYY',
                                        quarter: 'MM.YYYY',
                                        year: 'YYYY'
                                    }
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        },
                        animation: {
                            duration: 0,
                        },
                        hover: {
                            animationDuration: 0,
                        },
                        responsiveAnimationDuration: 0,
                    };

                    this.chartDiffData = {
                        datasets: [
                            {
                                label: this.LANG_METRICS_LIKES,
                                borderColor: 'green',
                                data: likesDiff,
                                hidden: this.hidenDiffLike,
                                steppedLine: true
                            },
                            {
                                label: this.LANG_METRICS_DISLIKES,
                                borderColor: 'red',
                                data: dislikesDiff,
                                hidden: this.hidenDiffDisLike,
                                steppedLine: true
                            },
                            {
                                label: this.LANG_METRICS_COMMENTS,
                                borderColor: 'black',
                                data: commentsDiff,
                                hidden: this.hidenDiffComment,
                                steppedLine: true
                            },
                            {
                                label: this.LANG_METRICS_VIEWS,
                                borderColor: 'blue',
                                data: viewsDiff,
                                hidden: this.hidenDiffView,
                                steppedLine: true
                            }
                        ]
                    };

                    this.metrics = metrics;
                    this.dateFrom = this.metrics[0].mtime;
                    this.dateTo = this.metrics[this.metrics.length - 1].mtime;

                    if ( this.videoId !== this.editVideoId ) {
                        this.videoId = this.editVideoId;
                        this.getVideo();
                    }

                    this.setRefUrl();
                }

            } );

    }

    getVideo() {
        this.backEndService.getVideoId( this.editVideoId ).subscribe(
            youtubeVideo => {
                if ( youtubeVideo.title !== 'NOT_DATA' ) {
                    this.youtubeVideo = youtubeVideo;
                    this.setTitle( youtubeVideo.title );
                }
            }
        );
    }

    selectData( event ) {
        const selectedDate = new Date( this.metrics[+event.element._index].mtime );

        if ( this.newDateFrom === undefined && this.newDateTo === undefined ) {
            this.newDateFrom = selectedDate;
        } else if ( this.newDateFrom !== undefined && this.newDateTo !== undefined ) {
            this.newDateFrom = selectedDate;
            this.newDateTo = undefined;
        } else if ( this.newDateFrom !== undefined ) {
            if (this.newDateFrom.valueOf() !== selectedDate.valueOf()) {
                this.setDates( this.newDateFrom, selectedDate );
            } else {
                this.messageService.addWarn( this.LANG_DATE_ALREADY_SELECTED );
            }
        } else {
            if (this.newDateTo.valueOf() !== selectedDate.valueOf()) {
                this.setDates( this.newDateTo, selectedDate );
            } else {
                this.messageService.addWarn( this.LANG_DATE_ALREADY_SELECTED );
            }
        }
    }

    setDates( d1: Date, d2: Date ) {
        if ( d1 > d2 ) {
            this.newDateFrom = d2;
            this.newDateTo = d1;
        } else {
            this.newDateFrom = d1;
            this.newDateTo = d2;
        }
    }

    setRefUrl(): string {
        this.setHideLegends();

        let url = 'video?idvideo=' + this.videoId;

        if ( this.newDateFrom ) {
            url = url + '&from=' + this.newDateFrom.valueOf();
        }
        if ( this.newDateTo ) {
            url = url + '&to=' + this.newDateTo.valueOf();
        }
        if ( this.hidenLike && this.hidenLike === true ) {
            url = url + '&like=false';
        }
        if ( this.hidenDisLike && this.hidenDisLike === true ) {
            url = url + '&dislike=false';
        }
        if ( this.hidenComment && this.hidenComment === true ) {
            url = url + '&comment=false';
        }
        if ( this.hidenView && this.hidenView === true ) {
            url = url + '&view=false';
        }
        if ( this.hidenDiffLike && this.hidenDiffLike === true ) {
            url = url + '&difflike=false';
        }
        if ( this.hidenDiffDisLike && this.hidenDiffDisLike === true ) {
            url = url + '&diffdislike=false';
        }
        if ( this.hidenDiffComment && this.hidenDiffComment === true ) {
            url = url + '&diffcomment=false';
        }
        if ( this.hidenDiffView && this.hidenDiffView === true ) {
            url = url + '&diffview=false';
        }

        this.fullUrlVideo = this.curUrl + '/' + url;

        return url;
    }

    setHideLegends() {
        if ( this.metricsChart && this.metricsChart.chart &&
                this.metricsChart.chart.legend.legendItems.length === 4 ) {
            this.hidenLike = this.metricsChart.chart.legend.legendItems[0].hidden;
            this.hidenDisLike = this.metricsChart.chart.legend.legendItems[1].hidden;
            this.hidenComment = this.metricsChart.chart.legend.legendItems[2].hidden;
            this.hidenView = this.metricsChart.chart.legend.legendItems[3].hidden;
        }

        if ( this.metricsDiffChart && this.metricsDiffChart.chart &&
                this.metricsDiffChart.chart.legend.legendItems.length === 4 ) {
            this.hidenDiffLike = this.metricsDiffChart.chart.legend.legendItems[0].hidden;
            this.hidenDiffDisLike = this.metricsDiffChart.chart.legend.legendItems[1].hidden;
            this.hidenDiffComment = this.metricsDiffChart.chart.legend.legendItems[2].hidden;
            this.hidenDiffView = this.metricsDiffChart.chart.legend.legendItems[3].hidden;
        }
    }

    setTitle( title: string ) {
        this.translate.get( 'METRICS.TITLE' ).subscribe( s => {
                this.titleService.setTitle( s + ': ' + title );
                this.updateMETA(title);
            }
        );
    }

    updateMETA(title: string) {
        this.translate.get( 'META.TITLE_VIDEOS' ).
            subscribe( s => this.meta.updateTag( { name: 'title', content: s } ) );
        this.translate.get( ['META.DESCRIPTION_V1', 'META.DESCRIPTION_V2'] ).
            subscribe( s => this.meta.updateTag( { name: 'description', content: s['META.DESCRIPTION_V1'] +
                ': ' + title + ' - ' + s['META.DESCRIPTION_V2']} ) );
    }

}

