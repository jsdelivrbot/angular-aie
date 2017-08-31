import { Component, OnInit, NgModule, ViewChild, EventEmitter, Output } from '@angular/core';
//For model driven forms
import { FormGroup, FormControlName, FormBuilder, Validators, FormControl, NgForm, FormsModule } from '@angular/forms';
// For services
import { AieMiscService } from './aie-misc.service';
import { customer } from '../common-components/common-structures';
import { vehicle } from '../common-components/common-structures';
import { dc } from '../common-components/common-structures';
import { id } from '../common-components/common-structures';
import { CommonService } from '../common-components/common.service';
import { DataService } from '../common-components/data.service';

import { NgDateRangePickerOptions } from 'ng-daterangepicker';
import { CompleterService, CompleterData } from 'ng2-completer';
import { LoadingBarComponent } from '../common-components/loading-bar/loading-bar.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap';
import { createCounterRangeValidator } from '../common-components/sales/sales.component';
import { SalesCodeSelectComponent } from '../common-components/sales-code-select/sales-code-select.component';
//to bring in the field definition for the repeated row
import { AieMisc }         from './aie-misc';   // exported by aie-misc.ts
import { AieMiscExtended } from './aie-misc';   // exported by aie-misc.ts
import { PagerComponent }  from 'ngx-bootstrap/pagination';
import * as moment from 'moment';

interface Validator<T extends FormControl> {
   (c:T): {[error: string]:any};
}

function validateAIEStatus(c: FormControl) {
  return (c.value == "" || c.value == " " || c.value == "P" || c.value == "B" || c.value == "S" || c.value == "T"  || c.value == "G" || c.value == "F" || c.value == "C") ? null : {
    validateStatus: {
      valid: true
    }
  };
}
function validateYesNo(c: FormControl) {
  return (typeof c.value === "undefined" || !c.value || c.value == "" || c.value == " " || c.value == "Y" || c.value == "N") ? null : {
    validateYesNo: {
      valid: true
    }
  };

}

@Component({
  selector: 'app-aie-misc',
  templateUrl: './aie-misc.component.html',
  styleUrls: ['./aie-misc.component.css', '../app.component.css']
})
export class AieMiscComponent implements OnInit {
        
    /*
   * @ViewChild allows you to directly access an instance of a child component.
   * This will allow you to access any public defined variables of the child
   * as well.
   * 
   * @ViewChild can also allow you to directly access local variables from
   * the view/html. And example can be seen in LoadingBarComponent.
   */
  @ViewChild(LoadingBarComponent) public loadingBarComponent: LoadingBarComponent; 
  @ViewChild(PopoverModule) public popoverModule: PopoverModule;
  @ViewChild('genericModal') public genericModal: ModalDirective;
  @ViewChild('paginationModule') public pager: PagerComponent;  
  @Output() updateFctDcId = new EventEmitter();
  @ViewChild('aiedescModal'     )      public aiedescModal:       ModalDirective;
    
    userLID: string;              // defined logged in user's Lid
    lvl1Perm: string;             // used by salesCode D1 or D2
    lvl2Perm: string;             // used by salesCode D1 or D2
    lvl5Perm: string;              
    lvl7Perm: string; 
    lvl8Perm: string;  
    agencyCl: string;
    tag: string;
    
    inResult: any;
    errorMessage: string;
    tagSearchForm;
    customer;
    vehicle;
    data;
    miscForm;

    origModalDesc;
    changedModalDesc;
    descChgSw;
    startDate: string = "";
    endDate: string = "";
    srchRadio: string = "A" ;    //allCharges; fuelCharges; carWashes;
    srchChk: string = "";
    srchAmt: number = 0.00;
    
 
    miscSearchForm;
    sysStatus: string ="";
    
    fct = [];

    desc1="";
    desc2="";
    desc3="";
    desc4="";

    fcts = new AieMisc("","","","",0,"",0,"",0,0,"",0,0,"","",0,"","","","",0,"","","","","",0,"");
    
    constructor(
        private aieMiscService: AieMiscService,
        private commonService: CommonService,
        private formBuilder: FormBuilder,
        private dataService: DataService
    ) { 
        this.miscForm = this.formBuilder.group({
            miscRows: this.formBuilder.array([]),
            modalDescriptionText: new FormControl(""),
        })
    }
    
          
    ngOnInit() {
        this.dataService.currentLid.subscribe(currentLid => this.userLID = currentLid);  // getting the logged in user Lid

        this.dataService.currentSecurityRecord.subscribe(           
        currentSecurityRecord =>  {
//              this.userLID = currentSecurityRecord.lid;
//              this.userRegion = currentSecurityRecord.region;
              this.lvl1Perm = currentSecurityRecord.lvl1Perm;    // get these lvl1 and lvl2 values from dataservice 
              this.lvl2Perm = currentSecurityRecord.lvl2Perm;
              this.lvl5Perm = currentSecurityRecord.lvl5Perm;     
              this.lvl7Perm = currentSecurityRecord.lvl7Perm;
              this.lvl8Perm = currentSecurityRecord.lvl8Perm;
             
        });      
        
        console.info("Logged in user's Lid :=" + this.userLID + "lvl1Perm:" + this.lvl1Perm + "lvl2Perm:" + this.lvl2Perm);
        
        
        this.tagSearchForm = new FormGroup({
            agencyCl:        new FormControl(""),
            tag:             new FormControl("")
        });
       
        this.miscSearchForm = new FormGroup({
            startDate: new FormControl(""),
            endDate:   new FormControl(""),
            srchRadio: new FormControl(""),
            srchChk:   new FormControl(""), 
            srchAmt:   new FormControl("")
        });
        
        this.data = null;
        this.vehicle = null;
        this.customer = null;

    }

 
            
