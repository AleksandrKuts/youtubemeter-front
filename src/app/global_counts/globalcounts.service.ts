import { Injectable } from '@angular/core';
import { GlobalCounts } from '../backend/backend';

@Injectable()
export class GlobalCountsService {
    globalCounts: GlobalCounts;

    constructor( ) {
        console.log('GlobalCountsService constructor');
    }

    refresh(globalCounts: GlobalCounts) {
        this.globalCounts = globalCounts;
       console.log('GlobalCountsComponent refresh: ', globalCounts);
    }
}
