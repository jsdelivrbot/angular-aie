import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroPadder'
})
export class ZeroPadderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
