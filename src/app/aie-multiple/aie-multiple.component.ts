import { Component, OnInit,NgModule, EventEmitter, Input, Output, ViewChild } from '@angular/core';
//For model driven forms
import { FormGroup, FormControl, FormsModule, FormBuilder } from '@angular/forms';
// For services
import { CommonModule } from '@angular/common';
import { Region } from './region';
import { AieMultipleService } from './aie-multiple.service';
import { AieMultCust } from './aie-multiple';
import { AieMultVeh } from './aie-multiple';
import { AieFormData } from './aie-multiple';
import { AieMultCustData } from './aie-multiple';
import { AieMultDataToUpd } from './aie-multiple';
import { AieMultBaarTemp } from './aie-multiple';
import { CommonService } from '../common-components/common.service';
import { LoadingBarComponent } from '../common-components/loading-bar/loading-bar.component';
import { DataService } from '../common-components/data.service';
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'app-aie-multiple',
  templateUrl: './aie-multiple.component.html',
  styleUrls: ['./aie-multiple.component.css']
})
export class AieMultipleComponent implements OnInit {
@ViewChild('loadingModal') public loadingModal: ModalDirective;
@ViewChild(LoadingBarComponent) public loadingBarComponent: LoadingBarComponent;

    constructor(
              private AieMultipleService: AieMultipleService
             ,private commonServise: CommonService
             ,private formBuilder: FormBuilder
            , private dataService: DataService
      ) {
           this.aieMultipleForm = this.formBuilder.group({
           tagRows: this.formBuilder.array([])
        })
    }

    aieMultipleForm;

    userLID: string;
    userRegion: number;
    userPermLvl1: string;
    userPermLvl2: string;
    userPermLvl3: string;
    userPermLvl4: string;
    userPermLvl5: string;
    userPermLvl6: string;
    userPermLvl7: string;
    userPermLvl8: string;
    userPermLvl9: string;

    inRegion: number = 0;
    inFmc: number = 0;
    inSubFmc: number = 0;
    inBoac: string = "";
    inSerial: number = 0;
    inCustomer: string = "";

    saveRegion: number = 0;
    saveFmc: number = 0;
    saveSubFmc: number = 0;
    saveBoac: string = "";
    saveSerial: number = 0;
    saveCustomer: string = "";

    tempRegion: number = 0;
    tempFmc: number = 0;
    inCustRegion: number = 0;
    inCustFmc: number = 0;

    inResult: any;
    errorMessage: string;
    sysStatus: string ="";
    selectMsg: string = "";
    inBillBackOrCredit: string = "";
    inBillBack: string = "";
    inCredit: string = "";
    inFundCode: string = "";
    inAcct1: string = "";
    inAcct2: string = "";
    inSalesCode: string ="";
    inCostAcct: string = "";
    inDesc: string = "";
    inAmtToAllocate: number = 0.0;
    inAmtPerTag: number = 0.0;
    inSelectDelectAll: boolean = false;
    inCu_Cst_Dt_Time: string = "";
    inContact: string = "";
    inPhoneAc: string = "";
    inPhone7: string = "";

    tempBool: boolean = false;
    validBOACFundCd: boolean = false;
    noOfTagsSelected: number = 0;
    tempDesc: string = '';
    tempAmtPerTag: number = 0.0;
    aieMultCust;
    aieMultVehs;
    data;
    aieMultBaarTemps: AieMultBaarTemp[];
    boacFedCd = [];
    aieMultBaarTempsLength: number;
    region;
    strRegion
    fmc;
    strFmc
    subFmc;
    strSubFmc;
    boac;
    boac2: string = "";
    serial;
    strSerial;
    vh_Agency_Cl;
    vh_Tag;
    custTags = [];
    custBAARTemplates = [];
    custTagsSize: number = 0;
    custBAARTemplatesSize: number = 0;
    tagRows = [];
    tagsForThisPage = [] ;
    verifyCheckedCount: number = 0;
    tagRowsSize: number = 0;
    inx1: number =  0;
    maxColumns: number = 10;
    tagToUpd: AieMultVeh = new AieMultVeh("","","","","",0,false);
    tagsToUpd: AieMultVeh[] = new Array<AieMultVeh>();
    aieFormData = new AieFormData(0,0,0,"",0,"","","","","","","",0.0,0.0,"");
    aieCustData = new AieMultCustData("","","","");
    tagsToUpdTemp: AieMultVeh[] = new Array<AieMultVeh>();
    aieMultDataToUpd: AieMultDataToUpd = new AieMultDataToUpd(this.aieFormData, this.aieCustData, this.tagsToUpdTemp);

    indx1: number = 0;
    indx2: number = 0;
    currentPage: number;
    totalPages: number;
    maxTagsPerPage: number = 100;
    startItem: number=1;
    endItem: number;
    totalItems: number;
    itemsPerPage: number = 100;
    haveNoPage  : boolean = true;

