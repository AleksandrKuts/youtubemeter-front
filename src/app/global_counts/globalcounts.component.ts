import { Component, OnInit } from '@angular/core';
import { GlobalCountsService } from './globalcounts.service';
import { GlobalCounts } from '../backend/backend';

@Component({
  selector: 'app-globalcounts',
  templateUrl: './globalcounts.component.html',
    styleUrls: ['./globalcounts.component.css']
})
export class GlobalCountsComponent implements OnInit {
  globalCounts: GlobalCounts;

  constructor( private globalCountsService: GlobalCountsService) {
      console.log('GlobalCountsComponent constructor');
  }

  ngOnInit() {
      console.log('GlobalCountsComponent ngOnInit');
      console.log('GlobalCountsComponent, this.globalCounts: ', this.globalCounts);
  }

}
