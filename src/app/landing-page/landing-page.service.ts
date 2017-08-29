import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SecurityRecord } from '../common-components/common-structures';

@Injectable()
export class LandingPageService {

  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) { }
    
    getLIDs(entName: string): Observable<string[]>  {
        return this.http.get('modulepage/lids/' + entName)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getSecurityRecord(lid: string): Observable<SecurityRecord>  {
        return this.http.get('modulepage/security/' + lid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        console.log("body: ", body || { });
        return body || { };
    }

    private handleError(error: any): Promise<any> {
          console.error('An error occurred: ', error); // for demo purposes only
          return Promise.reject(error.message || error);
    }
}