  ngOnInit() {
      this.aieMultipleForm = new FormGroup({
               inRegion: new FormControl("")
              ,inFmc : new FormControl("")
              ,inCustomer : new FormControl("")
              ,inBillBackOrCredit: new FormControl("")
              ,inBillBack: new FormControl("")
              ,inCredit: new FormControl("")
              ,inFundCode : new FormControl("")
              ,inAcct1 : new FormControl("")
              ,inAcct2 : new FormControl("")
              ,inSalesCode : new FormControl("")
              ,inCostAcct: new FormControl("")
              ,inDesc: new FormControl("")
              ,inAmtToAllocate: new FormControl(0.00)
              ,inAmtPerTag: new FormControl(0.00)
              ,tagRows: new FormControl(this.tagRows)
        });

      this.dataService.currentSecurityRecord.subscribe(
          currentSecurityRecord =>  {
              this.userLID = currentSecurityRecord.lid;
              this.userRegion = currentSecurityRecord.region;
              this.userPermLvl1 = currentSecurityRecord.lvl1Perm;
              this.userPermLvl2 = currentSecurityRecord.lvl2Perm;
              this.userPermLvl5 = currentSecurityRecord.lvl5Perm;
              this.userPermLvl7 = currentSecurityRecord.lvl7Perm;
              this.userPermLvl8 = currentSecurityRecord.lvl8Perm;
          });

      this.getAllRegionRecords();

      this.inSelectDelectAll = false;
      this.noOfTagsSelected = 0;
      this.inSalesCode = "";
      this.inCostAcct = "";

      if ( !( this.userPermLvl1 == "X" || this.userPermLvl5 == "X" ||  this.userPermLvl7 == "X" ||  this.userPermLvl8 == "X" ) ) {
           this.sysStatus = "Your current permission levels do not allow you to perform update functions on this screen";
      }
      else {
          this.sysStatus = "Select Customer and click 'Get Tags'";
      }
  }

     regions: Region[];

     getAllRegionRecords() {
        console.log("AieMultipleService regions:regionComponent.ts");
        document.getElementById('idFmc')['value'] = '';
        document.getElementById('idCustomer')['value'] = '';
        this.fmc = '';
        this.inFmc = 0;
        this.regions = [];
        this.fmcs = [];
        this.customers = [];
        this.inCustomer = '';
        this.AieMultipleService.getRegions()
             .subscribe(
               regions => {
                   this.regions = regions;
                   document.getElementById('idFmc')['value'] = '';
                   document.getElementById('idCustomer')['value'] = '';
                   },
               error =>  {
                   this.errorMessage = <any>error;
                   this.aieMultipleForm.patchValue({message: this.errorMessage});
               });
       console.log("regions: you are at getAllRegionRecords()");

    }