    //handle change from datarangepicker component
    newDateRange(r) {
 //       console.log("Made it here");
        console.log("startDt: " +r.startDate +" endDt: " +r.endDate);
        let newStartDate = <moment.Moment> r.startDate;
        let newEndDate = <moment.Moment> r.endDate;

        this.startDate = newStartDate.format("YYYYMMDD"); 
        this.endDate = newEndDate.format("YYYYMMDD");
    }
    //handle change from tagGetCustAndVeh component 
    
    newCustAndVeh(cstAndVeh) {
       // if( typeof cstAndVeh.customer === "undefined")   // when it returns null value
        if ((typeof cstAndVeh.customer == undefined) || (!cstAndVeh.customer)) {  // when it returns null value
            this.customer = {};
            this.vehicle = {};
            console.log("Customer / Vehicle details are being returned as NULL..");
            this.sysStatus = "Customer / Vehicle details are being returned as NULL...";
        } else {
            this.customer = cstAndVeh.customer;
            this.vehicle  = cstAndVeh.vehicle;
            this.getMiscRecords();
        }
    };

    misc: AieMiscExtended[];
    miscPages = [];
    miscPage = [];
    currentPage: number;
    totalPages: number;
    startItem: number;
    endItem: number;
    totalItems: number;
    itemsPerPage: number = 20;
    
    haveNoPage: boolean = true;
    
    //Get all Fleet Card Transaction records to be displayed

