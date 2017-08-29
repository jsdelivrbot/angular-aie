
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
// Converting the response to JSON
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
 
import { AieMiscExtended }  from './aie-misc'; // defined in aie-misc.ts
import { dc } from '../common-components/common-structures';
import { id } from '../common-components/common-structures';


@Injectable()
export class AieMiscService {
    
    private options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }
    getMiscRecords(vin, startDate, endDate, srchRadio, srchChk, srchAmt): Observable<AieMiscExtended[]> {
        console.log("getMiscRecords for vin >" + vin + "<");
        let params: URLSearchParams = new URLSearchParams();
        params.set("vin", vin);
        params.set("startDate", startDate);
        params.set("endDate"  , endDate);
        params.set("srchRadio", srchRadio);
        params.set("srchChk"  , srchChk);
        params.set("srchAmt"  , srchAmt);
        
        this.options.search = params;
        
        return this.http.get('MiscAIE/', this.options)  
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getDCByClassTag(agencyCl: string, tag: string): Observable<dc[]> {
        console.log("getDC for class and tag >" + agencyCl + "-" + tag + "<");
        let params: URLSearchParams = new URLSearchParams();
        params.set("agencyCl", agencyCl);
        params.set("tag", tag);
        this.options.search = params;
        
        let dcs = this.http.get('common/DCollector/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
        console.log("in AieMiscService - got DCs " + dcs);
        return dcs;

    }

    getIDByClassTag(agencyCl: string, tag: string): Observable<id[]> {
        console.log("getID for class and tag >" + agencyCl + "-" + tag + "<");
        let params: URLSearchParams = new URLSearchParams();
        params.set("agencyCl", agencyCl);
        params.set("tag", tag);
        this.options.search = params;
        
        let ids = this.http.get('common/IDetail/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
        console.log("in AieMiscService - got IDs " + ids);
        return ids;

    }

    saveBillBacksMisc(fctsToUpdate: AieMiscExtended[]): Observable<AieMiscExtended[]> {
        let url = "MiscAIE/";
        console.log(JSON.stringify(fctsToUpdate));
        let httpPost = this.http
                .post(url, JSON.stringify(fctsToUpdate), {headers: this.headers})
                .map(res => res.json())
                .catch(this.handleError);
        
        console.log("Aie-Misc Bill Backs Sent to Back End");
        return httpPost;
    }

    private extractData(res: Response) {
        let body = res.json();
        console.log("body: ", body || { });
        return body;
    }
    
    private extractSingleObject(res: Response) {
        let body = res.json();
        console.log("body: ", body || { });
        return body || { };
    }
    
    private handleError(error: any): Promise<any> {
          console.error('An error occurred', error); // for demo purposes only
          return Promise.reject(error.message || error);
    }

}
