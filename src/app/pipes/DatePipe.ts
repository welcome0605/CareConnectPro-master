import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'custumDate'
})
export class DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let currentDate = new Date();
    let splitDate = value.split(' ');
    value = splitDate[0].split('-');
    let mydate = new Date(value[2], value[1] - 1, value[0]);
    if (currentDate.getFullYear() !== mydate.getFullYear() || currentDate.getDay() !== mydate.getDay() || currentDate.getMonth() !== mydate.getMonth()) {
      const month = mydate.toLocaleString('en-us', {month: 'long'});
      return value[0] + ' ' + month;
    } else {
      return splitDate[1];
    }
  }
}
