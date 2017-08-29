import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
// Converting the response to JSON
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { AieMultCust } from './aie-multiple';
import { AieMultVeh } from './aie-multiple';
import { AieMultDataToUpd } from './aie-multiple';
import {Region } from './region';

@Injectable()
export class AieMultipleService {
        
  private options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
  private headers = new Headers({'Content-Type': 'application/json'});
    
    // Dependency injection
    constructor(private http: Http) { }

    getRegions(): Observable<Region[]> {
        return this.http.get('common/region/')
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getCustFmcRecords(region:string): Observable<string[]> {
        console.log("Service region:"+region);
        return this.http.get('AieMultiple/'+ region)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getCustomers(region: number, fmc: number): Observable<string[]>{
        console.log("Customer for region " + region + " and fmc " + fmc);
        let params: URLSearchParams = new URLSearchParams();
        params.set("region", region.toString()   );
        params.set("fmc", fmc.toString()  );
        this.options.search = params;
        
//        let customers = this.http.get('AieMultiple/', this.options)
        let customers = this.http.get('AieMultiple/' + region + '/' + fmc)
            .map(this.extractCustomerNumber)
            .catch(this.handleError);
        
        console.log("Customers said region and fmc: ", customers  || { });
        
        return customers;
    }
    
    getAieMultiples(region: number, fmc: number, subFmc: number, boac: string, serial: number): Observable<any> {
        console.log("AieMultiple.service: in call getAieMultiples call" );
        let params: URLSearchParams = new URLSearchParams();
        
        params.set("region", region.toString() );
        params.set("fmc", fmc.toString() );     
        params.set("subFmc", subFmc.toString() );  
        params.set("boac", boac);     
        params.set("serial", serial.toString() );  
       
        this.options.search = params;
        return this.http.get('AieMultiple/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }


//    updCustomerVehTags(tagsToUpd : AieMultVeh[]): Observable<AieMultVeh[]> {
    updCustomerVehTags(aieMultDataToUpd : AieMultDataToUpd): Observable<boolean> {
        
        console.log("Made it into updCustomerVehTags Service Function " + JSON.stringify(aieMultDataToUpd));
        let url = 'AieMultiple/upd/';
        console.log("URL: ", url);

        return this.http
            .post(url, JSON.stringify(aieMultDataToUpd), {headers: this.headers})
//          .map(res => res.json())
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        console.log("body: ", body || { });
        return body || { };
    }
    
    private extractSingleObject(res: Response) {
        let body = res.json();
        console.log("body: ", body || { });
        return body || { };
    }
    
   private extractCustomerNumber(res: Response) {
        let body = res.json()
        let result = [];
        let region = "";
        let fmc = "";
        let subFmc = "";
        let boac = "";
        let serial = "";
        
//       console.log("Extact customers from: " + JSON.stringify(body) );
       
        for (let customer of body){
            region = "";
            fmc = "";
            subFmc = "";
            serial = "";
            boac = customer.boac;

            
//          console.log("cust:" + JSON.stringify(customer.cu_Region) );
            
            if (customer.cu_Region < 10) {
                region = "0"+customer.cu_Region.toString();
            } else {
                region = customer.cu_Region.toString();
            }

            if (customer.fmc < 10){
                fmc = "0"+customer.fmc.toString();
            }
            else {
                fmc = customer.fmc.toString();
            }
            
            if (customer.subFMC < 10){
                subFmc = "0"+customer.subFMC.toString();
            }
            else {
                subFmc = customer.subFMC.toString();
            }
            
            if (customer.serial < 10){
                serial = "00"+customer.serial.toString();
            }
            else
            if (customer.serial < 100){
                serial = "0"+customer.serial.toString();
            }
            else {
                serial = customer.serial.toString();
            }
            
            if (boac == null || boac == ""){
                boac = "000000"
            }
            
            let custString = region+"-"+fmc+"-"+subFmc+"-"+boac+"-"+serial;
            result.push(custString);
        }
        console.log("result: ", result || { });
        return result;
    }
    
    private handleError(error: any): Promise<any> {
          console.error('AieMultipleService - An error occurred', error); // for demo purposes only
          return Promise.reject(error.message || error);
    }
}
