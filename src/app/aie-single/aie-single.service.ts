import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
// Converting the response to JSON
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { DataCollector } from './AieSingle';


@Injectable()
export class AieSingleService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
    private headers = new Headers({ 'Content-Type': 'application/json' });


    // Dependency injection
    constructor(private http: Http) { }

    saveAieSingle(aieSingle: string): Observable<boolean> {
        let url = 'aiesingle/save';
        console.log("URL: " + url);
        console.log("AieSIngle =" + aieSingle);

        return this.http
            .post(url, aieSingle, { headers: this.headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    getCostAcctForSalesCode(salesCode: string, selectedCostAcct) {

        console.log("salesCd: " + salesCode + " selected cost Acct: " + selectedCostAcct);
        let costAcct = "";
        switch (salesCode) {
            //case "V3": //already defined below
            case "X2":
                costAcct = "";
                break;
            case "Q1":
            case "A1":
            case "A8":
                costAcct = "";
                break;
            case "V3":
                costAcct = "161";
                break;
            case "U2":
            case "U3":
                if (null !== selectedCostAcct && selectedCostAcct !== ""
                    && (selectedCostAcct === "145" || selectedCostAcct === "170"
                        || selectedCostAcct === "172" || selectedCostAcct === "180"
                        || selectedCostAcct === "811")) {
                    costAcct = selectedCostAcct;
                } else {
                    costAcct = "145";
                }
                break;
            case "P1":
                costAcct = "511";
                break;
            case "V4":
                costAcct = "191";
                break;
            default:
                break;

        }
        console.log("Cost Acct: " + costAcct);
        return costAcct;
    }

    getSalesCodeForCostAcct(costAcct: string, selectedSalesCode: string) {

        console.log("costAcct: " + costAcct);
        let salesCode = "";
        switch (costAcct) {
            //case "V3": //already defined below
            case "":
                salesCode = "X2";
                break;
            case "000":
                salesCode = "Q1";
                // 
                break;
            case "161":
                salesCode = "V3";
                break;
            case "145":
            case "170":
            case "172":
            case "180":
            case "811":
                if (null != selectedSalesCode && selectedSalesCode.trim() !== ""
                    && (selectedSalesCode === "U2" || selectedSalesCode === "U3")) {
                    salesCode = selectedSalesCode;
                } else {
                    salesCode = "U2"
                }
                break;
            case "511":
                salesCode = "P1";
                break;
            case "191":
                salesCode = "V4";
                break;
            default:
                break;

        }
        console.log("salesCode: " + salesCode);

        return salesCode;
    }


    private extractData(res: Response) {
        let body = res.json();
        console.log("body: ", body || {});
        return body || {};
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


}
