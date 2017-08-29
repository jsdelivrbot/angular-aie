/**
 * sale-aie.service.ts typescript
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
// Converting the response to JSON
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
 
import {SaleAie } from './sale-aie';
import {Region } from './region';
import {SaleAieRecords } from './saleAieRecords';
import {VehSaRepairs } from './vehSaRepairs';


@Injectable()
export class SaleAieService {
    // private headers = new Headers({'Content-Type': 'application/json'});
    private options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
    private headers = new Headers({'Content-Type': 'application/json'});
    // Dependency injection
    constructor(private http: Http) { }
    
    getRegions(): Observable<Region[]> {
        return this.http.get('common/region/')
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getSaleNumbers(region:string): Observable<string[]> {
        // let params: URLSearchParams = new URLSearchParams();
        // params.set("region", region);
        // this.options.search = params;
        console.log("Service region:"+region);
        return this.http.get('saleAie/'+ region)
            .map(this.extractData)
            .catch(this.handleError);
    }
   
   //This getSSVehVsrRecs() method is triggered from sale-aie.component and sends query to server 
    getSSVehVsrRecs(saleNo:string): Observable<SaleAieRecords[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("saleNo", saleNo);
//        params.set("agencyCl", agencyCl);
//        params.set("tag", tag);
        this.options.search = params;
        return this.http.get('saleAie/saleAieRecords/', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    //This getSSVehVsrRecs() method is triggered from sale-aie.component and sends query to server 
    getSSVehVsrRecsForTag(agency_Cl:string, tag:string): Observable<SaleAieRecords[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set("agency_Cl", agency_Cl);
        params.set("tag", tag);
        this.options.search = params;
        return this.http.get('saleAie/saleAieRecords/tag', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
        
    //Delete VSR record - not in use
/*    
    setSaleAieDeleteVsrOld (vsrDelete: VehSaRepairs): Observable<boolean> {
        console.log(" sale-aie service @ 76 - vsrDelete.vsr_Agency_Cl:" + vsrDelete.vsr_Agency_Cl);
        let url = 'saleAie/deleteVsr';
        
        console.log(JSON.stringify(vsrDelete)); //JSON.stringify - converting class object to string
        let httpDelete = this.http
             //   .delete(url, {body: vsrDelete}) // passing whole record object to controller
                .delete(url, JSON.stringify(vsrDelete),{headers: this.headers}) 
                .map(res => res.json())
                .catch(this.handleError);
        
        console.log("setSaleAieDeleteVsr called for delete");
        return httpDelete;
    }
  */  
    setSaleAieUpdate(saleAiesToUpdate : SaleAieRecords[]): Observable<String> {
        let url = 'saleAie/updateSaleAie';
        //console.log("setSaleAieUpdate:" ,JSON.stringify(saleAiesToUpdate));
        let httpPost = this.http
                .post(url, JSON.stringify(saleAiesToUpdate), {headers: this.headers})
                .map(res => res)
                .catch(this.handleError);
        
        console.log(httpPost) ;
        return httpPost;
    }
    
//    setSaleAieDeleteVsr (saleNo:string, tagId:string): Observable<boolean> {
//        let url = 'saleAie/deleteVsr/' + saleNo + '/' + tagId
//        let httpDelete = this.http
//            .delete(url, {headers: this.headers})
//            .map(res => res.json())
//            .catch(this.handleError);
//        
//        console.log("setSaleAieDeleteVsr called for delete");
//        return httpDelete;
//    }
    
    setSaleAieDeleteVsr (vsrDto:VehSaRepairs): Observable<boolean> {
        let url = 'saleAie/deleteVsr'
        let httpDelete = this.http
            .post(url, JSON.stringify(vsrDto), {headers: this.headers})
            .map(res => res.json())
            .catch(this.handleError);
        
        console.log("setSaleAieDeleteVsr called for delete");
        return httpDelete;
    }
    
    
    //Create VSR record
    setSaleAieCreateVsr (vsrCreate: VehSaRepairs): Observable<boolean> {
        console.log(" sale-aie service @ 90 - vsrCreate.vsr_Agency_C:" + vsrCreate.vsr_Agency_Cl + vsrCreate.vsr_Sale + vsrCreate.vsr_Item_Id);
        let url = 'saleAie/createVsr';
        
        console.log(JSON.stringify(vsrCreate)); //JSON.stringify - converting class object to string
        let httpPost = this.http
                .post(url, JSON.stringify(vsrCreate), {headers: this.headers})
                .map(res => res.json())
                .catch(this.handleError);
        
        console.log("setSaleAieCreateVsr called for create VSR");
        return httpPost;
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
    
    
    private handleError(error: any): Promise<any> {
          console.error('An error occurred', error); // for demo purposes only
          return Promise.reject(error.message || error);
    }
    
}
