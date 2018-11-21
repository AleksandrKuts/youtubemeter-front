import { Component } from '@angular/core';
import { BackEndService } from '../backend/backend.service';

@Component({
  selector: 'app-globalcounts',
  templateUrl: './globalcounts.component.html',
    styleUrls: ['./globalcounts.component.css']
})
export class GlobalCountsComponent {

  constructor( public backEndService: BackEndService) {
  }
}
