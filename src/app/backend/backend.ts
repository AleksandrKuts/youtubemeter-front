export interface PlayLists {
    maxvideocount: number;
    playlists: PlayList[];
}


export interface PlayList {
    id: string;
    title: string;
    enable: boolean;
    idch: string;
    timeadd: Date;
    countvideo: number;
}

export interface YoutubeVideo {
    idpl: string;
    title: string;
    description: string;
    chtitle: string;
    chid: string;
    publishedat: string;
    count: number;
    mintime: Date;
    maxtime: Date;
}

export interface YoutubeVideoShort {
    id: string;
    title: string;
    publishedat: string;
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
    countpl: number;
    countvideo: number;
    maxcountvideo: number;
    periodvideocache: number;
    version: string;
    listenadmin: boolean;
}
