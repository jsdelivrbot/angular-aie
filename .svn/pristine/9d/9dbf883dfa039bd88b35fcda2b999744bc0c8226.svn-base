import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams  } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
 
import { TagGetCustVehComponent } from './tag-get-cust-veh.component';

@Injectable()
export class TagGetCustVehService {
    private options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});        
    private headers = new Headers({'Content-Type': 'application/json'});

    // Dependency injection
    constructor(private http: Http) { }
    
      getCustVeh(agencyCl: string, tag: string): Observable<any> {
        //console.log("getCustVeh agencyCl >" + agencyCl + "< tag >" + tag + "<");
        
        let params: URLSearchParams = new URLSearchParams();
        params.set("agencyCl", agencyCl);
        params.set("tag", tag);
        this.options.search = params;
        
        return this.http.get('common/tagGetCustAndVeh/', this.options)  
            .map(this.extractData)
            .catch(this.handleError);
        
    }

    private extractData(res: Response) {
        let body = res.json();
        //console.log("body: ", body || { });
       return body;
    }
    
    private extractSingleObject(res: Response) {
        let body = res.json();
        //console.log("body: ", body || { });
        return body || { };
    }
    
    
    private handleError(error: any): Promise<any> {
          console.error('An error occurred', error); // for demo purposes only
          return Promise.reject(error.message || error);
    }

}
