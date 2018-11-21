import { Component } from '@angular/core';
import { GlobalCountsService } from './globalcounts.service';
import { GlobalCounts } from '../backend/backend';

@Component({
  selector: 'app-globalcounts',
  templateUrl: './globalcounts.component.html',
    styleUrls: ['./globalcounts.component.css']
})
export class GlobalCountsComponent {
  globalCounts: GlobalCounts;

  constructor( private globalCountsService: GlobalCountsService) {
  }
}
