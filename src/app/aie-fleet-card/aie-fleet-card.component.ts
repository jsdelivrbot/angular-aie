import { Component, OnInit, NgModule, ViewChild  } from '@angular/core';
//For model driven forms
import { FormGroup, FormControl, FormsModule, FormBuilder, Validators, AbstractControl, FormArray} from '@angular/forms';
// For services
import { AieFleetCardService } from './aie-fleet-card.service';
import { AIEFleetCard } from './aie-fleet-card';
import { NgDateRangePickerOptions } from 'ng-daterangepicker';
import { CompleterService, CompleterData } from 'ng2-completer';
import { TypeaheadModule } from 'ngx-bootstrap';
import { RegionSelectComponent } from '../common-components/region-select/region-select.component';
import { JustificationSelectComponent } from '../common-components/justification-select/justification-select.component';
import { SalesCodeSelectComponent } from '../common-components/sales-code-select/sales-code-select.component';
import { LoadingBarComponent } from '../common-components/loading-bar/loading-bar.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DaterangeComponent } from '../daterange/daterange.component';
import { dateRange } from '../daterange/daterange';
import { CommonService } from '../common-components/common.service';
import { SalesCostSelectComponent } from '../common-components/sales-cost-select/sales-cost-select.component'
import { DataService } from '../common-components/data.service';
//import { createCounterRangeValidator } from '../common-components/sales/sales.component';
//import { createCAValidator } from '../common-components/cost-acct/cost-acct.component'
import * as moment from 'moment';


@Component({
  selector: 'app-aie-fleet-card',
  templateUrl: './aie-fleet-card.component.html',
  styleUrls: ['./aie-fleet-card.component.css', '../app.component.css']
})
export class AieFleetCardComponent implements OnInit {
  
  /*
   * @ViewChild allows you to directly access an instance of a child component.
   * This will allow you to access any public defined variables of the child
   * as well.
   * 
   * @ViewChild can also allow you to directly access local variables from
   * the view/html. And example can be seen in LoadingBarComponent.
   */
  @ViewChild(LoadingBarComponent) public loadingBarComponent: LoadingBarComponent;  
    
  options: NgDateRangePickerOptions;
  
    
  testSalesCode;
  testCostAccount;
  fctForm: FormGroup;
  fmc: "";
  lid: "";
  boac: "";
  lidValid: boolean = false;
  customerValid: boolean = true;
  description: string;
  customer: string;
  newCustomer: string;
  reportType;
  justification: any[];
  region: string;
  zone: string;
  tank: string;
  myDateRange: dateRange;
  aieDiff: boolean;
  incTank: boolean;
  aieBill: boolean;
  startDate: string = "";
  endDate: string = "";
  defaultSelect;
    
  host: string;
  customerLid: string;
  customerName: string;
  customerRegion: number;

  constructor(
    private aieFleetCardService: AieFleetCardService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private dataService: DataService
    ) {
      this.fctForm = this.formBuilder.group({
          fctRows: this.formBuilder.array([])
      })
      
  }
    
  ngOnInit() {
      this.options = {
      theme: 'default',
      range: 'tm',
      dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      presetNames: ['This Month', 'Last Month', 'This Week', 'Last Week', 'This Year', 'Last Year', 'Start', 'End'],
      dateFormat: 'yMd',
      outputFormat: 'DD/MM/YYYY',
      startOfWeek: 1
    };
  }
    
  ngAfterViewInit() {
    this.dataService.currentHostName.subscribe(host => this.host = host);
    this.dataService.currentLid.subscribe(customerLid => this.customerLid = customerLid);
    this.dataService.currentCustomerName.subscribe(customerName => this.customerName = customerName);
    this.dataService.currentRegion.subscribe(customerRegion => this.customerRegion = customerRegion);
  } 
  
    
  //Get all Fleet Card Transaction records to be displayed
  errorMessage: string;
    fcts: AIEFleetCard[];
    fctPages = [];
    fctPage = [];
    currentPage: number;
    totalPages: number;
    startItem: number;
    endItem: number;
    totalItems: number;
    itemsPerPage: number = 20;
    
