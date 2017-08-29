import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HostDetails } from '../common-components/host.details';

@Injectable()
export class SsoService {
    private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) { }

    initiateSSO(): Observable<boolean>  {
        return this.http.get('sso/')
            .map(res => res)
            .catch(this.handleError);
    }

    validateSSO(): Observable<string> {
        let url = 'sso/ValidateSSO';
        console.log("URL" , url);
        return this.http
                 .post(url, {headers: this.headers})
                 .map(res => res.json())
                 .catch(this.handleError);
    }

    getHostDetails(): Observable<HostDetails>  {
        return this.http.get('modulepage/')
            .map(this.extractData)
            .catch(this.handleError);
    }

    loginWithSSO() {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let url = 'sso/getent';
      return this.http.get(url)
        .map(res => res)
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

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
