import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams  } from '@angular/http';
// Converting the response to JSON
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { repairAieExtended } from './repair-aie';
import { dc } from '../common-components/common-structures';
import { id } from '../common-components/common-structures';
import { postData } from './repair-aie';

@Injectable()
export class RepairAieService {
    private options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    getAieRepairs(vehDtTime: string): Observable<repairAieExtended[]> {
        //console.log("getAieRepairs for vehDtTime >" + vehDtTime + "<");
        let params: URLSearchParams = new URLSearchParams();
        params.set("vehDtTime", vehDtTime);
        this.options.search = params;

        return this.http.get('RepairAIE/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getAieRepairsCriteria(vehDtTime: string, startDate: string, endDate: string, optionAll: boolean, reason: string, amount: string): Observable<repairAieExtended[]> {
        //console.log("getAieRepairsCriteria for vehDtTime >" + vehDtTime + "<", startDate, endDate, optionAll, reason, amount);
        //console.log("in criteria");
        let params: URLSearchParams = new URLSearchParams();
        params.set("vehDtTime", vehDtTime);
        params.set("startDate", startDate);
        params.set("endDate", endDate);
        if (optionAll) {
            params.set("showAll", "true");
        } else {
            params.set("showAll", "false")
        }

        params.set("repReason", reason);
        params.set("repAmount", amount);
        //console.log(params);
        this.options.search = params;

        return this.http.get('RepairAIE/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDCByClassTag(agencyCl: string, tag: string): Observable<dc[]> {
        //console.log("getDC for class and tag >" + agencyCl + "-" + tag + "<");
        let params: URLSearchParams = new URLSearchParams();
        params.set("agencyCl", agencyCl);
        params.set("tag", tag);
        this.options.search = params;

        let dcs = this.http.get('common/DCollector/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
        return dcs;

    }

    getIDByClassTag(agencyCl: string, tag: string): Observable<id[]> {
        //console.log("getID for class and tag >" + agencyCl + "-" + tag + "<");
        let params: URLSearchParams = new URLSearchParams();
        params.set("agencyCl", agencyCl);
        params.set("tag", tag);
        this.options.search = params;

        let ids = this.http.get('common/IDetail/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
        //console.log("in repairAIEService - got IDS " + ids);
        return ids;

    }



    createBillBacks(toBillBack: postData): Observable<Boolean> {
        console.log("updating", toBillBack);
        //postData.

        return this.http
            .post('RepairAIE/create/', JSON.stringify(toBillBack), {headers: this.headers})
            .map(this.extractData)
            .catch(this.handleError);

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
