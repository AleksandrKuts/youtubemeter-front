import { Injectable } from '@angular/core';
import { GlobalCounts } from '../backend/backend';

@Injectable()
export class GlobalCountsService {
    globalCounts: GlobalCounts;

    constructor( ) {
    }

    refresh(globalCounts: GlobalCounts) {
        this.globalCounts = globalCounts;
    }
}