    getMiscRecords() {
        
        if (this.startDate == null) {
            this.startDate = "";
        }
                       
        if (this.endDate == null) {
            this.endDate = "";
        }
                       
        if (this.srchRadio == null) {
            this.srchRadio = "A";
        }
                       
        if (this.srchChk == null) {
            this.srchChk = "";
        }
                    
        this.srchAmt = document.getElementById('srchAmt')["value"];
        
        if (this.srchAmt == null) {
            this.srchAmt = 0;
        }
        
        if ( isNaN(this.srchAmt) ) {
             alert ("Enter search Amount in format 99999.99");
             document.getElementById('srchAmt')["focus"];
             return false;
        }
 
        if (this.srchAmt > 99999.99 ) { 
           alert ("Amount is too large, maximum allowed Search amount is $99999.99");
           document.getElementById('srchAmt')["focus"];
           return false;
        }   
      
        this.sysStatus = "";

        let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
        element.disabled=true;
        this.aieMiscService.getMiscRecords(this.vehicle.vin, this.startDate, this.endDate, this.srchRadio, this.srchChk, this.srchAmt ) 
            .subscribe(
               misc => {
                  this.misc = misc;
                  for (let x of this.misc) { 
                    if (x.startDate == null) {
                        x.startDate = "";
                    }
                       
                    if (x.endDate == null) {
                        x.endDate = "";
                    }
                       
                    if (x.srchRadio == null) {
                        x.srchRadio = "A";
                    }
                       
                    if (x.srchChk == null) {
                        x.srchChk = "";
                    }
                    
                    if (x.srchAmt == null) {
                        x.srchAmt = 0;
                    }
                     
                    x.desc1 = "";
                    x.desc2 = "";
                    x.desc3 = "";
                    x.desc4 = "";
                    x.aieDesc = false;
                    x.fct_dc_found = " ";
                    x.fct_desc_upd = "";
                    x.fct_toUpdate = " ";
                    x.fct_orig_sales = " ";
                    x.fct_orig_cost = 0;
                    x.fct_billback_desc = "";
                    x.fct_vh_agency_cl = this.vehicle.vh_Agency_Cl,
                    x.fct_vh_tag = this.vehicle.vh_Tag,
                    x.fct_cu_region = this.customer.cu_Region,
                    x.fct_cu_boac = this.customer.boac;
                    if (x.fct_aie_status == "T") x.aie_credit = "Y";
                    if (x.fct_total_cost < 0)    x.scNegative = "Y"; 
                    if (x.fct_total_cost > 0)    x.scNegative = "N";   
                    if ((x.fct_orig_sales != "") && (x.fct_orig_sales != " "))   x.fct_sales_code  = x.fct_orig_sales;
                    if (x.fct_orig_cost  > 0)         x.fct_cost_account = x.fct_orig_cost;    
                    x.fct_orig_status = x.fct_aie_status;
                    x.po_number =" ";
                    x.fct_dc_lid = this.userLID;
                  }
                   this.totalItems = this.misc.length;
                   console.log("Before getDCByClassTag: ", this.totalItems);
                   if (this.totalItems > 0) {
                       this.getDCByClassTag();  // Get all Data Collector desc for the tag
                       this.getIDByClassTag();  // Get all Income detail 2 mos desc for the tag
                   } 
  
                   this.paginate();

                   this.sysStatus = "";
                   if ((this.totalItems == 0) || (this.misc == null)) {
                        this.sysStatus = "No Records found";
                   } else {
                       this.sysStatus = "Total records found: " + this.totalItems;
                   }
               },
               error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
                   this.miscForm.patchValue({message: this.errorMessage});

               });
//               console.log("misc: ", this.misc);
    }

    dcs: dc[];
    getDCByClassTag() {
        this.aieMiscService.getDCByClassTag(this.vehicle.vh_Agency_Cl, this.vehicle.vh_Tag)
        .subscribe(
               dcs => {
                   this.loadingBarComponent.loadingModal.hide();
                   this.dcs = dcs;
                 //for each Data Collector record found
                   for (let d of dcs) {
                     // search fcts for a matching key
                   var miscDc = this.misc.filter(x => (x.fct_aie_status == "P" || x.fct_aie_status == "T") && x.fct_key == d.vybkeyField);
                       if (miscDc.length > 0) {
                           miscDc[0].desc1 = d.desc1;
                           miscDc[0].desc2 = d.desc2;
                           miscDc[0].desc3 = d.desc3;
                           miscDc[0].desc4 = d.desc4;
                           miscDc[0].fct_billback_desc = d.desc1 +" " + d.desc2 +" " + d.desc3 +" " + d.desc4;
                           miscDc[0].fct_orig_sales = d.salesCd;
                           miscDc[0].fct_orig_cost  = d.costAcct;
                           miscDc[0].fct_sales_code = d.salesCd;
                           miscDc[0].fct_cost_account = d.costAcct;
                           miscDc[0].dc = d;
                           miscDc[0].aieDesc = true;
                           miscDc[0].fct_dc_found = "Y";
                       } 
                         
                   }
                   this.paginate();
               },
               error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
                   this.miscForm.patchValue({message: this.errorMessage});
               });
    }

    ids: id[];
    getIDByClassTag() {
        this.aieMiscService.getIDByClassTag(this.vehicle.vh_Agency_Cl, this.vehicle.vh_Tag)
        .subscribe(
               ids => {
                   this.loadingBarComponent.loadingModal.hide();
                   this.ids = ids;
                 //for EACH Income Detail record returned
                   for (let i of ids) {
                   var miscId = this.misc.filter(x => (x.fct_aie_status == "B" || x.fct_aie_status == "C") && x.fct_key == i.id_rp_vyb_key);
                     if (miscId.length > 0) {
                         miscId[0].desc1 = i.id_desc_1;
                         miscId[0].desc2 = i.id_desc_2;
                         miscId[0].desc3 = i.id_desc_3;
                         miscId[0].desc4 = i.id_desc_4;
                         miscId[0].fct_billback_desc = i.id_desc_1 +" " + i.id_desc_2 +" " + i.id_desc_3 +" " + i.id_desc_4;
                         miscId[0].fct_orig_sales = i.id_sales_cd;
                         miscId[0].fct_orig_cost  = i.id_cost_acct;
                         miscId[0].fct_sales_code = i.id_sales_cd;
                         miscId[0].fct_cost_account = i.id_cost_acct;
                         miscId[0].id = i;
                         miscId[0].aieDesc = true;
                         miscId[0].fct_dc_found = "N";
                     }    
                   }
                   this.paginate();
               },
               error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
                   this.miscForm.patchValue({message: this.errorMessage});
               });
    }

    displayStartDatePicker(){
        let element = document.getElementById('idStartDate');
        if(element.style.display=="none"){
            element.style.display='block';
        }
        else {
            element.style.display='none';
        }
    }
    
    displayEndDatePicker(){
        let element = document.getElementById('idEndDate');
        if(element.style.display=="none"){
            element.style.display='block';
        }
        else {
            element.style.display='none';
        }
    }    
   
    changePage(p: number) {
        console.log("changing page to ", p);
        this.currentPage = p;
        this.miscPage = this.miscPages[this.currentPage - 1];
        this.startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
        this.endItem = this.startItem + this.miscPage.length - 1;

        this.miscForm = this.formBuilder.group({
            miscRows: this.formBuilder.array(
                this.miscPage.map(x => this.formBuilder.group({
                      fct_sales_code: [x.fct_sales_code],
                    fct_cost_account: [x.fct_cost_account],
                    fct_product_desc: [x.fct_product_desc],
                        fct_odometer: [x.fct_odometer],
                      fct_trans_date: [x.fct_trans_date],
                       fct_po_number: [x.fct_po_number],  
                      fct_total_cost: [x.fct_total_cost],
                      fct_aie_amount: [x.fct_aie_amount, [Validators.pattern('^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$')]],
                          aie_credit: [x.aie_credit, [validateYesNo]],
                      fct_aie_status: [x.fct_aie_status, [validateAIEStatus]],
                          scNegative: [x.scNegative], 
                             fct_key: [x.fct_key],
                      fct_orig_sales: [x.fct_orig_sales],
                       fct_orig_cost: [x.fct_orig_cost],
                        fct_desc_upd: [x.fct_desc_upd],    
                        fct_toUpdate: [x.fct_toUpdate],
                   fct_billback_desc: [x.fct_billback_desc],
                     fct_orig_status: [x.fct_aie_status],
                             aieDesc: [x.aieDesc],
                        fct_dc_found: [x.fct_dc_found],
                    fct_vh_agency_cl: this.vehicle.vh_Agency_Cl,
                          fct_vh_tag: this.vehicle.vh_Tag,
                       fct_cu_region: this.customer.cu_Region,
                         fct_cu_boac: this.customer.boac,
                           po_number: [x.fct_po_number],
                          fct_dc_lid: this.userLID 
                 }))
            ),
        });
            console.log("This Page: " + JSON.stringify(this.miscPage) + "lid:=" + this.userLID );
    }
    //handle pagination change
    pageChanged(e) {
        if (this.miscForm.dirty) {
//            this.modalFrom = "pageChanged";
//            this.modalNumParameter = e.page;
//            this.modalNumParameter2 = this.currentPage;
//            this.showAlertModal("Your page contains unsaved changed which may be lost if you navigate away. Click OK to continue, or cancel to stay.", "OkCancel");
        } else {
            this.changePage(e.page);
        }
    }
    
    paginate() {
       if (this.totalItems > 0) {
           this.miscPages = this.commonService.breakArray(this.itemsPerPage, this.misc);
           this.totalPages = this.miscPages.length;
           this.currentPage = 1;
           this.changePage(this.currentPage);
           this.haveNoPage = false;
       } else {
           this.miscPages = [];
           this.miscPage = [];
           this.totalPages = 0
           this.currentPage = 0;
           this.haveNoPage = true;
       }
    }
    
    srchAmtChanged() {
        var srchamt = document.getElementById('srchAmt')["value"]; 
               
        if ( isNaN(srchamt) ) {
             alert ("Enter search amount in format 99999.99");
             document.getElementById('srchAmt')["focus"];
             return false;
        }
        
        if (srchamt > 99999.99 ) { 
           alert ("Amount is too large, maximum allowed amount is $99,999.99");
           document.getElementById('srchAmt')["focus"];
           return false;
        }   
        
//        alert ("line 487:==>" + srchamt +"<==");
        if ((srchamt == "") || (srchamt == undefined) || (srchamt == " ") || (srchamt == "  ") || (srchamt == "   ") || (srchamt == "    ") || (srchamt == "     ") || (srchamt == "      ") || (srchamt == "       ") || (srchamt == "        ")){
            srchamt = 0;
            document.getElementById('srchAmt')["value"] = srchamt;
        }
    }
    
    aieAmtChanged(i) {
        var fctamt = document.getElementsByName('fct_aie_amount')[i]["value"];
          
        if ((fctamt == 0) || (fctamt == null)) { 
            alert ("Billback amount must be > 0");
            document.getElementsByName('fct_aie_amount')[i]["focus"];
            return false;
        }   
        
        if (fctamt > 99999.99 ) { 
            alert ("Amount is too large, maximum allowed amount is $99999.99");
            document.getElementsByName('fct_aie_amount')[i]["focus"];
            return false;
        }   
        this.miscForm.get(['miscRows',i,'fct_aie_amount']).setValue(fctamt);
        this.miscPage[i].fct_aie_amount = fctamt ;  
       // alert ("line 441:" + fctamt) ; 
        
        var fctUpd = document.getElementsByName('fct_toUpdate')[i]["value"];
        if (fctUpd != "Y") {
            fctUpd  = "Y";             // This row is eligible to be updated
            this.miscForm.get(['miscRows',i,'fct_toUpdate']).setValue(fctUpd);
            this.miscPage[i].fct_toUpdate = fctUpd ;
        } 
    }
        
    saveDesc(misc, i) {
       // alert ("line 430:" +document.getElementsByName('fct_billback_desc')[i]["value"]);
        var dcIdDesc = document.getElementsByName('fct_billback_desc')[i]["value"];
       // this.miscForm.get(['miscRows',i,'fct_billback_desc']).setValue(dcIdDesc);
       // this.miscPage[i].fct_billback_desc = dcIdDesc;
        this.origModalDesc = dcIdDesc;
       // alert ("line 435 dcIdDesc:=" + dcIdDesc +" origDesc:=" +this.origModalDesc);
        document.getElementsByName('idModalDesc')[i]["value"] = document.getElementsByName('fct_billback_desc')[i]["value"] ;
       // alert ("line 437:" +document.getElementsByName('idModalDesc')[i]["value"]);
        
    }
    
    submitDesc(misc, i) {
        console.info("450 Logged in user's Lid :=" + this.userLID + "lvl1Perm:" + this.lvl1Perm + "lvl2Perm:" + this.lvl2Perm);
        
//        if ( ! (this.lvl1Perm == "X" || this.lvl2Perm == "X" || this.lvl5Perm == "X" || this.lvl7Perm == "X" || this.lvl8Perm == "X") ) {
//            alert ("Your current permission levels do not allow saving the description");
//            return false;
//        }
        
        var dcIdDesc = document.getElementsByName('fct_billback_desc')[i]["value"];
        if (dcIdDesc.toLowerCase().indexOf('"') > -1) {
            alert ('Description detail contains invalid character: QUOTE ("), \n Clear and re-enter description and click "Submit"');
            document.getElementsByName('idModalDesc')[i]["value"] = dcIdDesc;
            this.aiedescModal.show();
            return false;
        }        

        if (dcIdDesc.toLowerCase().indexOf('<script') > -1) {
            alert ('Description detail contains invalid characters: <script \n Clear and re-enter description and click "Submit"');
            document.getElementsByName('idModalDesc')[i]["value"] = dcIdDesc;
            this.aiedescModal.show();
            return false;
        }        
        
        if (this.origModalDesc != document.getElementsByName('idModalDesc')[i]["value"]) {
            this.changedModalDesc = document.getElementsByName('idModalDesc')[i]["value"];
            document.getElementsByName('fct_billback_desc')[i]["value"]= this.changedModalDesc;
            document.getElementsByName('fct_desc_upd')[i]["value"]= "Y";
            if (misc.fct_toUpdate != "Y") {
                misc.fct_toUpdate = "Y";
            }
        }
        else
          if (this.origModalDesc == document.getElementsByName('idModalDesc')[i]["value"]) {
              alert ("No changes to description has been made. This window will be closed");

          }
    }
    
    clearModalDesc(misc, i) { 
//        this.sysStatus = "";
//        if ( ! (this.lvl1Perm == "X" || this.lvl2Perm == "X" || this.lvl5Perm == "X" || this.lvl7Perm == "X" || this.lvl8Perm == "X") ) {
////           this.sysStatus = "Your current permission levels do not allow you to perform update functions on this screen";
//            alert ("Your current permission levels do not allow clearing the description");
//            return false;
//        }
        
        if ((document.getElementsByName('idModalDesc')[i]["value"] == "") && (document.getElementsByName('fct_billback_desc')[i]["value"] == "")) {
            alert ("Nothing to clear. This window will be closed");
            document.getElementsByName('fct_desc_upd')[i]["value"]= "";
        } else {
            document.getElementsByName('fct_billback_desc')[i]["value"] = document.getElementsByName('idModalDesc')[i]["value"] = "";  // Null 
            this.descChgSw = this.misc[i].fct_desc_upd = "Y";  
            if (misc.fct_toUpdate != "Y") {
                misc.fct_toUpdate = "Y";
            }
        }
    }

    
     /**
     * Define an array of FCTs that have been selected to be updated 
     * (where fct_toUpdate == true). Then call the service to send the
     * array of FCTs to the back end.
     *
     */
    saveBillBacksMisc() {
//  alert ("line 559 perm/1/2/5/7/8:=" +this.lvl1Perm + "==" + this.lvl2Perm + "===" + this.lvl5Perm + "====" + this.lvl7Perm + "=====" + this.lvl8Perm);
        this.sysStatus = "";
        if ( ! (this.lvl1Perm == "X" || this.lvl2Perm == "X" || this.lvl5Perm == "X" || this.lvl7Perm == "X" || this.lvl8Perm == "X") ) {
            this.sysStatus = "Your current permission levels do not allow you to perform update functions on this screen";
            alert ("Your current permission level(s) do not allow AIE Bill Back function");
            return false;
        }
        
        console.log(" in aie-misc.component.ts...");
        var obj = document.getElementsByName('fct_aie_amount');
        var len = obj.length;
        
        var updElig = "N";
        for (var i=0; i<len; i++) {
             if (document.getElementsByName('fct_toUpdate')[i]["value"] == "Y") {  
                // alert ("Line 559:" + document.getElementsByName('fct_key'[i]["value"]));
                 updElig = "Y";
             }
        }
         
        if (updElig == "N") {
            alert ("No record is eligible to 'Save Bill Back'/update");
            return false;
        } 

        for (var i=0; i<len; i++) {
             if (document.getElementsByName('fct_toUpdate')[i]["value"] == "Y") {                            // Fleet Card Trans update
                 var fctcredit  = document.getElementsByName('aie_credit' )   [i]["value"]; 
                 var fctkey     = document.getElementsByName('fct_key' )      [i]["value"];
                 var fctstatus  = document.getElementsByName('fct_aie_status')[i]["value"];
                 var fctamt     = document.getElementsByName('fct_aie_amount')[i]["value"];
               //  alert ("line 618 fctstatus/fctamt:" + fctstatus + " fctamt: " +fctamt);
                 if ((fctamt == 0) || (fctamt == null)) { 
                      alert ("Billback amount must be > 0.");
                      document.getElementsByName('fct_aie_amount')[i]["focus"];
                      return false;
                 }   
                 var salescode  = this.miscPage[i].fct_sales_code;
                 var costacct   = this.miscPage[i].fct_cost_account; 
                 
                 if ((salescode == "  ") || (salescode == undefined) || (salescode == "")) {
                         alert ("Please Select Sales Code.");
                         this.miscPage[i].fct_sales_code.focus;
                         this.miscPage[i].fct_sales_code.select;
                         return false;
                 } 
                 
                  if (fctstatus == "S") {
                     if ((salescode == "  ") || (salescode == undefined) || (salescode == "")) {
                         alert ("Please Select Sales Code");
                         this.miscPage[i].fct_sales_code.focus;
                         this.miscPage[i].fct_sales_code.select;
                         return false;
                     } 
                     
//                     if ((costacct == undefined) || (costacct == "")) {
//                          alert ("Please select a valid Cost Account..");
//                          this.miscPage[i].fct_cost_account.focus;
//                          this.miscPage[i].fct_cost_account.select;
//                          return false;
//                     }    
//        
//                     if ((salescode =="A1") || (salescode =="A8") || (salescode =="Q1")) {  
//                        if (costacct !="000") {
//                            alert ("This cost account is NOT allowed for the sales code " + salescode);
//                            this.miscPage[i].fct_cost_account.focus;
//                            this.miscPage[i].fct_cost_account.select;
//                            return false;
//                        }
//                     }    
                               
                      if ((fctamt == 0) || (fctamt == null)) { 
                          alert ("Billback amount must be > 0");
                          document.getElementsByName('fct_aie_amount')[i]["focus"];
                          return false;
                      }   
                      
                      if (fctamt > 99999.99 ) { 
                         alert ("Amount is too large, maximum allowed amount is $99999.99");
                         document.getElementsByName('fct_aie_amount')[i]["focus"];
                         return false;
                     }   
                     
//                     if (!this.validateSalesCdCostAcct(i, salescode, costacct)) {
//                         return false;
//                     }
                 }
             
                 if ((fctstatus != "B") && (fctstatus != "T") && (fctcredit == "Y")) {
                    alert ("Billback Credit flag Change not allowed");
                    return false;  
                 }
                 
                 if ((fctstatus == "S") && (fctamt == 0)) {
                    alert ("Billback AIE amount is Zero");
                    return false;  
                 }
                 
     //*********** Backend Logic **********//                 
                 if ((fctstatus == "B") && (fctcredit == "Y")){
                      fctstatus = "T";
                      this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue(fctstatus);
                      this.miscPage[i].fct_aie_status = fctstatus ;
                  }
                 
                 if ((fctstatus == "T") && (document.getElementsByName('fct_orig_status')[i]["value"]== "T")) {
                      fctstatus = "B";
                      this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue(fctstatus);
                      this.miscPage[i].fct_aie_status = fctstatus ;
                 }
                     
                 // alert ("line 672 fctstatus/fctamt:" + fctstatus + " fctamt: " +fctamt);
                 if (fctstatus == "S") {
                     fctstatus = "P";
                     this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue(fctstatus);
                     this.miscPage[i].fct_aie_status = fctstatus ;
                     //document.getElementsByName('fct_aie_status')[i]["value"] = "P";
                     //document.getElementsByName('fct_orig_status')[i]["value"]  = "P";
                 }
                 else
                 if ((fctstatus == "P") && (fctamt == 0)) {
                      fctstatus = " ";
                      this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue(fctstatus);
                      this.miscPage[i].fct_aie_status = fctstatus ;
                      //document.getElementsByName('fct_aie_status')[i]["value"] = " ";
                      //document.getElementsByName('fct_orig_status')[i]["value"]  = " "; 
                 }
                 else
                 if (fctstatus == " ") {
                     fctamt = 0;
                     this.miscForm.get(['miscRows',i,'fct_aie_amount']).setValue(fctamt);
                     this.miscPage[i].fct_aie_amount = fctamt ;  
                     //document.getElementsByName('fct_aie_amount')[i]["value"] = 0;
                     fctstatus = " ";
                     this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue(fctstatus);
                     this.miscPage[i].fct_aie_status = fctstatus ;  
                     //document.getElementsByName('fct_aie_status')[i]["value"] = " ";
                     //document.getElementsByName('fct_orig_status')[i]["value"]  = " ";
                     document.getElementsByName('fct_billback_desc')[i]["value"] = " ";
                 }
                 
                 if (((document.getElementsByName('fct_orig_status')[i]["value"] == "G") && fctstatus == "B") ||
                     ((document.getElementsByName('fct_orig_status')[i]["value"] == "B") && fctstatus == "G"))
                      fctstatus = document.getElementsByName('fct_aie_status')[i]["value"]; // Nothing but the same
               // // alert ("line 697 fctstatus/fctamt:" + fctstatus + " fctamt: " +fctamt);              
                
        if (salescode == "V3")
           if (costacct != 161)
               this.miscPage[i].fct_cost_account = 161;

        if (costacct == 160) {
            this.miscPage[i].fct_cost_account = 161;
            this.miscPage[i].fct_sales_code   = "V3";
        }
 
        var desc = document.getElementsByName('fct_billback_desc')[i]["value"];
        this.miscForm.get(['miscRows',i,'fct_billback_desc']).setValue(desc);
        this.miscPage[i].fct_billback_desc = desc;
        if (desc.length > 0) {
           if (desc.toLowerCase().indexOf('"') > -1) {
               alert ('Description detail contains invalid character: QUOTE ("), \n Clear and/or re-enter description and click "Submit".');
               document.getElementsByName('idModalDesc')[i]["value"] = desc;
               this.aiedescModal.show();
               return false;
           }        

           if (desc.toLowerCase().indexOf('<script') > -1) {
               alert ('Description detail contains invalid characters: <script \n Clear and/or re-enter description and click "Submit".');
               document.getElementsByName('idModalDesc')[i]["value"] = desc;
               this.aiedescModal.show();
               return false;
           }        
        }
         
        var descUpd = document.getElementsByName('fct_desc_upd' )[i]["value"];
        this.miscForm.get(['miscRows',i,'fct_desc_upd']).setValue(descUpd);
        this.miscPage[i].fct_desc_upd = descUpd ;

//                 var c = confirm ("You are about to save changes to flags, selected repairs for tag " + this.vehicle.vh_Agency_Cl + "-" + this.vehicle.vh_Tag +  ". Are you sure?");
//                 if (c == false)   
//                     return;
//               this.loadingBarComponent.loadingModal.show();  
                 let fctsToUpdate: AieMiscExtended[] = [];
                 
                 if (this.misc == null) {
                     alert("Nothing to save Bill Back. Search a vehicle class/tag first");
                     return;
                 }

                 for (let fct of this.misc) {
                     if (fct.fct_toUpdate == "Y") {
                         fctsToUpdate.push(fct);
                         console.log("fctsToUpdate push Key:="+ fct.fct_key +" LID:=" +fct.fct_dc_lid +" DC_update:=" +fct.fct_desc_upd);
                         this.loadingBarComponent.loadingModal.show(); 
                     }
                 }
                 
                 if ((fctsToUpdate == null) || (fctsToUpdate.length == 0)) {
                     alert("No record is eligible to 'Save Bill Back'/update");
                     return;
                 }
                 
                 this.sysStatus = "";
                 this.aieMiscService.saveBillBacksMisc(fctsToUpdate)
                     .subscribe(
                        misc => {
                            this.totalItems = this.misc.length;
                            if ((this.totalItems != 0) || (this.misc != null)) {
                                console.log("result is true");
                                this.sysStatus = "Successfully updated";
                            } else {
                                console.log("result is false");
                                this.sysStatus = "Update is Unsuccessful, please search the tag and review again";
                            }
                            this.loadingBarComponent.loadingModal.hide();
 //                            let msg = "Successfully updated:=" +fctkey +"==" + fctstatus +"===" + fctamt;
 //                            alert("\n Successfully updated FCT! \n\n Please click OK to refresh the screen.");
                             this.miscPages = [];
                             this.miscPage = [];
                             this.totalPages = 0;
                             this.currentPage = 0;
                             this.haveNoPage = true;
 //                            this.getMiscRecords(); 
                        },
                        error =>  {
                            this.errorMessage = <any>error;
                            console.log(this.errorMessage);
 //                           alert("ERROR: " + this.errorMessage);
                            this.sysStatus = "UPDATE ERROR" + error.errorMessage;
                            console.log("Msg Received=>" + error.errorMessage);
                            this.loadingBarComponent.loadingModal.hide();
                        }
                    );
                 console.log("Bill Backs sent from client component to client service...");
                
            }

        }
        
    }
    
    toggleAieCredit(row, i) {
        if (document.getElementsByName('scNegative')[i]["value"] == "Y") {
            alert ("You cannot apply a credit to a transaction that is currently pending. \nYou must wait until the bill back has processed before you can apply a credit");
            return false;
        }

        let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
        element.disabled=true;

     if (document.getElementsByName('aie_credit')[i]["value"] == "") {  
        if (row.fct_aie_status.length > 0) 
        {   
          if (row.fct_aie_status  == "C") {
              alert ("Already Credited, You can't Credit again"); 
              return false;
          }

          if (!(row.fct_aie_status  == "B" || row.fct_aie_status  == "G" || row.fct_aie_status  == "T")){
               alert ("You cannot apply a credit to a transaction that is currently pending. \nYou must wait until the bill back has processed before you can apply a credit.");
               return false;
          } else {
              row.aie_credit = "Y";
              if (row.fct_toUpdate !="Y") {
                  row.fct_toUpdate = "Y";
              }
                 let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                 element.disabled=false;
          }
        } else {
               alert ("You cannot apply a credit to a transaction that is currently pending. \nYou must wait until the bill back has processed before you can apply a credit..");
               return false;
        }

     }
   
     if (document.getElementsByName('aie_credit')[i]["value"] == "Y") 
     {  
        if (row.fct_aie_status.length > 0) 
        { 
           if ((row.fct_aie_status  == "B")  || (row.fct_aie_status  == "G" || (row.fct_aie_status  == "T" )))
           {
              document.getElementsByName('aie_credit')[i]["value"] = ""; 
              row.aie_credit = "";
              if (row.fct_toUpdate !="Y") {
                  row.fct_toUpdate = "Y";
                  let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                  element.disabled=false;
              }
              else
                if ((document.getElementsByName('fct_orig_status')[i]["value"] == "T") && (document.getElementsByName('aie_credit')[i]["value"] == "")) {                 
                    row.fct_toUpdate = "N";
                }
                else    
                  if ((document.getElementsByName('fct_orig_status')[i]["value"]) == row.fct_aie_status) {
                      row.fct_toUpdate = "N";             // This row is ineligible to be updated
                  } 
            } 
         }  
      /*  else               // duplicate code aleady handled in line 634 - 642
          if (((row.aie_credit == " " || row.aie_credit == "" || row.aie_credit == undefined) && row.fct_aie_status  == "B") 
           || ((row.aie_credit == " " || row.aie_credit == "" || row.aie_credit == undefined) && row.fct_aie_status  == "T") 
                                                                   || (row.aie_credit == "Y"  && row.fct_aie_status  == "G" ))  
          {
             this.miscForm.get(['miscRows',i,'row.aie_credit']).setValue("Y");
             row.aie_credit = "Y";   
             if (!row.fct_toUpdate) {row.fct_toUpdate = true;} 
              
             let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
             element.disabled=false;
           } 
      */
        } 
    }
    
    toggleAieStatus(row, i) {     // B-already billed, C-already billed (credit), P-PENDING BILLBACK T-CREDIT
                                  // " " - not yet billed, F-Failed billback, G-Failed billback (credit)
           if ((row.fct_total_cost < 0) || (row.scNegative == "Y")) {
                alert ("You can't bill back Negative transactions on this screen, use AIE Single screen..");
                return false;
            }
        
        if (row.fct_aie_status.length > 0) {
            if ((row.fct_total_cost == 0) || (row.fct_total_cost == 0.0) || (row.fct_total_cost == 0.00)) {
                alert ("Nothing to bill back");
                return false;
            }
            
            if (row.fct_aie_status == 'B') {
                alert ("Already Billed back, No changes allowed"); 
                return false;
            } 
            
            if ((row.fct_aie_status != "B") && (row.fct_aie_status != "T") && (row.fct_credit == "Y")) {
                 alert ("Billback Credit flag Change not allowed.");
                 return false;  
            }
            
            if ((row.fct_aie_status == "S") && (row.fct_aie_amount == 0)) {
                 alert ("Billback AIE amount is Zero.");
                 return false;  
            }
            
            if ((row.fct_aie_status == 'T') && (document.getElementsByName('fct_orig_status')[i]["value"] == "T")) {
                if (row.aie_credit == 'Y') {
                    alert ("To remove Temporary Credit, make 'Credit AIE' flag to Space and click 'Save Bill Backs' button");
                    return false; 
                } else {
                         this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue("B");
                         row.fct_aie_status = "B";         
                         let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                         if (element.disabled == true) {element.disabled=false;}
                }   
            } 
            
            if (row.fct_aie_status == "F")  {
                this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue("");
                row.fct_aie_status = "";         
                this.miscForm.get(['miscRows',i,'fct_aie_amount']).setValue(0.00);
                row.fct_aie_amount = 0.00;
                
                let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                    if (element.disabled == true) {element.disabled=false;}
            } 
            
            if (((document.getElementsByName('fct_orig_status')[i]["value"] == "S") && (row.fct_aie_status == 'P')) || 
                ((document.getElementsByName('fct_orig_status')[i]["value"] == "S") && (row.fct_aie_status == " ")) ||
                ((document.getElementsByName('fct_orig_status')[i]["value"] == "S") && (row.fct_aie_status == "")) ) {
                document.getElementsByName('fct_orig_status')[i]["value"] = "";         
                this.miscForm.get(['miscRows',i,'fct_aie_amount']).setValue(0.00);
                row.fct_aie_amount = 0.00;
                
                let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                    if (element.disabled == true) {element.disabled=false;}
            } else if ((document.getElementsByName('fct_orig_status')[i]["value"] == "S") && (row.fct_aie_status == 'C')) {
                        document.getElementsByName('fct_orig_status')[i]["value"] = ""; 
                        let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                        if (element.disabled == true) {element.disabled=false;}
                } else if ((document.getElementsByName('fct_orig_status')[i]["value"] == "S") && (row.fct_aie_status == 'F')) {
                            document.getElementsByName('fct_orig_status')[i]["value"] = "F"; 
                            this.miscForm.get(['miscRows',i,'fct_aie_amount']).setValue(0.00);
                            row.fct_aie_amount = 0.00;
                            let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                            if (element.disabled == true) {element.disabled=false;}
                    }
                     
                    
    /*   else  --->  Coded this  existing logic as above in lines 939 thru 958 
            if ((t.value == "S" && bbf == "P")  || ( t.value == "S" && bbf == " ") || (t.value == "S" && bbf == "" ))  
               { 
                  t.value = " ";          
                  document.mainForm.elements[ptr].value = "0.00";     
                  document.forms [0].Undo.disabled = false;
               }
          else
            if ((t.value == "S") && ( bbf == "C" ))  
               {
                  t.value = "C";  
                  document.forms [0].Undo.disabled = false;
               }
          else
            if (t.value == "S" && bbf == "F")  
               {
                  t.value = "F";              
                  document.mainForm.elements[ptr].value = "0.00";     
                  document.forms [0].Undo.disabled = false;
               }     
    */ 
            
            if (row.fct_aie_status == 'G') { 
                this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue("B");
                row.fct_aie_status = "B";         
                let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                    if (element.disabled == true) {element.disabled=false;}
            }   
            
            if (row.fct_aie_status == 'P') {
              if (confirm ("Billback is pending, are you sure you want to change ?")) {    
                  this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue("S");
                  row.fct_aie_status = 'S';
                  let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                      if (element.disabled == true) {element.disabled=false;}
              }
            }
        
            if (row.fct_aie_status == 'C') {
              if (confirm ("Billback was Credited, are you sure you want to Bill back again?")) {    
                 this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue("S");
                 row.fct_aie_status = "S";
                 let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                     if (element.disabled == true) {element.disabled=false;}
              }
            }

            if (row.fct_toUpdate !="Y") {
                row.fct_toUpdate = "Y";                // This row is eligible to be updated
            }
            else { 
                 if (row.fct_aie_status == (document.getElementsByName('fct_orig_status')[i]["value"])) { // This row is ineligible to be updated
                     row.fct_toUpdate = "N"; 
                 }
                 else
                   if (document.getElementsByName('fct_orig_status')[i]["value"] == "P") {                // This row is ineligible to be updated
                       row.fct_toUpdate = "N";
                   }
            } 
            
         } else {
            this.miscForm.get(['miscRows',i,'fct_aie_status']).setValue("S");
            row.fct_aie_status = "S";
            this.miscForm.get(['miscRows',i,'fct_aie_amount']).setValue(row.fct_total_cost);
            row.fct_aie_amount = row.fct_total_cost; 
            let element = document.getElementsByName('undoBtn') as HTMLSelectElement;
                if (element.disabled == true) {element.disabled=false;}
  
            if (row.fct_toUpdate !="Y") {
                row.fct_toUpdate = "Y";                // This row is eligible to be updated
            } else {   
                if ((document.getElementsByName('fct_orig_status')[i]["value"]) == row.fct_aie_status) {
                     row.fct_toUpdate = "N";             // This row is ineligible to be updated
                  } 
            } 
        }  
    }
   
  };

 
 