    getFCTRecords() {
        this.loadingBarComponent.loadingModal.show();
        console.log(typeof this.customer)
        this.aieFleetCardService.getFCTs(this.zone, this.lid, this.customer, this.reportType, this.startDate, this.endDate)
             .subscribe(
               fcts => {
                   this.fcts = fcts;
                   for (let fct of this.fcts){
                        fct.fct_toUpdate = false;
                        if (fct.fct_justfy_reason == null) {
                            fct.fct_justfy_reason = "";
                        }
                        if (fct.fct_newCustNum == null) {
                            fct.fct_newCustNum = "";
                        }
                        if (fct.fct_sales_code == null) {
                            fct.fct_sales_code = "";
                        }
                        if (fct.fct_cost_account == null) {
                            fct.fct_cost_account = 0;
                        }
                       
                       fct.fct_review_by = this.customerLid;
                   }
                   this.totalItems = this.fcts.length;
                   this.paginate();
                   this.loadingBarComponent.loadingModal.hide();
                   },
               error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
                   this.fctForm.patchValue({message: this.errorMessage});
               });
        this.isOverTank();
        this.isSameDay();
            console.log("FCTs: ", this.fcts);
            console.log("Boac: ", this.boac);
            console.log("Customer: ", this.customer);
        }
    
    customers: string[];
    getCustomers() {
        this.aieFleetCardService.getCustomers(this.zone, this.fmc)
            .subscribe(
                customers => {
                    this.customers = customers;
                    },
                error => {
//                    this.errorMessage = <any>error;
//                    this.customerForm.pathValue({message: this.errorMessage});
                });
//        this.customers = ['String1','String2'];  
    }
    
    //Get the list of LIDs for drop down menu
    lids: string[];
    getLIDs() {
       this.aieFleetCardService.getLIDs(this.zone)
            .subscribe(
                lids => {
                    this.lids = lids
                    },
                error =>  {
                   this.errorMessage = <any>error;
               });
            console.log("LIDs: ", this.lids);
    }
    
    justTrigger(deviceValue, modal, i) {
        console.log("Just Trigger Device Value: " + deviceValue);
        let array = this.fctForm.get('fctRows') as FormArray;
        let group = array.at(i) as FormGroup
        let justification = group.controls['fct_justification'];
        justification.setValue(deviceValue);
        justification.updateValueAndValidity();
        
        if(deviceValue == 1){
           this.aieBill = true;
        } else {
            this.aieBill = false;
        }
        
        if(deviceValue == 2){
            this.aieBill = true;
            this.aieDiff = true;
        } else {
            this.aieDiff = false;
        }
        
        if(deviceValue == 23){
            this.incTank = true;
        } else {
            this.incTank = false;
        }
        
        if (deviceValue == 1 || deviceValue == 2 || deviceValue == 23){
            modal.show();
        }
    }
    
//    resetJustDropDown(fct){
//        console.log(this.fctForm.controls['fct_justification'].value);
//        this.fctForm.controls['fct_justification'].setValue("blank");
//        console.log(this.fctForm.controls['fct_justification'].value);
//        document.getElementById('tankSize').style.display='none';
//        document.getElementById('idDescription').style.display='none';
//        document.getElementById('idNewCustNum').style.display='none';
//        this.tank = null; 
//    }
//    
//    regionTrigger(deviceValue) {
//        if (deviceValue != null || deviceValue != "blank"){
//            document.getElementById('idFMC').removeAttribute("disabled");
//        }
//    }
//    
//    fmcTrigger(deviceValue) {
//        if (deviceValue != null || deviceValue != "blank"){
//            document.getElementById('idCustomer').removeAttribute("disabled");
//            document.getElementById('idReportType').removeAttribute("disabled");
//        }
//    }
//    
//    setNewCustNum(){
//        this.fctForm.controls['fct_newCustNum'].setValue(this.newCustomer);
//        console.log(this.fctForm.controls['fct_newCustNum'].value);
//        let element = document.getElementById('idNewCustNum') as HTMLSelectElement;
//        element.style.display='none';
//        this.newCustomer = null;
//        
//        document.getElementById('idDescription').style.display='block';
//    }
//    
//    setBillBackDesc(){
//        this.fctForm.controls['fct_billback_desc'].setValue(this.description);
//        console.log(this.fctForm.controls['fct_billback_desc'].value);
//        let element = document.getElementById('idDescription') as HTMLSelectElement;
//        element.style.display='none';
//        this.description = null;
//    }
    
