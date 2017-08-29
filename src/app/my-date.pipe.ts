import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

  transform(value: number): String {
        let dString: string = value.toString();     
        let year: string = dString.substring(0,4);
        let month: string = dString.substring(4,6);
        let day: string = dString.substring(6,8);
        let dateString: string = year + "-" + month + "-" + day;
        
        return month+"/"+day+"/"+year;
  }
}