    fmcs: string[];
    getCustFmcRecords(loadingModal) {
        this.loadingBarComponent.loadingModal.show();
        console.log("AieMultiple Component getCustFmcRecords() this.region:"+ this.inRegion);

        this.inCustomer = '';
        this.fmcs = [];
        this.customers = [];
        this.clearFields();
        document.getElementById('idCustomer')['value'] = '';

        this.AieMultipleService.getCustFmcRecords(this.inRegion.toString())
             .subscribe(
               fmcs => {
                   this.fmcs = fmcs;
                   this.inCustomer = '';
                   this.loadingBarComponent.loadingModal.hide();
                   },
               error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
                   this.aieMultipleForm.patchValue({message: this.errorMessage});
               });
    };

    customers: string[];
    getCustomers(loadingModal) {
        this.loadingBarComponent.loadingModal.show();
        console.log("AieMultiple Component getCustomers() this.region:"+ this.inRegion + " Fmc:" + this.inFmc);
        this.customers = [];
        this.inCustomer = '';
        this.clearFields ();
        this.AieMultipleService.getCustomers(this.inRegion, this.inFmc)
            .subscribe(
                customers => {
                    this.customers = customers;
                    console.log("Customers: ", this.customers);
                    this.loadingBarComponent.loadingModal.hide();
                    },
                 error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
               });
    }

    getCustomerVehTags(loadingModal) {
        console.log("AieMultiples: B4 this.AieMultipleService.getAieMultiples call " );

        console.log("AieMultiples: getCustomerVehTags this.inRegion:", this.inRegion );
        console.log("AieMultiples: getCustomerVehTags this.inFmc:", this.inFmc );

        if ( ! ( this.inRegion > 0 ) ) {
            alert ("ERROR - Please select a Region and FMC to retrieve Tags");
            return false;
        }


        this.inCustRegion = Number(this.inCustomer.substr(0,2));
        this.inCustFmc = Number(this.inCustomer.substr(3,2));

        console.log("AieMultiples: getCustomerVehTags this.inCustRegion:", this.inCustRegion );
        console.log("AieMultiples: getCustomerVehTags this.inCustFmc:", this.inCustFmc );

        if ( ( this.inCustRegion != this.inRegion ) ||
             ( this.inCustFmc != this.inFmc ) ) {
            alert ("ERROR - Customer Region/FMC different from Region/FMC selected");
            return false;
        }

        console.log("AieMultiples: getCustomerVehTags this.inCustomer length:", this.inCustomer.length );

        if (this.inCustomer.length < 19) {
            alert ("ERROR - 19 Character Customer Number expected");
            return false;
        }

        this.inRegion = Number(this.inCustomer.substr(0,2));
        this.inFmc = Number(this.inCustomer.substr(3,2));
        this.inSubFmc = Number(this.inCustomer.substr(6,2));
        this.inBoac = this.inCustomer.substr(9,6);
        this.inSerial = Number(this.inCustomer.substr(16,3));

//        console.log("updCustomerVehTags this.inRegion:", this.inRegion );
//        console.log("updCustomerVehTags this.inFmc:", this.inFmc );
//        console.log("updCustomerVehTags this.inSubFmc:", this.inSubFmc );
//        console.log("updCustomerVehTags this.inBoac:", this.inBoac );
//        console.log("updCustomerVehTags this.inSerial:", this.inSerial );
//        console.log("updCustomerVehTags this.saveRegion:", this.saveRegion );
//        console.log("updCustomerVehTags this.saveFmc:", this.saveFmc );
//        console.log("updCustomerVehTags this.saveSubFmc:", this.saveSubFmc );
//        console.log("updCustomerVehTags this.saveBoac:", this.saveBoac );
//        console.log("updCustomerVehTags this.saveSerial:", this.saveSerial );

//        if ( (this.inRegion != this.saveRegion) ||
//             (this.inFmc != this.saveFmc) ||
//             (this.inSubFmc != this.saveSubFmc) ||
//             (this.inBoac != this.saveBoac) ||
//             (this.inSerial != this.saveSerial) ) {
//           if ( (this.saveRegion > 0) &&
//                (this.saveBoac > ' ') &&
//                (this.saveSerial > 0) ) {
//                alert ("ERROR - Customer Number changed. Please retrieve Tags again before update.");
//                this.saveRegion = this.saveFmc = this.saveSubFmc = this.saveSerial = 0;
//                this.saveBoac = this.saveCustomer = "";
//                return false; }
//           else {
//              alert ("ERROR - Please retrieve Tags again before update.");
//              this.saveRegion = this.saveFmc = this.saveSubFmc = this.saveSerial = 0;
//              this.saveBoac = this.saveCustomer = "";
//              return false;
//           }
//        }

            console.log("AieMultiples: Region:" + this.inRegion  );
            console.log("AieMultiples: FMC:" + this.inFmc  );
            console.log("AieMultiples: subFMC:" + this.inSubFmc  );

            this.loadingBarComponent.loadingModal.show();
            this.AieMultipleService.getAieMultiples(this.inRegion,this.inFmc,this.inSubFmc,this.inBoac,this.inSerial)
//          this.AieMultipleService.getAieMultiples(10,4,0,'21A019',200)
//          this.AieMultipleService.getAieMultiples(1,1,0,'136000',1)
             .subscribe(
               data => {
                   this.totalPages = this.startItem = this.endItem = this.totalItems = this.totalPages = 0;
                   this.noOfTagsSelected = 0;
                   this.inSelectDelectAll = false;
//                 console.log("inSelectDelectAll DOM:" + document.getElementById('inSelectDelectAll')["checked"]     );
//                 document.getElementById('inSelectDelectAll')["checked"] = false;
                   this.data = data;
                   this.loadingBarComponent.loadingModal.hide();
                   console.log("this.data: ", this.data);
                   this.aieMultCust = this.data.Customer;
                   this.inCu_Cst_Dt_Time = '';
                   this.inContact = '';
                   this.inPhoneAc = '';
                   this.inPhone7  = '';
                   this.custTags = this.aieMultVehs = this.data.Vehicles;
                   this.custBAARTemplates = this.data.BAARTemplates;
                   if ( this.custBAARTemplates != null ) {
                        this.custBAARTemplatesSize = this.data.BAARTemplates.length;
                        console.log("this.custBAARTemplates:" + JSON.stringify(this.custBAARTemplates) );
                        console.log("this.custBAARTemplates Length:" + this.custBAARTemplatesSize ) ;
                       }
                   else {
                         this.custBAARTemplatesSize = 0;
                       }
                   this.sysStatus = "Customer Tag(s) listed below";
                   this.inSelectDelectAll = false;
                   this.selectMsg = "";
                   if (this.aieMultCust == null)
                   {
                     this.sysStatus = "Customer not found";
                     this.inSelectDelectAll = false;
                     this.tagRows.splice(0);
                     this.inCu_Cst_Dt_Time = '';
                     this.inContact = '';
                     this.inPhoneAc = '';
                     this.inPhone7  = '';
                     this.strRegion = this.strFmc = this.strSubFmc = this.boac = this.strSerial = '';
                     this.inBillBackOrCredit = this.inFundCode = this.inAcct1 = this.inAcct2 = this.inSalesCode = this.inCostAcct = this.inDesc = '';
                     document.getElementsByName('inBillBackOrCredit')[0]["checked"] = false;
                     document.getElementsByName('inBillBackOrCredit')[1]["checked"] = false;
                     this.inAmtToAllocate = this.inAmtPerTag = 0;
                     this.totalPages = this.startItem = this.endItem = this.totalItems = this.totalPages = this.noOfTagsSelected = 0;
                   }
                   else
                   if (this.aieMultVehs == null) {
                          this.sysStatus = "No Tags found for Customer";
                          this.inSelectDelectAll = false;
                          this.inCu_Cst_Dt_Time = this.data.Customer.cu_Cst_Dt_Time;
                          this.inContact = this.data.Customer.contact;
                          this.inPhoneAc = this.data.Customer.phoneAc;
                          this.inPhone7  = this.data.Customer.phone7;
                          this.inBillBackOrCredit = this.inFundCode = this.inAcct1 = this.inAcct2 = this.inSalesCode = this.inCostAcct = this.inDesc = '';
                          document.getElementsByName('inBillBackOrCredit')[0]["checked"] = false;
                          document.getElementsByName('inBillBackOrCredit')[1]["checked"] = false;
                          this.inAmtToAllocate = this.inAmtPerTag = 0;
                          this.totalPages = this.startItem = this.endItem = this.totalItems = this.totalPages = this.noOfTagsSelected = 0;
                   }
                   else
                   if (this.aieMultVehs.length > 0 ) {
//                       this.aieMultVehs[0].vh_Tag_Checked = true;
//                       this.tagRows = this.commonServise.breakArray(this.maxColumns,this.aieMultVehs);
                        this.selectMsg = "Select Tag(s) to process:";

                        this.saveRegion   =   this.inRegion;
                        this.saveFmc      =   this.inFmc;
                        this.saveSubFmc   =   this.inSubFmc;
                        this.saveBoac     =   this.inBoac;
                        this.saveSerial   =   this.inSerial;
                        this.saveCustomer =   this.inCustomer;

                        this.inCu_Cst_Dt_Time = this.data.Customer.cu_Cst_Dt_Time;
                        this.inContact = this.data.Customer.contact;
                        this.inPhoneAc = this.data.Customer.phoneAc;
                        this.inPhone7  = this.data.Customer.phone7;
                        this.inBillBackOrCredit = this.inFundCode = this.inAcct1 = this.inAcct2 = this.inSalesCode = this.inCostAcct = this.inDesc = '';
                        document.getElementsByName('inBillBackOrCredit')[0]["checked"] = false;
                        document.getElementsByName('inBillBackOrCredit')[1]["checked"] = false;
                        this.inAmtToAllocate = this.inAmtPerTag = 0;
                        this.inSelectDelectAll = false;
                        this.totalItems  = this.aieMultVehs.length;
                        // build   tagsForThisPage
                        this.tagsForThisPage.splice(0);
                        this.tagRows.splice(0);
                        for ( this.indx1=0; this.indx1 < this.maxTagsPerPage; this.indx1++ ) {
                            this.tagsForThisPage.push(this.aieMultVehs[this.indx1]);
                        }
                        this.tagRows = this.commonServise.breakArray(10,this.tagsForThisPage);
                        console.log("this.tagRows: ", JSON.stringify(this.tagRows) );
                        this.startItem = 1;
                        this.totalPages  = this.totalItems  / this.maxTagsPerPage ;
                        this.endItem = this.startItem + this.maxTagsPerPage - 1 ;
                        if ( this.totalItems < this.maxTagsPerPage ) {
                           this.endItem = this.totalItems ;
                        }
                        this.currentPage = 1;
                        this.haveNoPage = false;
                   }
                   else
                   {
                       this.sysStatus = "No Tags found for Customer";
                       this.noOfTagsSelected = 0;
                       this.tagRows.splice(0);
                   };


                   if (this.aieMultCust != null) {
                           if (this.aieMultCust.cu_Region < 10 )
                              {
                               this.strRegion = "0" + this.aieMultCust.cu_Region;
                              }
                           else
                              this.strRegion = this.aieMultCust.cu_Region;
                              ;
                           if (this.aieMultCust.fmc < 10 )
                              {
                               this.strFmc = "0" + this.aieMultCust.fmc;
                              }
                           else
                              this.strFmc = this.aieMultCust.fmc;
                              ;
                            if (this.aieMultCust.subFMC < 10 )
                              {
                               this.strSubFmc = "0" + this.aieMultCust.subFMC;
                              }
                           else
                              this.strSubFmc = this.aieMultCust.subFMC;
                              ;
                            if (this.aieMultCust.serial < 10 )
                              {
                               this.strSerial = "00" + this.aieMultCust.serial;
                              }
                           else
                           if (this.aieMultCust.serial < 100 )
                              {
                               this.strSerial = "0" + this.aieMultCust.serial;
                              }
                           else
                              this.strSerial = this.aieMultCust.serial;
                              ;
                           this.boac = this.aieMultCust.boac;
                   }

                   },
               error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
                   this.aieMultipleForm.patchValue({message: this.errorMessage});
               });
            console.log("AieMultiples: after this.AieMultipleService.getAieMultiples call " );
    }

    changePage(p: number) {
        this.tagsForThisPage.splice(0);
        for ( this.indx1=(this.maxTagsPerPage * (p-1)); this.indx1 < (this.maxTagsPerPage * p); this.indx1++ ) {
              this.tagsForThisPage.push(this.aieMultVehs[this.indx1]);
        }
//      console.log("New Tag list length: " + JSON.stringify(this.tagsForThisPage.length)   );
        this.tagRows.splice(0);
        this.tagRows = this.commonServise.breakArray(10,this.tagsForThisPage);
        this.startItem = ( this.maxTagsPerPage * (p-1) )  + 1;
        this.endItem = this.startItem + this.maxTagsPerPage - 1;
        if ( this.endItem > this.totalItems ) {
            this.endItem = this.totalItems;
        }
        for (this.inx1 = 0; this.inx1 < this.custTagsSize; this.inx1++) {
            this.custTags[this.inx1].vh_Tag_Checked = false;
        }
        this.noOfTagsSelected = 0;
        this.inSelectDelectAll = false;
        document.getElementById('inSelectDelectAll')["checked"] = false;

        this.inBillBackOrCredit = " ";
        document.getElementById('inBillBack')["checked"] = false;
        document.getElementById('inCredit')["checked"] = false;
        document.getElementById('inBillBack')["value"] = "";
        document.getElementById('inCredit')["value"] = "";

        this.aieMultipleForm = new FormGroup({
               inRegion: new FormControl("")
              ,inFmc : new FormControl("")
              ,inCustomer : new FormControl("")
              ,inBillBackOrCredit: new FormControl("")
              ,inBillBack: new FormControl("")
              ,inCredit: new FormControl("")
              ,inFundCode : new FormControl("")
              ,inAcct1 : new FormControl("")
              ,inAcct2 : new FormControl("")
              ,inSalesCode : new FormControl("")
              ,inCostAcct: new FormControl("")
              ,inDesc: new FormControl("")
              ,inAmtToAllocate: new FormControl(0.0)
              ,inAmtPerTag: new FormControl(0.0)
              ,tagRows: new FormControl(this.tagRows)
        });

//        this.inBillBack = "";
//        this.inCredit = "";

        this.sysStatus = "Select Tag(s) to process:";
//        console.log("New Tag list : " + JSON.stringify(this.tagsForThisPage)   );
    }

 //handle pagination change
    pageChanged(e) {
        this.changePage(e.page);
    }


