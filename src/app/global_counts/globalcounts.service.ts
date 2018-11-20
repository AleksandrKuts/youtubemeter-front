import { Injectable } from '@angular/core';
import { BackEndService } from '../backend/backend.service';
import { GlobalCounts } from '../backend/backend';

@Injectable()
export class GlobalCountsService {
    globalCounts: GlobalCounts;

    constructor( private backEndService: BackEndService ) {
        this.getGlobalCounts();
    }

    getGlobalCounts() {
        console.log('globalCounts: ', this.globalCounts);
        if ( this.globalCounts === undefined ) {
            this.getGlobalCountsFromService();
        } else {
            const now = new Date();
            const update = new Date( this.globalCounts.timeupdate );
            const diff = now.valueOf() - update.valueOf();

            console.log('diff: ', diff);

            if ( diff > this.globalCounts.periodvideocache ) {
                this.getGlobalCountsFromService();
            }
        }
    }

    getGlobalCountsFromService() {
        this.backEndService.getGlobalCounts().subscribe(
            g => {
                if ( g ) {
                    this.globalCounts = g;

                    console.log('globalCounts: ', this.globalCounts);
                }
            } );
    }

}
