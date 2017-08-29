import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() { }
    
    public breakArray(n: number, list) {
        if (typeof n === "undefined" || n == 0) n = 10;
        if (list.length == 0) return [];
        
        var x = 0;
        var y = 0;
        var smList = [];
        do {
            smList[y] = [];
            for (var z = 0; z < n; z++) {
                if (list[x]) smList[y].push(list[x]);
                x++;
            }
            y++;
        } while (x < list.length);
        return smList;

    }


}
