import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateFormat' })
export class MomentPipe implements PipeTransform {
    transform(value: number, dateFormat: string): any {
//        const days = Math.floor(value / 86400000);
//        value = value % 86400000;
        value = value / 1000000;

        const hours = Math.floor(value / 3600000);
        value = value % 3600000;
        const minutes = Math.floor(value / 60000);
        value = value % 60000;
        const seconds = Math.floor(value / 1000);

        return (hours ? hours + 'h' : '') + (minutes ? minutes + 'm' : '') + (seconds ? seconds + 's' : '');

   }
}
