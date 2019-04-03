export interface Channels {
    maxvideocount: number;
    channels: Channel[];
}

export interface Channel {
    id: string;
    title: string;
    enable: boolean;
    timeadd: Date;
    countvideo: number;
}

export interface YoutubeVideo {
    title: string;
    description: string;
    idch: string;
    chtitle: string;
    publishedat: string;
    count: number;
    mintime: Date;
    maxtime: Date;
    duration: number;
}

export interface YoutubeVideoShort {
    id: string;
    title: string;
    publishedat: string;
    duration: number;
}

export interface Metric {
    comment: number;
    like: number;
    dislike: number;
    view: number;
    mtime: Date;
}

export interface GlobalCounts {
    timeupdate: Date;
    countch: number;
    countvideo: number;
    maxcountvideo: number;
    periodvideocache: number;
    version: string;
    listenadmin: boolean;
}
