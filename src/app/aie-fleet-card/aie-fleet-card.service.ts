import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
// Converting the response to JSON
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { AIEFleetCard } from './aie-fleet-card';
import { Customer } from './Customer';

@Injectable()
export class AieFleetCardService {      
  //private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
  private headers = new Headers({'Content-Type': 'application/json'});
    
  constructor(private http: Http) { }
    getFCTs(zone: string, lid: string, customer: string, reportType: string, startDate: string, endDate: string): Observable<AIEFleetCard[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("zone", zone);
        params.set("lid", lid);
        params.set("customerNumber", customer);
        params.set("reportType", reportType);
        params.set("startDate", startDate);
        params.set("endDate", endDate);
        this.options.search = params;
        
        return this.http.get('fct/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getCustomers(zone: string, lid: string): Observable<string[]>{
        console.log("Customer: " + zone + "       " + lid);
        let params: URLSearchParams = new URLSearchParams();
        params.set("zone", zone);
        params.set("lid", lid);
        this.options.search = params;
        
        let customers = this.http.get('fct/customers', this.options)
            .map(this.extractCustomerNumber)
            .catch(this.handleError);
        
        console.log("Customer 2: ", customers || { });
        
        return customers;
    }
        
    getLIDs(zone: string): Observable<string[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("zone", zone);
        this.options.search = params;
        
        return this.http.get('fct/lids', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getFMCs(region: string): Observable<string[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("region", region);
        this.options.search = params;
        
        return this.http.get('fct/fmcs', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getBOACs(region: string): Observable<string[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("region", region);
        this.options.search = params;
        
        return this.http.get('fct/boacs', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSerials(region: string): Observable<string[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("region", region);
        this.options.search = params;
        
        return this.http.get('fct/serials', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    setGasTankSize(fct, tank): Observable<AIEFleetCard[]> {
        console.log("Made it into the service where: " + fct.fct_class + fct.fct_tag + fct.fct_gas_tank_size);
        let url = 'fct/'+fct.fct_class+'/'+fct.fct_tag+'/'+tank;
        console.log("URL: ", url);
         return this.http
                 .post(url, JSON.stringify(fct), {headers: this.headers})
                 .map(res => res.json())
                 .catch(this.handleError);
    }
    
    saveBillBacks(fctsToUpdate : AIEFleetCard[]): Observable<boolean> {
        for (let fct of fctsToUpdate){
            delete fct.fct_toUpdate;
        }
        let url = 'fct/billback';
        console.log(JSON.stringify(fctsToUpdate));
        let httpPost = this.http
                .post(url, JSON.stringify(fctsToUpdate), {headers: this.headers})
                .map(res => res.json())
                .catch(this.handleError);
        
        console.log("Bill Backs Sent to Back End");
        return httpPost;
    }
    

    private extractData(res: Response) {
        let body = res.json();
        console.log("body: ", body || { });
        return body || { };
    }
    
    private extractCustomerNumber(res: Response) {
        let body = res.json()
        let result = [];
        let region = "";
        let fmc = "";
        let boac = "";
        let serial = "";
        
        for (let customer of body){
            region = "";
            fmc = "";
            boac = customer[2];
            serial = customer[3];
            
            if (customer[0] < 10) {
                region = "0"+customer[0].toString();
            } else {
                region = customer[0].toString();
            }
            
            if (customer[1] < 10){
                fmc = "0"+customer[1].toString();
            }
            else {
                fmc = customer[1].toString();
            }
            
            if (boac == null || boac == ""){
                boac = "000000"
            }
            if (serial == null || serial == ""){
                serial = "000"
            }
            
            let custString = region+"-"+fmc+"-"+"00"+"-"+boac+"-"+serial;
            result.push(custString);
        }
        console.log("result: ", result || { });
        return result;
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