//    setGasTankSize(fct) {
//        console.log(fct);
//        console.log("Received the Click to Update Tank Size Where fct_class = " + fct.fct_class + " and fct_tag = " + fct.fct_tag);
//        this.aieFleetCardService.setGasTankSize(fct, this.tank)
//                .subscribe(
//                    fcts => {
//                                let msg = "Successfully updated fct with fct_gas_tank_size :" + fct.fct_gas_tank_size;
//                                this.fctForm.controls['fct_gas_tank_size'].setValue(this.tank);
//                              },
//                       error =>  {
//                           this.errorMessage = <any>error;
//                           console.log(this.errorMessage);
//                       });
//    
//        let element = document.getElementById('tankSize') as HTMLSelectElement;
//        element.style.display='none';
//        this.tank = null;
//    }
    
    setGasTankSize(fct, value) {
        fct.fct_gas_tank_size = value;
    }
    
    formatCustomers(){
        let newCustomers: string[];
        for (let customer of this.customers){
            let newCustomer = JSON.stringify(customer);
            newCustomers.push(newCustomer);   
        } 
        return newCustomers;
    }
       
    overTank: boolean = false;
    isOverTank(){
        if (this.reportType == "overTank"){
            this.overTank = true;
            return true;
        } else {
            this.overTank = false;
        }
    }
    sameDay: boolean = false;
    isSameDay(){
        if (this.reportType == "sameDay"){
            this.sameDay = true;
        } else {
            this.sameDay = false;
        }
    }
   
    /**
     * Define an array of FCTs that have been selected to be updated 
     * (where fct_toUpdate == true). Then call the service to send the
     * array of FCTs to the back end.
     */
    result: boolean;
    saveBillBacks() {
        let fctsToUpdate: AIEFleetCard[] = [];
        if (this.fcts == null){
            alert("THERE'S NOTHING TO SAVE OR REVIEW. Search for records first");
            return;
        }
        for (let fct of this.fcts) {
           if(fct.fct_toUpdate){
                fctsToUpdate.push(fct);
                console.log("Gas Tank Size Being Updated with: "+ fct.fct_gas_tank_size);
           }           
        }
        if(fctsToUpdate == null){
            alert("THERE'S NOTHING TO SAVE OR REVIEW.  CHECK AT LEAST ONE (1) TAG.");
            return;
        }
        if(fctsToUpdate.length == 0){
            alert("THERE'S NOTHING TO SAVE OR REVIEW.  CHECK AT LEAST ONE (1) TAG.");
            return false;
        }
        this.loadingBarComponent.loadingModal.show();
        this.aieFleetCardService.saveBillBacks(fctsToUpdate)
            .subscribe(
                result => {
                   this.result = result;
                   this.loadingBarComponent.loadingModal.hide();
                   if (result){
                       alert("Data was successfully Updated. Select Okay to reload the data.");
                   } else {
                       alert("Data was not successfully Updated. Select Okay to reload the data.");
                   }
                   
                   this.fctPages = [];
                   this.fctPage = [];
                   this.totalPages = 0
                   this.currentPage = 0;
//                   this.haveNoPage = true;
                   this.getFCTRecords();
                });
        console.log("Bill Backs Have Been Sent");
    }
    
    newDateRange(r) {
        console.log("Made it here");
        console.log(r.startDate);
        let newStartDate = <moment.Moment> r.startDate;
        let newEndDate = <moment.Moment> r.endDate;
        this.startDate = newStartDate.format("YYYYMMDD");
        this.endDate = newEndDate.format("YYYYMMDD");
    }
    
    //Handle Pagination
    haveNoPage: boolean = true;
    paginate() {
       if (this.totalItems > 0) {
           this.fctPages = this.commonService.breakArray(this.itemsPerPage, this.fcts);
           this.totalPages = this.fctPages.length;
           this.currentPage = 1;
           this.changePage(this.currentPage);
           this.haveNoPage = false;
       } else {
           this.fctPages = [];
           this.fctPage = [];
           this.totalPages = 0
           this.currentPage = 0;
           this.haveNoPage = true;
       }
    
    }
    
    //Handle Page changing
    pageChanged(e) {
        this.changePage(e.page);
    }
    
    public validateOnlySelectedRow = (control: AbstractControl): {[key: string]: boolean} => {
        const toUpdate = control.get('fct_toUpdate');
        return toUpdate.value ? null : { validateOnlySelectedRow: true};
    };
    
    changePage(p: number) {
        this.currentPage = p;
        this.fctPage = this.fctPages[this.currentPage - 1];
        this.startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
        this.endItem = this.startItem + this.fctPage.length - 1;
        
        this.fctForm = this.formBuilder.group({
            fctRows: this.formBuilder.array(
                this.fctPage.map(x => this.formBuilder.group({
                        fct_region: [x.fct_region],
                        fct_class: [x.fct_class],
                        fct_tag: [x.fct_tag],
                        fct_cust_boac: [x.fct_cust_boac],
                        fct_cust_serial: [x.fct_cust_serial],
                        fct_trans_date: [x.fct_trans_date],
                        fct_trans_time: [x.fct_trans_time],
                        fct_odometer: [x.fct_odometer],
                        fct_units: [x.fct_units],
                        fct_unit_cost: [x.fct_unit_cost],
                        fct_total_cost: [x.fct_total_cost],
                        fct_product_desc: [x.fct_product_desc],
                        fct_trans_desc: [x.fct_trans_desc], 
                        fct_aie_amount: [x.fct_aie_amount],
                        fct_gas_tank_size: [x.fct_gas_tank_size],
                        fct_product_code: [x.fct_product_code],
                        fct_cost_account: [x.fct_cost_account],
                        fct_sales_code: [x.fct_sales_code],
                        fct_justification: [x.fct_justification],
                        fct_key: [x.fct_key],
                        fct_newCustNum: [x.fct_newCustNum],
                        fct_toUpdate: [x.fct_toUpdate],
                        fct_justfy_reason: [x.fct_justfy_reason],
                        fct_cu_cst_dt_time: [x.fct_cu_cst_dt_time]
                    }))
                )
        });
        
//        console.log("This Page: " + JSON.stringify(this.fctPage));
        
//        let array = this.fctForm.get('fctRows') as FormArray;
//        let group = array.at(0) as FormGroup
//        if (group.controls['fct_cost_account'].value == 0){
//            console.log("It was initialized in the form group as an empty string");
//        } else {
//            console.log("It was not initialized")
//        }
//        
//        
//        for(let i = 0; i < array.length; i++) {
//            console.log("i: " + i);
//            let group = array.at(i) as FormGroup
//            group.disable();
//            console.log(group.disabled);
//        }
    }
    
    toggleValidators(i) {
        let array = this.fctForm.get('fctRows') as FormArray;
        let group = array.at(i) as FormGroup
        console.log("Value of fct_toUpdate for row " + i +" : " + group.controls['fct_toUpdate'].value)
        if (group.controls['fct_toUpdate'].value == true) {
            
            //fct_aie_amount validations set
            group.controls['fct_aie_amount'].setValidators(Validators.pattern('^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$'));
            group.controls['fct_aie_amount'].updateValueAndValidity();
            
            //Justification validation set
            group.controls['fct_justification'].setValidators(this.justificationValidCheck)
            group.controls['fct_justification'].updateValueAndValidity();
            
//            group.controls['fct_newCustomer'].setValidators(this.newCustomerValidCheck)
//            group.controls['fct_newCustomer'].updateValueAndValidity();
            
            //fct_sales_code validations set
            let costAccount = group.controls['fct_cost_account'] as FormControl
            let salesCode = group.controls['fct_sales_code'] as FormControl
            salesCode.setValidators(this.createCounterRangeValidator(costAccount.value));
            salesCode.updateValueAndValidity();
            costAccount.setValidators(this.createCAValidator(salesCode.value));
            costAccount.updateValueAndValidity();
            
        }
        else {
            group.controls['fct_justification'].clearValidators();
            group.controls['fct_justification'].updateValueAndValidity();
            
            group.controls['fct_aie_amount'].clearValidators();
            group.controls['fct_aie_amount'].updateValueAndValidity();
            
            group.controls['fct_sales_code'].clearValidators();
            group.controls['fct_sales_code'].updateValueAndValidity();
            
            group.controls['fct_cost_account'].clearValidators();
            group.controls['fct_cost_account'].updateValueAndValidity();
            
            group.controls['fct_sales_code'].clearValidators();
            group.controls['fct_sales_code'].updateValueAndValidity();
            
//            group.controls['fct_newCustomer'].clearValidators();
//            group.controls['fct_newCustomer'].updateValueAndValidity();
        }
    }
    
    customerValidCheck(){
        if (this.customer.match("^[0-9]{2}-[0-9]{2}-[0-9]{2}-[a-zA-Z0-9]{6}-[0-9]{3}$")){
            this.customerValid = true;
        }
        else if (this.customer.match("^$")){
            this.customerValid = true;
        }
        else {
            this.customerValid = false;
        }
        
        return this.customerValid;
    }
    
