import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myTime'
})
export class MyTimePipe implements PipeTransform {

  transform(value: number): string {
      if(value > 999) {
        let timeString: string = value.toString();
        let hours: string = timeString.substring(0,2);
        let minutes: string = timeString.substring(2,4);
        return hours + ":" + minutes;
       }
      else if (value < 1000 && value > 0) {
        let timeString: string = value.toString();
        let hours: string = timeString.substring(0,1);
        let minutes: string = timeString.substring(1,3);
        return hours + ":" + minutes;
      }
      else {
          return "0:00"
      }
  }

}
