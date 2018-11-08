import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { BackEndService } from '../../backend/backend.service';
import { PlayList, YoutubeVideo, Metric } from '../../backend/backend';
import { MessageService } from '../../message.service';
import { TranslateService } from '@ngx-translate/core';

@Component( {
    selector: 'videometrics',
    templateUrl: './videometrics.component.html',
    styleUrls: ['./videometrics.component.css']
} )

export class VideoMetricsComponent implements OnInit {
    mode = 'Observable';

    metrics: Metric[];
    metricsDiff: Metric[];

    dateFrom: Date;
    dateTo: Date;

    newDateFrom: Date;
    newDateTo: Date;
    videoId: string;
    editVideoId: string;

    youtubeVideo: YoutubeVideo;

    chartData: any;
    chartOptions: any;

    chartDiffData: any;
    chartDiffOptions: any;

    butRequestText: string;

    LANG_METRICS_METRICS: string;
    LANG_METRICS_FROM: string;
    LANG_METRICS_TO: string;
    LANG_METRICS_CHANGE: string;
    LANG_METRICS_LIKES: string;
    LANG_METRICS_DISLIKES: string;
    LANG_METRICS_COMMENTS: string;
    LANG_METRICS_VIEWS: string;

    hidenLike = false;
    hidenDisLike = false;
    hidenComment = false;
    hidenView = false;
    hidenDiffLike = false;
    hidenDiffDisLike = false;
    hidenDiffComment = false;
    hidenDiffView = false;

    setValueLang() {
        this.translate.get('METRICS.METRICS').subscribe( s => this.LANG_METRICS_METRICS = s );
        this.translate.get('METRICS.FROM').subscribe( s => this.LANG_METRICS_FROM = s );
        this.translate.get('METRICS.TO').subscribe( s => this.LANG_METRICS_TO = s );
        this.translate.get('METRICS.CHANGE').subscribe( s => this.LANG_METRICS_CHANGE = s );
        this.translate.get('METRICS.LIKES').subscribe( s => this.LANG_METRICS_LIKES = s );
        this.translate.get('METRICS.DISLIKES').subscribe( s => this.LANG_METRICS_DISLIKES = s );
        this.translate.get('METRICS.COMMENTS').subscribe( s => this.LANG_METRICS_COMMENTS = s );
        this.translate.get('METRICS.VIEWS').subscribe( s => this.LANG_METRICS_VIEWS = s );
    }

    constructor( public translate: TranslateService, private route: ActivatedRoute, private backEndService: BackEndService,
            private messageService: MessageService ) {

    }

    ngOnInit() {
        this.dateFrom = undefined;
        this.dateTo = undefined;
        this.videoId = '';

        this.route.queryParams.subscribe(( p ) => {
            const dateFrom = p['from'];
            if ( dateFrom ) {
                this.dateFrom = dateFrom;
            }

            const dateTo = p['to'];
            if ( dateFrom ) {
                this.dateTo = dateTo;
            }

            const videoId = p['idvideo'];
            if ( videoId ) {
                this.editVideoId = videoId;
            }
        } );

        this.setValueLang();

        this.getMetrics();
    }

    resetRequest() {
        this.newDateTo = this.newDateFrom;
        this.newDateFrom = undefined;
        this.editVideoId = this.videoId;
    }

    getMetrics() {
        console.log('-----------------------------');
        console.log(this.hidenLike, this.hidenDisLike, this.hidenDisLike, this.hidenView);
        console.log(this.hidenDiffLike, this.hidenDiffDisLike, this.hidenDiffDisLike, this.hidenDiffView);
        if ( this.chartData && this.chartData.datasets ) {
            console.log('1');
            console.log(this.chartData);
            this.hidenLike = this.chartData.datasets[0].showLine;
            this.hidenDisLike = this.chartData.datasets[1].showLine;
            this.hidenComment = this.chartData.datasets[2].showLine;
            this.hidenView = this.chartData.datasets[3].showLine;
        }

        if ( this.chartDiffData && this.chartDiffData.datasets ) {
            console.log('2');
            console.log(this.chartDiffData.datasets);
            this.hidenDiffLike = this.chartDiffData.datasets[0].showLine;
            this.hidenDiffDisLike = this.chartDiffData.datasets[1].showLine;
            this.hidenDiffComment = this.chartDiffData.datasets[2].showLine;
            this.hidenDiffView = this.chartDiffData.datasets[3].showLine;
        }
        console.log(this.hidenLike, this.hidenDisLike, this.hidenDisLike, this.hidenView);
        console.log(this.hidenDiffLike, this.hidenDiffDisLike, this.hidenDiffDisLike, this.hidenDiffView);

        if (  this.newDateFrom === undefined && this.newDateTo === undefined ) {
            this.dateFrom = undefined;
            this.dateTo = undefined;

            this.getMetricsByDates(this.dateFrom, this.dateTo);
        } else {
            this.getMetricsByDates(this.newDateFrom, this.newDateTo);
        }
    }