//    newCustomerValidCheck(customer){
//        if (customer == null){
//            return false;
//        }
//        else if (customer.match("^[0-9]{2}-[0-9]{2}-[0-9]{2}-[a-zA-Z0-9]{6}-[0-9]{3}$")){
//            return true;
//        }
//        else if (this.customer.match("^$")){
//            return false;
//        }
//        else {
//            return false;
//        }
//    }
    
//    newCustomerValidCheck(c: FormControl){
//        let newCustomerValid: boolean;
//        if (this.aieDiff && c.value.match("^[0-9]{2}-[0-9]{2}-[0-9]{2}-[a-zA-Z0-9]{6}-[0-9]{3}$") ){
//            newCustomerValid = true;
//        } else if (!this.aieDiff) {
//            newCustomerValid = true;
//        } else {
//            newCustomerValid = false;
//        }
//        
//        return newCustomerValid ? null : {
//            newCustomerValidCheck: {
//                valid: false
//            }
//        };
//    }
    
    justificationValidCheck(c: FormControl) {
        let  justificationValid: boolean;
        if (c.value == 0){
            justificationValid = false;
        } else {
            justificationValid = true;
        }
        
        return justificationValid ? null : {
            justificationValidCheck: {
                valid: false
            }
        };
    }
    
    resetJustDrop(i){
        let array = this.fctForm.get('fctRows') as FormArray;
        let group = array.at(i) as FormGroup
        let justification = group.controls['fct_justification'];
        justification.setValue(0);
        justification.updateValueAndValidity();
    }
    
    salesChanged(e, i) {
        this.fctForm[i].fct_sales_code = e.target.value;
        
    }
    
    costAcctChanged(e, i) {
        this.fctForm[i].fct_cost_account = e.target.value;
    }
    
    createCAValidator(salesValue) {
        return (c: FormControl) => {
            let err = {
                mutualExclusiveError: {
                    given: c.value,
                    disallowedSalesValue: salesValue
                }    
            }
            //console.log("Cost Account validaton function", c.value, salesValue);
            //console.log("validaton check", c.value, finAcctValue, err);
            var result = false;    
            switch (salesValue) {
            //case "V3": //already defined below
            case "X2": 
            //case "U2": //already defined below
            //case "U3": //already defined below
              if (c.value == 0) {
                //console.log("ca - x2 / must be non empty  but is " + c.value + " - invalid")
                result = true;
              }
              break;
            case "Q1":
            case "A1":
            case "A8":
              if (c.value != 0) {
                //console.log("ca - Q1/A1/A8 / must be 000  but is " + c.value + " - invalid")
                result = true;
              }
              break;
            case "V3":
              if (c.value != 161) {
                //console.log("ca - V3 / must be 161  but is " + c.value + " - invalid")
                result = true;
              }
              break;
            case "U2":
            case "U3":
              if (!(c.value == 145 ||
                    c.value == 170 ||
                    c.value == 172 ||
                    c.value == 180 ||
                    c.value == 811)) {
                //console.log("ca - U2/U3 / must be 145/170/172/180/811  but is " + c.value + " - invalid")
                result = true;
            }
              break;
            case "P1":
              if (c.value != 511) {
                //console.log("ca - P1 / must be 511  but is " + c.value + " - invalid")
                result = true;
              }
              break;
            case "V4":
              if (c.value != 191) {
                //console.log("ca - V4 / must be 191 but is " + c.value + " - invalid")
                result = true;
              }
              break;      
            }
            return result ? err : null;
        }    
    }    
    
    createCounterRangeValidator(finAcctValue) {
        return (c: FormControl) => {
            let err = {
                mutualExclusiveError: {
                    given: c.value,
                    disallowedFinAcct: finAcctValue
                }    
            }
            //console.log("SALES code validaton function", c.value, finAcctValue);
            var result = false;    
            switch (c.value) {
            //case "V3": //already defined below
            case "X2": 
            //case "U2": //already defined below
            //case "U3": //already defined below
              if (finAcctValue == "000") {
                //console.log("sc - x2 / must be non empty but is " + finAcctValue + "-  invalid")
                result = true;
              }
              break;
            case "Q1":
            case "A1":
            case "A8":
              if (finAcctValue != "000") {
                //console.log("sc - Q1/A1/A8 / must be 000 but is " + finAcctValue + "-  invalid")
                result = true;
              }
              break;
            case "V3":
              if (finAcctValue != "161") {
                //console.log("sc - V3 / must be 161 but is " + finAcctValue + "-  invalid")
                result = true;
              }
              break;
            case "U2":
            case "U3":
              if (!(finAcctValue == "145" ||
                    finAcctValue == "170" ||
                    finAcctValue == "172" ||
                    finAcctValue == "180" ||
                    finAcctValue == "811")) {
                //console.log("sc - U2/U3 / must be 145/170/172/180/811 but is " + finAcctValue + "-  invalid")
                result = true;
            }
              break;
            case "P1":
              if (finAcctValue != "511") {
                //console.log("sc - P1 / must be 511 but is " + finAcctValue + "-  invalid")
                result = true;
              }
              break;
            case "V4":
              if (finAcctValue != "191") {
                //console.log("sc - V4 / must be 191 but is " + finAcctValue + "-  invalid")
                result = true;
              }
              break;      
            }
    
            return result ? err : null;
        }    
    }
    
    reloadPage(){
        location.reload();
    }

}