// when dropdown region is selected, this triggers the loading of list of FMCs # for the selected region in dropdown
    changeRegion(newRegion,loadingModal) {
        console.log("get FMCs of region on change:" + newRegion);
        this.inRegion = newRegion;
        this.getCustFmcRecords(loadingModal);
    }

// when dropdown FMC is selected, this triggers the loading of  list of Customer#s for the selected region and FMC
    changeFmc(newFmc,loadingModal) {
        console.log("get Cust# for Region and FMC:" + this.inRegion + " " + newFmc);
        console.log("FMC Length:" + newFmc.length     );
        if ( newFmc.length > 1 ) {
           console.log("FMC 1:" + newFmc[0]     );
           this.inFmc = newFmc[0];
        }
        else {
           this.inFmc = newFmc;
        }
        this.getCustomers(loadingModal);
        this.inCustomer='';
    }

    changeCustomer(newCustomer) {
        console.log("get Cust# for Region and FMC:" + this.inRegion + " " + this.inFmc + " " + newCustomer);
        this.inCustomer = newCustomer;
    }

    tagSelectChange(inVal) {
        console.log("tagSelectChange inVal:" + inVal + " " + JSON.stringify(inVal));
        console.log(inVal.vh_Tag_Checked);
        if (inVal.vh_Tag_Checked) {
               this.noOfTagsSelected++;
            }
        else {
               this.noOfTagsSelected--;
            }

        this.custTagsSize = this.custTags.length;
        console.log(this.custTagsSize);
        this.inx1 = 0;

        for (this.inx1 = 0; this.inx1 < this.custTagsSize; this.inx1++) {
            if ( inVal.vh_Agency_Cl == this.custTags[this.inx1].vh_Agency_Cl && inVal.vh_Tag == this.custTags[this.inx1].vh_Tag ) {
                console.log(JSON.stringify(this.custTags[this.inx1]));
                console.log(" index=" + this.inx1);
            }
        }

//        this.verifyCheckedCount = 0;
//        for (this.inx1 =0; this.inx1 < this.custTagsSize; this.inx1++) {
//            if ( this.custTags[this.inx1].vh_Tag_Checked ) {
//                this.verifyCheckedCount++;
//            }
//        }
//        console.log("Checked Count=" + this.verifyCheckedCount);

    }

    selectAllChange(inVal) {

        this.tempBool = inVal;

        console.log("selectAllChange inVal:" + JSON.stringify(inVal));
        console.log("tempBool inVal:" + this.tempBool);

        this.custTagsSize = this.custTags.length;
        console.log(this.custTagsSize);
        this.noOfTagsSelected = 0;
        this.inx1 = 0;

        if ( this.custTagsSize > -1 ) {

           for (this.inx1 = ( this.startItem - 1 ) ; this.inx1 < this.endItem; this.inx1++) {
                this.custTags[this.inx1].vh_Tag_Checked = inVal;
                if ( inVal == true )
                   this.noOfTagsSelected++
                else
                   this.noOfTagsSelected--;
           }

//          this.verifyCheckedCount = 0;
//          for (this.inx1 =0; this.inx1 < this.custTagsSize; this.inx1++) {
//                if ( this.custTags[this.inx1].vh_Tag_Checked ) {
//                   this.verifyCheckedCount++;
//                }
//              }
//          console.log("Checked Count=" + this.verifyCheckedCount);

        }

    }

    changeFundCode(newFundCode) {
        console.log("newFundCode :" + newFundCode);
        this.inFundCode = newFundCode;
    }

    changeAcct1(newAcct1) {
        console.log("newAcct1 :" + newAcct1);
        this.inAcct1 = newAcct1;
    }

    changeAcct2(newAcct2) {
        console.log("newAcct2 :" + newAcct2);
        this.inAcct2 = newAcct2;
    }

    updCustomerVehTags(loadingModal) {

        if ( !( this.userPermLvl1 == "X" || this.userPermLvl5 == "X" ||  this.userPermLvl7 == "X" ||  this.userPermLvl8 == "X" ) ) {
           this.sysStatus = "Your current permission levels do not allow you to perform update functions on this screen";
           alert("Your current permission levels do not allow you to perform update functions on this screen");
           return false;
        }

        console.log("AieMultiples: getCustomerVehTags this.inRegion:", this.inRegion );
        console.log("AieMultiples: getCustomerVehTags this.inFmc:", this.inFmc );

        this.inCustRegion = Number(this.inCustomer.substr(0,2));
        this.inCustFmc = Number(this.inCustomer.substr(3,2));

        console.log("AieMultiples: getCustomerVehTags this.inCustRegion:", this.inCustRegion );
        console.log("AieMultiples: getCustomerVehTags this.inCustFmc:", this.inCustFmc );


        if (this.inCustomer.length < 19) {
            alert ("ERROR - 19 Character Customer Number expected");
            return false;
        }

        if ( ( this.inCustRegion != this.inRegion ) ||
             ( this.inCustFmc != this.inFmc ) ) {
            alert ("ERROR - Customer Region/FMC different from Region/FMC selected");
            return false;
        }

        this.tempAmtPerTag = 0.0;

        this.inRegion = Number(this.inCustomer.substr(0,2));
        this.inFmc = Number(this.inCustomer.substr(3,2));
        this.inSubFmc = Number(this.inCustomer.substr(6,2));
        this.inBoac = this.inCustomer.substr(9,6);
        this.inSerial = Number(this.inCustomer.substr(16,3));

//        console.log("updCustomerVehTags this.inRegion:", this.inRegion );
//        console.log("updCustomerVehTags this.inFmc:", this.inFmc );
//        console.log("updCustomerVehTags this.inSubFmc:", this.inSubFmc );
//        console.log("updCustomerVehTags this.inBoac:", this.inBoac );
//        console.log("updCustomerVehTags this.inSerial:", this.inSerial );
//        console.log("updCustomerVehTags this.saveRegion:", this.saveRegion );
//        console.log("updCustomerVehTags this.saveFmc:", this.saveFmc );
//        console.log("updCustomerVehTags this.saveSubFmc:", this.saveSubFmc );
//        console.log("updCustomerVehTags this.saveBoac:", this.saveBoac );
//        console.log("updCustomerVehTags this.saveSerial:", this.saveSerial );

        if ( (this.inRegion != this.saveRegion) ||
             (this.inFmc != this.saveFmc) ||
             (this.inSubFmc != this.saveSubFmc) ||
             (this.inBoac != this.saveBoac) ||
             (this.inSerial != this.saveSerial) ) {
           if ( (this.saveRegion > 0) &&
                (this.saveBoac > ' ') &&
                (this.saveSerial > 0) ) {
                alert ("ERROR - Customer Number changed. Please retrieve Tags again before update.");
                this.saveRegion = this.saveFmc = this.saveSubFmc = this.saveSerial = 0;
                this.saveBoac = this.saveCustomer = "";
                return false; }
           else {
              alert ("ERROR - Please retrieve Tags again before update.");
              this.saveRegion = this.saveFmc = this.saveSubFmc = this.saveSerial = 0;
              this.saveBoac = this.saveCustomer = "";
              return false;
           }
        }

        if ( this.inBoac == "777777" || this.inBoac == "999999" ) {
            alert ("ERROR - Cannot bill Customer 777777 or 999999");
            document.getElementById('idCustomer').focus();
            return false;
        }

        if ( ! (this.noOfTagsSelected > 0) )
        {
            alert ("ERROR - No Tag(s) selected to process");
            document.getElementById('inSelectDelectAll').focus();
            return false;
        }

        if ( ! (this.inBillBackOrCredit > '') )
        {
            alert ("ERROR - Must select Bill Back Or Credit");
            document.getElementById('inBillBack').focus();
            return false;
        }

        this.boac2 = this.inBoac.substring(0,2);
        if ( this.boac2 == "47" ) {
            if ( !(this.inFundCode > "") ) {
                alert ("ERROR - Fund Code required for this BOAC");
                document.getElementById('inFundCode').focus();
                return false;
            }
            this.inx1 = 0;
            this.validBOACFundCd = false;
            for (this.inx1 = 0; this.inx1 < this.custBAARTemplatesSize; this.inx1++) {
                if ( this.inFundCode ==  this.custBAARTemplates[this.inx1].btFedCode ) {
                   this.validBOACFundCd = true;
                }
            }
            if (!this.validBOACFundCd) {
                alert ("ERROR - Invalid Fund Code for this BOAC");
                document.getElementById('inFundCode').focus();
                return false;
            }
        }


        if ( this.inCostAcct == '160' || this.inCostAcct == '161' )
        {
            this.inSalesCode = 'V3' ;
            this.inCostAcct  = '161' ;
        }
        else if ( this.inSalesCode == 'V3' ) {
                this.inSalesCode = 'V3' ;
                this.inCostAcct  = '161' ;
            }

        if ( ! (this.inSalesCode > '') )
        {
            alert ("ERROR - Must select Sales Code");
            document.getElementById('salesCode').focus;
            return false;
        }

        if ( this.inSalesCode == 'D1' || this.inSalesCode == 'D2' )
        {
           if ( ! (this.userPermLvl1 == "X" || this.userPermLvl2 == "X") )
           {
            alert ("ERROR - ONLY CO-Admin and CO-Support can user Sales Codes D1 and D2");
            document.getElementById('salesCode').focus;
            return false;
           }
        }

        if ( ! (this.inCostAcct > '') )
        {
            if ( this.inSalesCode == "U2" || this.inSalesCode == "U3" || this.inSalesCode == "V3" || this.inSalesCode == "X2" )
            {
            alert ("ERROR - Cost Acct MANDATORY for the Sales Code selected");
            document.getElementById('costAcct').focus();
            return false;
            }
        }

        if ( this.inSalesCode == "A1" || this.inSalesCode == "A8" || this.inSalesCode == "Q1" ) {
           if ( this.inCostAcct > '' ) {
              alert ("ERROR - Cost Acct NOT ALLOWED for the Sales Code selected");
              document.getElementById('costAcct').focus();
              return false;
           }
        }
        else  if ( this.inSalesCode == "V3" ) {
                 if ( ! ( this.inCostAcct == '160' || this.inCostAcct == '161' ) ) {
                    alert ("ERROR - ONLY Cost Acct allowed for the selected Sales Code are : 160 or 161");
                    document.getElementById('costAcct').focus();
                    return false;
              }
        }
        else if ( this.inSalesCode == "U2" || this.inSalesCode == "U3" ) {
             if ( ! ( this.inCostAcct == '145' || this.inCostAcct == '170' || this.inCostAcct == '172' || this.inCostAcct == '180' || this.inCostAcct == '811') ) {
                    alert ("ERROR - " + this.inCostAcct + " is NOT A VALID Cost Acct for the Sales Code selected - " + this.inSalesCode);
                    document.getElementById('costAcct').focus();
                    return false;
              }
        }
        else {
              if ( ! ( this.inCostAcct == '145' || this.inCostAcct == '170' || this.inCostAcct == '171' || this.inCostAcct == '172' || this.inCostAcct == '180' ||
                       this.inCostAcct == '190' || this.inCostAcct == '191' || this.inCostAcct == '511' || this.inCostAcct == '611' || this.inCostAcct == '711' ||
                       this.inCostAcct == '712' || this.inCostAcct == '811'
                     )
                 ) {
                    alert ("ERROR - " + this.inCostAcct + " is NOT A VALID Cost Acct for the Sales Code selected - " + this.inSalesCode);
                    document.getElementById('costAcct').focus();
                    return false;
              }
        }

        if ( this.inSalesCode == "P1" ) {
            if (! ( this.inCostAcct == '511') ) {
                alert ("ERROR - Sale Code 'P1' can only be used with Cost Acct '511' ");
                document.getElementById('costAcct').focus();
                return false;
            }
        }

        if ( this.inCostAcct == '511')  {
           if ( ! ( this.inSalesCode == "P1" ) ) {
                    alert ("ERROR - Cost Acct '511' can only be used with Sale Code 'P1' ");
                    document.getElementById('costAcct').focus();
                    return false;
            }
        }

        if ( this.inSalesCode == "V4" ) {
            if (! ( this.inCostAcct == '191') ) {
                alert ("ERROR - Sale Code 'V4' can only be used with Cost Acct '191' ");
                document.getElementById('costAcct').focus();
                return false;
            }
        }

        if ( this.inCostAcct == '191')  {
           if ( ! ( this.inSalesCode == "V4" ) ) {
                    alert ("ERROR - Cost Acct '191' can only be used with Sale Code 'V4' ");
                    document.getElementById('costAcct').focus();
                    return false;
            }
        }

        if ( ! (this.inDesc > '') )
        {
            alert ("ERROR - Must enter description");
            document.getElementById('inDesc').focus();
            return false;
        }

        this.tempDesc = this.inDesc.toLowerCase();

        if (this.tempDesc.indexOf('<') > -1) {
           if (this.tempDesc.indexOf('script') > -1) {
                   alert ("ERROR - Description can not contain the character sequence - '<' and 'script' ");
                   document.getElementById('inDesc').focus();
                   return false;
            }
        }

        if (this.tempDesc.indexOf('>') > -1) {
           if (this.tempDesc.indexOf('script') > -1) {
                   alert ("ERROR - Description can not contain the character sequence - 'script' and '>' ");
                   document.getElementById('inDesc').focus();
                   return false;
            }
        }

        if ( isNaN(this.inAmtToAllocate) )
        {
            alert ("ERROR - Amount to allocate must be numeric");
            document.getElementById('inAmtToAllocate').focus();
            return false;
        }

        if ( isNaN(this.inAmtPerTag) )
        {
            alert ("ERROR - Amount Per Tag must be numeric");
            document.getElementById('inAmtPerTag').focus();
            return false;
        }

        if ( ! (this.inAmtToAllocate > 0.0 || this.inAmtPerTag > 0.0) )
        {
            alert ("ERROR - Amount to Allocate OR Amount Per Tag required");
            document.getElementById('inAmtToAllocate').focus();
            return false;
        }

        if (this.inAmtToAllocate > 0.0 && this.inAmtPerTag > 0.0)
        {
            alert ("ERROR - ONLY Amount to Allocate OR Amount Per Tag required");
            document.getElementById('inAmtPerTag').focus();
            return false;
        }

        if ( this.inAmtToAllocate > 0.0 ) {
            this.tempAmtPerTag = this.inAmtToAllocate / this.noOfTagsSelected;
            if (this.tempAmtPerTag < 5.00) {
                alert ("ERROR - Amount Per Tag must be minimum $5.00");
                this.inAmtPerTag = this.tempAmtPerTag;
                document.getElementById('inAmtPerTag').focus();
                return false;
            }
            this.inAmtPerTag =  this.tempAmtPerTag;
            this.inAmtPerTag =  Math.round(this.inAmtPerTag*100)/100;
        }

        if (this.inAmtPerTag < 5.00) {
           alert ("ERROR - Amount Per Tag must be minimum $5.00");
           document.getElementById('inAmtPerTag').focus();
           return false;
        }

        if (this.inAmtPerTag > 99999.99) {
           alert ("ERROR - Amount Per Tag cannot exceed $99999.99");
           document.getElementById('inAmtPerTag').focus();
           return false;
        }

        this.loadingBarComponent.loadingModal.show();
        this.tagsToUpd.splice(0);
        console.log("AieMultiples: in updCustomerVehTags component" );

        this.verifyCheckedCount = 0;
        for (this.inx1 = 0; this.inx1 < this.custTagsSize; this.inx1++) {
            if ( this.custTags[this.inx1].vh_Tag_Checked ) {
                 this.verifyCheckedCount++;
                 this.tagsToUpd.push(this.custTags[this.inx1]);
            }
        }

        console.log("Tags to Upd Count:" + this.verifyCheckedCount );

        this.aieMultDataToUpd.tagsToUpd = this.tagsToUpd;
        console.log("this.aieMultDataToUpd.tagsToUpd =>" + JSON.stringify(this.aieMultDataToUpd.tagsToUpd) );

        this.aieFormData.userLID = this.userLID;
        this.aieFormData.cu_Region = this.inRegion;
        this.aieFormData.fmc = this.inFmc;
        this.aieFormData.subFMC = this.inSubFmc;
        this.aieFormData.boac = this.inBoac;
        this.aieFormData.serial = this.inSerial;
        this.aieFormData.billBackOrCredit = this.inBillBackOrCredit;
        this.aieFormData.fundCode = this.inFundCode;
        this.aieFormData.acct1 = this.inAcct1;
        this.aieFormData.acct2 = this.inAcct2;
        this.aieFormData.salesCode = this.inSalesCode ;
        this.aieFormData.costAcct = this.inCostAcct;
        this.aieFormData.descript = this.inDesc;
        this.aieFormData.amtToAllocate = this.inAmtToAllocate;
        this.aieFormData.amtPerTag = this.inAmtPerTag;
        this.aieMultDataToUpd.aieFormData = this.aieFormData;

        this.aieCustData.cu_Cst_Dt_Time = this.inCu_Cst_Dt_Time;
        this.aieCustData.contact = this.inContact;
        this.aieCustData.phoneAc = this.inPhoneAc;
        this.aieCustData.phone7 = this.inPhone7;
        this.aieMultDataToUpd.aieCustData = this.aieCustData;

//      this.AieMultipleService.updCustomerVehTags(this.aieMultDataToUpd).subscribe();
        this.AieMultipleService.updCustomerVehTags(this.aieMultDataToUpd)
            .subscribe(
               result => {
                     if (result == true) {
                         console.log("result is true");
                     }
                     else {
                         console.log("result is false");
                         this.inResult = result;
                         console.log("result msg => ", (result) => { this.inResult = result; this.inResult.message; } );
                     }
                     if (result == true) {
                        if (this.inBillBackOrCredit == "B") {
                            this.sysStatus = "Billback Successful";
                        } else
                        if (this.inBillBackOrCredit == "C") {
                            this.sysStatus = "Credit Successful";
                        }
                        else {
                           this.sysStatus = "UNKNOWN Billback/Credit indicator";
                         };
                     }
                     else {
                         this.sysStatus = "UPDATE ERROR => " + this.inResult.message ;
                     }
                     this.saveRegion = this.saveFmc = this.saveSubFmc = this.saveSerial = 0;
                     this.saveBoac = this.saveCustomer = "";
                     this.loadingBarComponent.loadingModal.hide();
               },
               error => {
                           this.sysStatus = "UPDATE ERROR" + error.errorMessage;
                           console.log("Msg Received=>" + error.errorMessage);
                           this.saveRegion = this.saveFmc = this.saveSubFmc = this.saveSerial = 0;
                           this.saveBoac = this.saveCustomer = "";
                           this.loadingBarComponent.loadingModal.hide();
               }     );
//        this.loadingBarComponent.loadingModal.hide();

    }

    clearPage(loadingModal) {
        console.log("clear page");
        this.inRegion = 0;
        this.inFmc = 0;
        this.inSubFmc = 0;
        this.inBoac = '';
        this.inSerial = 0;

        this.ngOnInit();
        this.regions = [];
        this.fmcs = [];
        this.customers = [];
        this.inCustomer = '';
        document.getElementById('idFmc')['value'] = "";

        this.inBillBackOrCredit = '';
        this.inBillBack = '';
        this.inCredit = '';
        document.getElementById('idRegion')['value'] = '';
        document.getElementById('idFmc')['value'] = '';
        document.getElementById('idCustomer')['value'] = '';
        this.sysStatus = "Select Customer and click 'Get Tags'";
        this.inBillBackOrCredit = this.inFundCode = this.inAcct1 = this.inAcct2 = this.inSalesCode = this.inCostAcct = this.inDesc = '';

        document.getElementsByName('inBillBackOrCredit')[0]["value"] = "";
        document.getElementsByName('inBillBackOrCredit')[1]["value"] = "";
        document.getElementsByName('inBillBackOrCredit')[0]["checked"] = false;
        document.getElementsByName('inBillBackOrCredit')[1]["checked"] = false;

        if ( !( this.userPermLvl1 == "X" || this.userPermLvl5 == "X" ||  this.userPermLvl7 == "X" ||  this.userPermLvl8 == "X" ) ) {
           this.sysStatus = "Your current permission levels do not allow you to perform update functions on this screen";
        }

//      console.log("this.aieMultVehs.length:", JSON.stringify(this.aieMultVehs.length) );
//      this.aieMultVehs.splice(0);
        this.totalItems  = 0;
        // build   tagsForThisPage
        this.tagsForThisPage.splice(0);
        this.tagRows.splice(0);
        this.tagRows = this.commonServise.breakArray(10,this.tagsForThisPage);
        console.log("this.tagRows: ", JSON.stringify(this.tagRows) );
        this.startItem = this.endItem = this.totalPages = 0;
        this.currentPage = 1;
        this.haveNoPage = false;

    }

    clearFields () {


        this.customers = [];
        this.inCustomer = '';

        this.inBillBackOrCredit = '';
        this.inBillBack = '';
        this.inCredit = '';

        document.getElementById('idCustomer')['value'] = '';
        this.sysStatus = "Select Customer and click 'Get Tags'";
        this.inBillBackOrCredit = this.inFundCode = this.inAcct1 = this.inAcct2 = this.inSalesCode = this.inCostAcct = this.inDesc = '';

        document.getElementsByName('inBillBackOrCredit')[0]["value"] = "";
        document.getElementsByName('inBillBackOrCredit')[1]["value"] = "";
        document.getElementsByName('inBillBackOrCredit')[0]["checked"] = false;
        document.getElementsByName('inBillBackOrCredit')[1]["checked"] = false;

        if ( !( this.userPermLvl1 == "X" || this.userPermLvl5 == "X" ||  this.userPermLvl7 == "X" ||  this.userPermLvl8 == "X" ) ) {
           this.sysStatus = "Your current permission levels do not allow you to perform update functions on this screen";
        }

//      console.log("this.aieMultVehs.length:", JSON.stringify(this.aieMultVehs.length) );
//      this.aieMultVehs.splice(0);
        this.totalItems  = 0;
        // build   tagsForThisPage
        this.tagsForThisPage.splice(0);
        this.tagRows.splice(0);
        this.tagRows = this.commonServise.breakArray(10,this.tagsForThisPage);
        console.log("this.tagRows: ", JSON.stringify(this.tagRows) );
        this.startItem = this.endItem = this.totalPages = 0;
        this.currentPage = 1;
        this.haveNoPage = false;

    }

}