    getMetricsByDates(dateFrom: Date, dateTo: Date) {
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

                    let isFirst = true;
                    for ( const metric of metrics ) {
                        comments.push( { x: metric.mtime, y: metric.comment } );
                        likes.push( { x: metric.mtime, y: metric.like } );
                        dislikes.push( { x: metric.mtime, y: metric.dislike } );
                        views.push( { x: metric.mtime, y: metric.view } );

                        if ( isFirst ) {
                            commentsDiff.push( { x: metric.mtime, y: 0 });
                            likesDiff.push( { x: metric.mtime, y: 0 });
                            dislikesDiff.push( { x: metric.mtime, y: 0 });
                            viewsDiff.push( { x: metric.mtime, y: 0 });

                            isFirst = false;
                        } else {
                            commentsDiff.push( { x: metric.mtime, y: metric.comment - commentsPrev } );
                            likesDiff.push( { x: metric.mtime, y: metric.like - likesPrev } );
                            dislikesDiff.push( { x: metric.mtime, y: metric.dislike  - dislikesPrev } );
                            viewsDiff.push( { x: metric.mtime, y: metric.view - viewsPrev } );
                        }

                        commentsPrev = metric.comment;
                        likesPrev = metric.like;
                        dislikesPrev = metric.dislike;
                        viewsPrev = metric.view;
                    }


                    const minTime = new Date(metrics[0].mtime);
                    const maxTime = new Date(metrics[metrics.length - 1].mtime);
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
                        xStepSize = Math.ceil((diffTime / msInHour) / countLinesX);
                    } else if ( diffTime > countLinesX * msInMinutes ) {
                        xUnit = 'minute';
                        xStepSize = Math.ceil((diffTime / msInMinutes) / countLinesX);
                    } else if ( diffTime > msInMinutes ) {
                        xUnit = 'minute';
                        xStepSize = 1;
                    }

                    this.chartOptions = {
                            title: {
                                display: true,
                                text:   this.LANG_METRICS_FROM +
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
                                    title: function(tooltipItem, data) {
                                        let label = '';

                                        if ( tooltipItem && tooltipItem[0]) {
                                            label = new Date(tooltipItem[0].xLabel).toLocaleString();
                                        }

                                        return label;
                                    }
                                }
                            },
                            legend: {
                                position: 'bottom'
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
                                duration: 0, // general animation time
                            },
                            hover: {
                                animationDuration: 0, // duration of animations when hovering an item
                            },
                            responsiveAnimationDuration: 0, // animation duration after a resize
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
                                    title: function(tooltipItem, data) {
                                        let label = '';

                                        if ( tooltipItem && tooltipItem[0]) {
                                            label = new Date(tooltipItem[0].xLabel).toLocaleString();
                                        }

                                        return label;
                                    }
                                }
                            },
                            legend: {
                                position: 'bottom',
                                onClick: function(e, legendItem) {
                                    const index = legendItem.datasetIndex;
                                    const ci = this.chart;
                                    const meta = ci.getDatasetMeta(index);

                                    console.log(this.mode);

                                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

                                    ci.update();
                                }
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
                                duration: 0, // general animation time
                            },
                            hover: {
                                animationDuration: 0, // duration of animations when hovering an item
                            },
                            responsiveAnimationDuration: 0, // animation duration after a resize
                        };

                    this.chartDiffData = {
                        datasets: [
                            {
                                label: this.LANG_METRICS_LIKES,
                                borderColor: 'green',
                                data: likesDiff,
                                hidden: this.hidenDiffLike
                            },
                            {
                                label: this.LANG_METRICS_DISLIKES,
                                backgroundColor: 'transparent',
                                borderColor: 'red',
                                data: dislikesDiff,
                                hidden: this.hidenDiffDisLike
                            },
                            {
                                label: this.LANG_METRICS_COMMENTS,
                                borderColor: 'black',
                                data: commentsDiff,
                                hidden: this.hidenDiffComment
                            },
                            {
                                label: this.LANG_METRICS_VIEWS,
                                borderColor: 'blue',
                                data: viewsDiff,
                                hidden: this.hidenDiffComment
                            }
                        ]
                    };

                    this.metrics = metrics;
                    this.dateFrom = this.metrics[0].mtime;
                    this.dateTo = this.metrics[this.metrics.length - 1].mtime;

                    this.newDateFrom = undefined;
                    this.newDateTo = undefined;

                    if (this.videoId !== this.editVideoId) {
                        this.videoId = this.editVideoId;
                        this.getVideo(this.videoId);
                    }
                }

            } );

    }

    getVideo(videoId: string) {
        this.backEndService.getVideoId(this.editVideoId).subscribe(
                youtubeVideo => {
                    if ( youtubeVideo.title !== 'NOT_DATA' ) {
                        this.youtubeVideo = youtubeVideo;
                    }
                }
        );
    }

    selectData( event, br ) {
        console.log(event.element._chart.legend.legendItems[0].hidden);

        const selectedDate = new Date(this.metrics[+event.element._index].mtime);

        if ( this.newDateFrom === undefined && this.newDateTo === undefined ) {
            this.newDateFrom = selectedDate;
        } else if ( this.newDateFrom !== undefined && this.newDateTo !== undefined ) {
            this.newDateFrom = undefined;
            this.newDateTo = undefined;
        } else if ( this.newDateFrom !== undefined ) {
            this.setDates(this.newDateFrom, selectedDate);
        } else {
            this.setDates(this.newDateTo, selectedDate);
        }
    }

    setDates(d1: Date, d2: Date) {
        if (d1 > d2 ) {
            this.newDateFrom = d2;
            this.newDateTo = d1;
        } else {
            this.newDateFrom = d1;
            this.newDateTo = d2;
        }
    }
}

