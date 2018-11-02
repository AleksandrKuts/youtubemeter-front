import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { BackEndService } from '../../backend/backend.service';
import { PlayList, YoutubeVideo, Metric } from '../../backend/backend';
import { MessageService } from '../../message.service';

@Component( {
    selector: 'videometrics',
    templateUrl: './videometrics.component.html',
    styleUrls: ['./videometrics.component.css']
} )

export class VideoMetricsComponent implements OnInit {
    mode = 'Observable';

    metrics: Metric[];

    dateFrom: Date;
    dateTo: Date;

    newDateFrom: Date;
    newDateTo: Date;
    videoId: string;
    editVideoId: string;

    youtubeVideo: YoutubeVideo;

    chartData: any;
    chartOptions: any;

    butRequestText: string;

    constructor( private route: ActivatedRoute, private backEndService: BackEndService,
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

        this.getMetrics();
    }

    resetRequest() {
        this.newDateTo = this.newDateFrom;
        this.newDateFrom = undefined;
        this.editVideoId = this.videoId;
    }

    getMetrics() {
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

                if ( metrics ) {
                    for ( const metric of metrics ) {
                        comments.push( { x: metric.mtime, y: metric.comment } );
                        likes.push( { x: metric.mtime, y: metric.like } );
                        dislikes.push( { x: metric.mtime, y: metric.dislike } );
                        views.push( { x: metric.mtime, y: metric.view } );
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
                                text: 'Метрики з  ' + minTime.toLocaleString() + '   по  ' + maxTime.toLocaleString() +
                                ', метрик: ' + metrics.length,
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
                                label: 'Лайків',
                                borderColor: 'green',
                                data: likes
                            },
                            {
                                label: 'Дизлайків',
                                backgroundColor: 'transparent',
                                borderColor: 'red',
                                data: dislikes
                            },
                            {
                                label: 'Коментарів',
                                borderColor: 'black',
                                data: comments
                            },
                            {
                                label: 'Переглядів',
                                borderColor: 'blue',
                                data: views
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

    selectData( event ) {
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

