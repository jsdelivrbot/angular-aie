
import { Component, OnInit,NgModule, EventEmitter, Input, Output, ViewChild } from '@angular/core';
//For model driven forms
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, NgForm, FormArray,ReactiveFormsModule } from '@angular/forms';
// For services
import { CommonModule } from '@angular/common';
import { SaleAieService } from './sale-aie.service';
import { Region } from './region';
import { SaleAieRecords } from './saleAieRecords';
import { VehSaRepairs } from './vehSaRepairs';
import { CommonService } from '../common-components/common.service';
import { DataService } from '../common-components/data.service';
import { SecurityRecord } from '../common-components/common-structures';
import { LoadingBarComponent } from '../common-components/loading-bar/loading-bar.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SaveFieldSaUpd } from './saveFieldUpd';
import { SaveFieldVsrUpd } from './saveFieldUpd';
import { PagerComponent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-sale-aie',
  templateUrl: './sale-aie.component.html',
  styleUrls: ['./sale-aie.component.css']
})

export class SaleAieComponent implements OnInit {

    /*
   * @ViewChild allows you to directly access an instance of a child component.
   * This will allow you to access any this.defined variables of the child
   * as well.
   *
   * @ViewChild can also allow you to directly access local variables from
   * the view/html. And example can be seen in LoadingBarComponent.
   */
    @ViewChild(LoadingBarComponent) public loadingBarComponent: LoadingBarComponent;
    @ViewChild('loadingModal') public loadingModal:ModalDirective;
    @ViewChild('paginationModule') public pager: PagerComponent;
    isOn: boolean;
    saleAieForm;
    vsrForm;
    region: string;
    saleNo: string;
    agencyCl: string;
    tag: string;
    itemIdAlphaList: String[];
    checkSaleOnly: boolean;
    //add Est
    repairClassKey: string;
    repairClassKeyChange: string;

    //show/hide inline
    viewThis = [];
    //index: number=0;
    i: number = 0;
    private sasySaleUpdateCount: number = 0;
    private newVsr: VehSaRepairs;
    private newVsrArray: VehSaRepairs[] = [];

    private saveFieldVsrUpds: SaveFieldVsrUpd[] = [];
    private saveFieldSaUpds: SaveFieldSaUpd[] = [];
    private stringArray: String[];
    private saleAieScreen: SaleAieRecords;
    private saleAieUpdObjects: SaleAieRecords[] = [];
    private securityRecord : SecurityRecord;


    constructor(
        private saleAieService: SaleAieService,
        private commonService: CommonService,
        private dataService: DataService,
        private formBuilder: FormBuilder


    ) {
        this.newVsr = new VehSaRepairs('', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', false, false, 0, false, false);
        this.saleAieScreen = new SaleAieRecords(0, '', '', '', 0, 0, '', '', '', '', 0, '', '', 0, '', '', 0, '', '', '', 0, 0, '', this.newVsrArray, this.stringArray, false, false, false, false, false, false, false, false, 0, false, 0, 0, '', '', false, 0, 0, 0, 0, false);

        this.isOn = false;
        this.saleAieForm = this.formBuilder.group({
            saRows: this.formBuilder.array([])
        })
        //
        this.vsrForm = this.formBuilder.group({
            vsrRows: this.formBuilder.array([])
        })

    }

    //data service variables
    host: string;
    customerLid: string;
    customerName: string;
    customerRegion: number;
    hasEditAccess: boolean =false;
    currentSecurityRecord: SecurityRecord;
    userPermUpd: boolean = false;
    //end data service variables

    saleAieRecords: SaleAieRecords[];
    vsrs: VehSaRepairs[];
    saleAie: number;
    saleAiePages = [];
    saleAiePage = [];
    currentPage: number;
    previousPage: number;
    totalPages: number;
    startItem: number;
    endItem: number;
    totalItems: number;
    itemsPerPage: number = 20;
    haveNoPage: boolean = true;

    oDTowing: string = "TOWING";
    oDTransportation: string = "TRANSPORTATION";
    oDEarlySelling: string = "EARLY_SELLING_FEES_DUE_TO_ACCIDENT";
    oDExtCleaning: string = "EXTENSIVE_CLEANING_REQUIRED";
    oDBioHazard: string = "BIO_HAZARD_EXPENSES";
    oDExtDecalRemoval: string = "EXTENSIVE_DECAL_REMOVAL";


    ngOnInit() {

        this.getGlobalData();
        this.region = this.customerRegion.toString();
        this.getAllRegionRecords();
        //testing only

        this.getSaleRecords("N");
        //testing only end
        this.initViewThis();
        this.repairClassKey = "";
        this.agencyCl = "";
        this.tag = "";
        this.i = 0;
        //this.index=0;
        this.checkSaleOnly = true;

    }

    //This getGlobalData will get all common fields available which are populated at home/manu page.
    getGlobalData() {
        this.dataService.currentHostName.subscribe(host => this.host = host);
        this.dataService.currentLid.subscribe(customerLid => this.customerLid = customerLid);
        this.dataService.currentCustomerName.subscribe(customerName => this.customerName = customerName);
        this.dataService.currentRegion.subscribe(customerRegion => this.customerRegion = customerRegion);
        this.dataService.hasEditAccess.subscribe(hasEditAccess => this.hasEditAccess = hasEditAccess);
        this.dataService.currentSecurityRecord.subscribe(currentSecurityRecord=> this.currentSecurityRecord = currentSecurityRecord);


        console.log("host:"+ this.host);
//        console.log("customerLid:"+ this.customerLid);
//        console.log("customerName:"+ this.customerName);
//        console.log("customerRegion:"+ this.customerRegion);
//        console.log("hasEditAccess:" + this.hasEditAccess);
//        console.log("securityRecord:"+ this.currentSecurityRecord);
        if ( null != this.currentSecurityRecord ) {
            if( "X" ==this.currentSecurityRecord.lvl1Perm ||
                "X" ==this.currentSecurityRecord.lvl5Perm ||
                "X" ==this.currentSecurityRecord.lvl7Perm ||
                "X" ==this.currentSecurityRecord.lvl8Perm )
                this.userPermUpd=true;
            else
                this.userPermUpd=false;
        }
        console.log("userPermUpd:"+ this.userPermUpd);
    }
    //This will initialize when page changed or first load
    initLineItem(): FormGroup {
        return this.formBuilder.group({
            billBackFlag: [false]
        });
    }

    initLineSaItem(): FormGroup {
        return this.formBuilder.group({


            ss_Region: [0],
            ssSaleNo: [''],
            ss_AgencyCl: [''],
            ss_Tag: [''],
            ssZone: [''],
            ssLotNo: [0],

            ssRptIdLine: [''],
            ssPropLocCode: [''],
            ssStatus: [''],
            ssBillBack: [''],
            ssBbManVal: [0],
            ssBbELossSrc: [''],
            ssBbManValDsc: [''],
            ssBbOther: [0],
            ssBbOtherDesc: [''],

            vhRegion: [0],
            vhAgencyCl: [''],
            vhTag: [''],
            vhVin17: [''],
            vhSoldProceeds: [0],
            vhFairMktVal: [0],
            vhBlkbookLoad: [''],
            //            vsrRecords: this.formBuilder.array([
            //                                    this.initLineItem(),
            //                                     ]),
            //transient variables
            vsrItemIds: [''],
            vsrBillBackFlag: [false],
            otherDescTowing: [false],
            otherDescTransportation: [false],
            otherDescEarlySelling: [false],
            otherDescExtCleaning: [false],
            otherDescBioHazard: [false],
            otherDescExtDecalRemoval: [false],
            billBackFlag: [false],
            vhBlkbookVal: [0],
            newPartsCost: [0],
            newLaborCost: [0],
            newRepairClassKey: [''],
            ssToUpdate: [false]




        });
    }


    // end data service
    errorMessage: [''];
    message = "Select Region";
    regions: Region[];


    checkObject() {
        if (null == this.saleAieRecords)
            return false;
        else
            return true;
    }

    //this startFromTag method will skip aie records before given Tag from the list received for the Region and SaleNo
    startFromTag(tag, list) {

        if (typeof tag === "undefined" || tag == "")
            tag = " ";

        if (null == list)
            return [];

        if (null != list && list.length == 0)
            return [];

        let x = 0;
        let y = 0;
        let found: boolean;
        found = false;
        let smList = [];

        if (null == list)
            return smList;

        for (let z = 0; z < list.length; z++) {
            let agencyTag = list[z].ss_Agency_Cl + list[z].ss_Tag;
            //  console.log("loop agencyTag:"+ agencyTag);
            if (agencyTag == tag) // List starts from the tag passed this method, it drops all records before the tag
                found = true;

            if (found) {
                if (list[z]) smList.push(list[z]);
                x++;
            }
        }
        return smList;
    } //end startFromTag()

    //Get the region records from the database and lists at the dropdown
    getAllRegionRecords() {
   //     console.log("regions:regionComponent.ts");
        this.saleAieService.getRegions()
            .subscribe(
            regions => {
                this.regions = regions;
                this.region = this.customerRegion.toString();
            },
            error => {
                this.errorMessage = <any>error;
                this.saleAieForm.patchValue({ message: this.errorMessage });
            });
        //console.log("regions: you are at getAllRegionRecords()");
    }


    saleNos: string[];
    getSaleRecords(modalShow) {
        if (modalShow == "Y")
            this.loadingBarComponent.loadingModal.show();
        //Initialize page when user changes region
        this.saleAieRecords=null;
        this.totalItems = 0;
        this.saleAiePages = null;
        this.totalPages = 0;
        this.currentPage = 1;
        this.haveNoPage = true;
        //end initialize page
        this.saleAieService.getSaleNumbers(this.region)
            .subscribe(
            saleNos => {
                this.saleNos = saleNos;
                this.message = saleNos.length + " sale records found, Select Sale number";
                this.loadingBarComponent.loadingModal.hide();
            },
            error => {
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                this.saleAieForm.patchValue({ message: this.errorMessage });
            });
    };
    // Get SAS-SALE, VEHICLE and VEH-SA-REPAIR records from server


    saleAieRecordsSave: SaleAieRecords[];

    getSasySaleRecords() {
        this.loadingBarComponent.loadingModal.show();
        //console.log("getSasySaleRecords () this.saleNo:"+ this.saleNo);
        this.agencyCl = ""; this.tag = "";
        this.saleAieService.getSSVehVsrRecs(this.saleNo)
            .subscribe(
            saleAieRecords => {
                this.saleAieRecords = saleAieRecords;
                if (null != this.saleAieRecords)
                    this.saleAieRecords = this.setScreenFlags(this.saleAieRecords);
                this.saleAieRecordsSave = saleAieRecords;
                //console.log("saleAieRecords:"+ saleAieRecords);
                this.loadingBarComponent.loadingModal.hide();
                this.totalItems = this.saleAieRecords.length;
                this.saleAiePages = this.commonService.breakArray(this.itemsPerPage, this.saleAieRecords);
                this.totalPages = this.saleAiePages.length;
                this.currentPage = 1;
                this.changePage(this.currentPage);
                this.haveNoPage = false;
                // document.getElementById('billBackFlag').disabled =true;
             },
            error => {
                console.log("I am at getSasySaleRecords() error");
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                this.saleAieForm.patchValue({ message: this.errorMessage });
            });

    };

    getSSforSale() {
        this.loadingBarComponent.loadingModal.show();
        //console.log("getSasySaleRecords () this.saleNo:"+ this.saleNo);
        this.agencyCl = ""; this.tag = "";
        this.saleAieService.getSSVehVsrRecs(this.saleNo)
            .subscribe(
            saleAieRecords => {
                this.saleAieRecords = saleAieRecords;
                if (null == this.saleAieRecords) {
                    this.loadingBarComponent.loadingModal.hide();
                    this.region="0";
                    this.saleNo="";
                    this.message="Tag not found";
                }
                else {
                    this.loadingBarComponent.loadingModal.hide();
                    let startTagList;
                    let agencyTag = "G" + this.agencyCl.toUpperCase() + this.tag.toUpperCase();
                    startTagList = this.startFromTag(agencyTag, this.saleAieRecords);
                    this.saleAieRecords = startTagList;
                    this.saleAieRecords = this.setScreenFlags(this.saleAieRecords);
                    this.totalItems = this.saleAieRecords.length;
                    this.saleAiePages = this.commonService.breakArray(this.itemsPerPage, this.saleAieRecords);
                    this.totalPages = this.saleAiePages.length;
                    this.currentPage = 1;
                    this.changePage(this.currentPage);
                    this.haveNoPage = false;
                }
             },
            error => {
                console.log("I am at getSSforSale() error");
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                this.saleAieForm.patchValue({ message: this.errorMessage });
            });

    };
    // setScreenFlags sets all database values into screen values, e.g. Y to true, etc
    setScreenFlags(saleAieRecords) {
        for (let saleAieRecord of saleAieRecords) {

            saleAieRecord.blackBookFlag = false;
            if (saleAieRecord.ssBillBack > " ") {
                saleAieRecord.billBackFlag = true;
            }
            if (saleAieRecord.vhBlkbookLoad == "X") {
                saleAieRecord.blackBookFlag = true;
            }
            if (saleAieRecord.ssBbELossSrc == "" || saleAieRecord.ssBbELossSrc == " ")
                saleAieRecord.ssBbELossSrc = "F"; // set Default to F (Fair market value)
            saleAieRecord.actCostTotal = 0;
            saleAieRecord.estCostTotal = 0;
            let actCostTotal = 0;
            let estCostTotal = 0;

            let allFieldsDisable = false;

            if (saleAieRecord.ssBillBack == "B" ||  // Billed back
                saleAieRecord.ssBillBack == "F" ||  // Failed
                saleAieRecord.ssBillBack == "R")     // Recommended
               // saleAieRecord.ssBillBack == "S") // Selected
                // saleAieRecord.ssBillBack == "P") // pending cycle
                allFieldsDisable = true;
            if (!this.userPermUpd)
                allFieldsDisable=true;
            saleAieRecord.allFieldsDisable = allFieldsDisable;
            //console.log("saleAieRecord.allFieldsEnable:" + saleAieRecord.allFieldsDisable)
            //related vsr record
            if (null != saleAieRecord.vsrRecords) {
                for (let vsrRecord of saleAieRecord.vsrRecords) {
                    if (vsrRecord.billBack == "Y")
                        vsrRecord.billBackFlag = true;
                    vsrRecord.estimateCost = +(vsrRecord.partsCost + vsrRecord.laborCost);
                    switch (vsrRecord.repClassKey) {
                        case 'A': vsrRecord.repClassKey = "Body"; break;
                        case 'G': vsrRecord.repClassKey = "Glass"; break;
                        case 'M': vsrRecord.repClassKey = "Mechanical"; break;
                        case 'O': vsrRecord.repClassKey = "Miscellaneous"; break;
                        default: vsrRecord.repClassKey = "Invalid"; break;
                    }
                    if (vsrRecord.billBack == "Y") {
                        if (vsrRecord.estManual == "" || vsrRecord.estManual == " " ||
                            vsrRecord.estManual == "A") { // || vsrRecord.estManual == "E"
                            actCostTotal += (vsrRecord.laborCost + vsrRecord.partsCost);
                        }
                        else {
                            estCostTotal += (vsrRecord.laborCost + vsrRecord.partsCost);
                        }
                    }
                    if (vsrRecord.estManual == "E" || vsrRecord.estManual == " ") // Automatic billback (not allowed to delete these est repairs)
                        vsrRecord.deleteButtonDisable = true;
                    if ((!this.userPermUpd) || (allFieldsDisable)) {
                        vsrRecord.deleteButtonDisable = true;
                        vsrRecord.billBackCheckBoxDisable = true;
                    }
                }// for
            } //end != null
            saleAieRecord.actCostTotal = actCostTotal;
            saleAieRecord.estCostTotal = estCostTotal;
            saleAieRecord.estAllTotal = +(estCostTotal + saleAieRecord.ssBbOther);
            if (saleAieRecord.ssBbELossSrc == "F") {
                saleAieRecord.estAllTotal = +(estCostTotal + saleAieRecord.ssBbOther);
                saleAieRecord.estLossTotal = +(saleAieRecord.vhFairMktVal - saleAieRecord.vhSoldProceeds)
                if (saleAieRecord.estLossTotal<0)
                    saleAieRecord.estLossTotal=0;
            }
            else
            if (saleAieRecord.ssBbELossSrc == "P")  {
                saleAieRecord.estAllTotal = +saleAieRecord.ssBbOther;
                saleAieRecord.estLossTotal = 0;
            }
            else
            if (saleAieRecord.ssBbELossSrc == "M") {
                saleAieRecord.estAllTotal = +(saleAieRecord.ssBbOther + saleAieRecord.ssBbManVal);
                saleAieRecord.estLossTotal = +saleAieRecord.ssBbManVal;
            }

            if (null == saleAieRecord.estLossTotal)
            saleAieRecord.estLossTotal=0;
        }
        return saleAieRecords;

    }  //end setScreenFlags()


    // when dropdown region selected, this will trigger to load list of sale # for the selected region in dropdown
    changeRegion(newRegion, loadingModal) {

        //console.log("get sale # on region change sale-Aie.Component.ts:" + newRegion + " This region:" + this.region);
        this.region = newRegion;
        this.getSaleRecords("Y");
    }
    //when dropdown saleNo selected, this will trigger to loads vehicles for the selected saleNo
    changeSaleNo(newSaleNo) {
       // console.log("get sasySale # on saleNo change sale-Aie.Component.ts:" + newSaleNo);
        this.saleNo = newSaleNo;
        this.currentPage = 0;
        this.agencyCl = "",
            this.tag = "";
        this.getSasySaleRecords();
    }

    //Bill back popup modal
    modalBillBack(billBack, loadAiedamodal) {
      //  console.log("get modelBillBack() @ Component.ts: billBack - " + billBack + " loadAiedamodal:" + loadAiedamodal);
        loadAiedamodal.show();
    }

    aieViewEstModalShow: boolean = false;

    modalViewEst(aieViewEstModal) {
        console.log("modalViewEst - view Est:" + aieViewEstModal);

    }
    // this saveFieldsSet is used to save fields values before throwing to screen, so we can compare the screen values and previous values and update database only those udpated
    saveFieldSet() {
        this.saveFieldSaUpds = [];
        if (null != this.saleAiePage) {
            for (let i = 0; i < this.saleAiePage.length; i++) {
                let saveFieldVsrUpds: SaveFieldVsrUpd[] = [];
                let saveFieldSaUpd = new SaveFieldSaUpd(0, '', '', '', 0, 0, '', '', '', '', 0, '', '', 0, '', '', 0, '', '', '', 0, 0, '', saveFieldVsrUpds, this.stringArray, false, false, false, false, false, false, false, false, 0, false, 0, 0, '', '', false, 0, 0, 0, 0, false);

                saveFieldSaUpd.ss_Region = this.saleAiePage[i].ss_Region;
                saveFieldSaUpd.ssSaleNo = this.saleAiePage[i].ssSaleNo;
                saveFieldSaUpd.ss_Agency_Cl = this.saleAiePage[i].ss_Agency_Cl;
                saveFieldSaUpd.ss_Tag = this.saleAiePage[i].ss_Tag;
                saveFieldSaUpd.billBackFlag = this.saleAiePage[i].billBackFlag;

                saveFieldSaUpd.ssBbOther = this.saleAiePage[i].ssBbOther;
                saveFieldSaUpd.vsrBillBackFlag = this.saleAiePage[i].vsrBillBackFlag;
                saveFieldSaUpd.ssBbManVal = this.saleAiePage[i].ssBbManVal;
                saveFieldSaUpd.ssBbELossSrc = this.saleAiePage[i].ssBbELossSrc;
                saveFieldSaUpd.ssBbManValDsc = this.saleAiePage[i].ssBbManValDsc;
                saveFieldSaUpd.ssBbOtherDesc = this.saleAiePage[i].ssBbOtherDesc;

                //console.log("*********", saveFieldSaUpd.ssBbOther + "  " + this.saleAiePage[i].ssBbOther);
                if (this.saleAiePage[i].vsrRecords != null) {
                    for (let j = 0; j < this.saleAiePage[i].vsrRecords.length; j++) {
                        let saveFieldVsrUpd = new SaveFieldVsrUpd('', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', false, false, 0, false, false);
                        saveFieldVsrUpd.billBackFlag = this.saleAiePage[i].vsrRecords[j].billBackFlag;
                        saveFieldVsrUpd.vin = this.saleAiePage[i].vsrRecords[j].vin;
                        saveFieldVsrUpd.vsr_Agency_Cl = this.saleAiePage[i].vsrRecords[j].vsr_Agency_Cl;
                        saveFieldVsrUpd.vsr_Tag = this.saleAiePage[i].vsrRecords[j].vsr_Tag;
                        saveFieldVsrUpd.vsr_Item_Id = this.saleAiePage[i].vsrRecords[j].vsr_Item_Id;
                        saveFieldVsrUpds.push(saveFieldVsrUpd);
                    }
                }
                this.saveFieldSaUpds.push(saveFieldSaUpd);
            }
            //console.log("Final Save field set : ", this.saveFieldSaUpds);
        }
    }
    //Change page by clicking specific page #
    saRows;
    changePage(p: number) {
        //console.log("I am at change page:" + p);
        this.previousPage= this.currentPage;
        this.currentPage = p;
        this.saleAiePage = this.saleAiePages[this.currentPage - 1];
        this.saveFieldSet();
        this.startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;

        this.saleAieForm = this.formBuilder.group({
            saRows: this.formBuilder.array(
                this.saleAiePage.map(x => this.formBuilder.group({
                    ss_Agency_Cl: [x.ss_Agency_Cl],
                    ss_Tag: [x.ss_Tag],
                    vsrBillBackFlag: [x.vsrBillBackFlag],
                    ssBbOther: [x.ssBbOther, [Validators.pattern('^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$')]],
                    billBackFlag: [x.billBackFlag],
                    newPartsCost: [x.newPartsCost],
                    newLaborCost: [x.newLaborCost],
                    newRepairClassKey: [x.newRepairClassKey],
                    newUserDefDsc: [x.newUserDefDsc],
                    ssBbELossSrc: [x.ssBbELossSrc],
                    blackBookFlag: [x.blackBookFlag],
                    ssBbManVal: [x.ssBbManVal],
                    ssBbManValDsc: [x.ssBbManValDsc],
                    ssBbOtherDesc: [x.ssBbOtherDesc],
                    otherDescTowing: [x.otherDescTowing],
                    otherDescTransportation: [x.otherDescTransportation],
                    otherDescEarlySelling: [x.otherDescEarlySelling],
                    otherDescExtCleaning: [x.otherDescExtCleaning],
                    otherDescBioHazard: [x.otherDescBioHazard],
                    otherDescExtDecalRemoval: [x.otherDescExtDecalRemoval],
                    vsrRecords: [x.vsrRecords]
                })
                )
            )
        })

        if (null != this.saleAiePage)
            this.endItem = this.startItem + this.saleAiePage.length - 1;
        //  console.log("Before change page saleAiePage:"+ JSON.stringify(this.saleAiePage));
        //console.log("change page saleAiePage:"+ JSON.stringify(this.saleAiePage));
    }

    //handle pagination change
    pageChanged(e,confirmalertmodal) {
        this.checkForChanges();
        if (this.sasySaleUpdateCount>0){
           confirmalertmodal.show();
           return false;
        }
        else {
            this.changePage(e.page);
            this.initViewThis();
        }
    }

    //delete VSR record
    deleteVsr(vsrDelete) {
        this.loadingBarComponent.loadingModal.show();
        //console.log("sale-aie.component deleteVsr() saleNo:" + vsrDelete.vsr_Sale + " agyCl:" + vsrDelete.vsr_Agency_Cl + " tag:" + vsrDelete.vsr_Tag + "itemId:" + vsrDelete.vsr_Item_Id);
        this.saleAieService.setSaleAieDeleteVsr(vsrDelete)
            .subscribe(
            result => {
                let message = "Successfully updated: " + result;
                this.reloadPageAfterUpdate();
                this.message = "Selected vehicle sale repair record deleted successfully";
                this.loadingBarComponent.loadingModal.hide();
            },
            error => {
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                console.log(this.errorMessage);
            });

    }
    // add VSR record
    curVsrs: VehSaRepairs[];
    keyIndex: number = 0;

    createVsr(saleAieCur, i) {
        console.log("sale-aie.component createEst() region :" + saleAieCur.ss_Region +
            " agyCl:" + saleAieCur.ss_Agency_Cl + " tag:" + saleAieCur.ss_Tag
            + " saleno:" + saleAieCur.ssSaleNo + "vin:" + saleAieCur.vhVin17);
        // This routine gets the next letter to create VSR record.
        this.itemIdAlphaList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        let itemIds: string[];
        let newItemId;
        let found;
        itemIds = saleAieCur.vsrItemIds;
        if (null != itemIds) {
            for (let alpha of this.itemIdAlphaList) {
                found = false;
                for (let item of itemIds) {
                    if (alpha == item)
                        found = true;
                }
                if (!found) {
                    newItemId = alpha;
                    break;
                }
            }
        }
        else {
            newItemId = "A";
        }

        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;

        //console.log("repairClassKey:" + this.repairClassKey);
        this.newVsr.vsr_Agency_Cl = saleAieCur.ss_Agency_Cl;
        this.newVsr.vsr_Tag = saleAieCur.ss_Tag;
        this.newVsr.vin = saleAieCur.vhVin17;
        this.newVsr.vsr_Item_Id = newItemId;
        this.newVsr.vsr_Sale = saleAieCur.ssSaleNo;
        //console.log("newVsr.newUserDefDsc:" + group.controls['newUserDefDsc'].value);
        this.newVsr.userDefDsc = group.controls['newUserDefDsc'].value;
        this.newVsr.rprRplCode = " ";
        this.newVsr.partsQty = 0;
        this.newVsr.partsCost = group.controls['newPartsCost'].value.toString().replace(",","");
        this.newVsr.laborCost = group.controls['newLaborCost'].value.toString().replace(",","");
        this.newVsr.rprRplCode = " ";
        this.newVsr.billBack = "Y";
        this.newVsr.estManual = "M";
        this.newVsr.repClassKey = group.controls['newRepairClassKey'].value

        this.newVsr.damageCode = "";
        //console.log("this.newVsr:" + this.newVsr);
        this.saleAieService.setSaleAieCreateVsr(this.newVsr)
            .subscribe(
            result => {
                let message = "Successfully updated: " + result;
                this.reloadPageAfterUpdate();
                this.message = "Vehicle Sale Repair record Successfully Added";
                group.controls['newPartsCost'].setValue(0);
                group.controls['newLaborCost'].setValue(0);
            },
            error => {
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                console.log(this.errorMessage);
            });

    }
    // reloads the page after update happened
    reloadPageAfterUpdate() {

       // console.log("reloadPageAfterUpdate () this.saleNo:" + this.saleNo + " current page:" + this.currentPage);
        this.saleAieService.getSSVehVsrRecs(this.saleNo)
            .subscribe(
            saleAieRecords => {
                this.saleAieRecords = saleAieRecords;
                this.saleAieRecords = this.setScreenFlags(this.saleAieRecords);
                this.saleAieRecordsSave = saleAieRecords;
                this.loadingBarComponent.loadingModal.hide();
                this.totalItems = this.saleAieRecords.length;
                this.saleAiePages = this.commonService.breakArray(this.itemsPerPage, this.saleAieRecords);
                this.totalPages = this.saleAiePages.length;
                //console.log("reloadPageAfterUpdate before change page");
                this.changePage(this.currentPage); //set to the page where user is
                this.haveNoPage = false;
            },
            error => {
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                this.saleAieForm.patchValue({ message: this.errorMessage });
            });
    }


    //show/hide inline

    initViewThis() {
        for (var x = 0; x < this.itemsPerPage; x++) {
            this.viewThis[x] = false;
        }
    }
    toggleView(i: number) {
        this.viewThis[i] = !this.viewThis[i];
        for (var x = 0; x < this.itemsPerPage; x++) {
            if (x != i)
                this.viewThis[x] = false;
        }
    }

    editTag() {
        //        if (saleAiePages = 0)
        //          break;
//        console.log("i am at checkSaleOnly:" + this.checkSaleOnly);
        this.agencyCl.toUpperCase();
        this.tag.toUpperCase();

        let editOk: boolean = true;

        if (this.agencyCl == "" || this.agencyCl == " " || this.agencyCl == "  ") {
            this.message = "Enter two digit Agency class empty";
            alert(this.message);
            document.getElementById('idAgencyCl').focus();
            editOk = false;
            return;
        }

        if (this.agencyCl > " " && this.agencyCl.length != 2) {
            this.message = "Enter two digit Agency class";
            alert(this.message);
            document.getElementById('idAgencyCl').focus();
            editOk = false;
            return;
        }
        if (this.agencyCl > " " && this.tag.length < 5) {
            this.message = "Enter five digit vehicle tag";
            alert(this.message);
            document.getElementById('idTag').focus();
            editOk = false;
            return;
        }

        if (editOk)
            if (this.checkSaleOnly)
                this.showFromSelectedTag();
            else
                this.vehVsrRecsForTag();
      //  console.log("this is end of editTag()");
    } //end of editTag()

    // vehVsrRecsForTag () will get a sale number for the given tag, then submit sale number to get the list of tags, then start from the given tag to list at the screen
    vehVsrRecsForTag() {
  //      console.log("getSSVehVsrRecsForTag: Tag:" + this.agencyCl.toUpperCase() + this.tag.toUpperCase());
        this.saleAieService.getSSVehVsrRecsForTag("G" + this.agencyCl.toUpperCase(), this.tag.toUpperCase())
            .subscribe(
            saleAieRecords => {
                this.saleAieRecords = saleAieRecords;
                if (null != this.saleAieRecords && this.saleAieRecords.length > 0) {
                    this.region = this.saleAieRecords[0].ss_Region.toString();
                    this.saleNo = this.saleAieRecords[0].ssSaleNo;
                    let agencyClSave = this.agencyCl;
                    let tagSave = this.tag;
                    this.currentPage = 0;
                    this.getSaleRecords("N");
                    this.getSSforSale();
                    this.agencyCl = agencyClSave;
                    this.tag = tagSave;
                }
                else {
                    this.message = "No sale AIE records found for the given tag :" + "G" + this.agencyCl.toUpperCase() + "-"+ this.tag.toUpperCase();
                    alert(this.message);
                    document.getElementById('idAgencyCl').focus();
                }
            },
            error => {
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                this.saleAieForm.patchValue({ message: this.errorMessage });
            });


    }
    showFromSelectedTag() {
        //this.loadingBarComponent.loadingModal.show();

        if (null != this.saleAieRecordsSave && this.saleAieRecordsSave.length>0) {
            this.saleAieRecords = this.saleAieRecordsSave;
            let startTagList;
            let agencyTag = "G" + this.agencyCl.toUpperCase() + this.tag.toUpperCase();
            startTagList = this.startFromTag(agencyTag, this.saleAieRecords);
            this.saleAieRecords = startTagList;
            this.saleAieRecords = this.setScreenFlags(this.saleAieRecords);
            this.totalItems = this.saleAieRecords.length;
            this.saleAiePages = this.commonService.breakArray(this.itemsPerPage, this.saleAieRecords);
            this.totalPages = this.saleAiePages.length;
            this.currentPage = 1;
            this.changePage(this.currentPage);
            this.haveNoPage = false;
        }
        else {
            this.message = "Select the sale # from dropdown then search the tag :" + "G" + this.agencyCl.toUpperCase() + "-"+ this.tag.toUpperCase();
            alert(this.message);
            document.getElementById('idAgencyCl').focus();
        }

        // this.loadingBarComponent.loadingModal.hide();
    }

    //this method triggers when user clicks OK button, that is refreshes all records from database and takes the user to the selected page

    refreshAndSetPage(selectedPage) {
        this.currentPage=selectedPage;
        this.reloadPageAfterUpdate()
        this.message="Changes dropped and navigated to the selected page";
    } //clearAneload()


    checkBillBackFlag(i, j) {
       // console.log("i:" + i + " j:" + j);
       // console.log(this.saleAiePage[i].vsrRecords[j].billBackFlag);
        this.computeCosts(i);
    }
    // computeCosts will compute Actual Cost, Estmate Cost, Est Loss and Total based on Other Cost and Include bill back options of the repairs
    computeCosts(i) {
        let vsrBillBackChecked: boolean = false;
        let actCostTotal = 0;
        let estCostTotal = 0;
        if (null != this.saleAiePage[i].vsrRecords) {
            for (let k = 0; k < this.saleAiePage[i].vsrRecords.length; k++) {
                if (this.saleAiePage[i].vsrRecords[k].billBackFlag) {
                    vsrBillBackChecked = true;
                }
                if (this.saleAiePage[i].vsrRecords[k].billBackFlag) {
                    if (this.saleAiePage[i].vsrRecords[k].estManual == "" ||
                        this.saleAiePage[i].vsrRecords[k].estManual == " " ||
                        this.saleAiePage[i].vsrRecords[k].estManual == "A") { // || vsrRecord.estManual == "E"
                        actCostTotal += (this.saleAiePage[i].vsrRecords[k].laborCost +
                            this.saleAiePage[i].vsrRecords[k].partsCost);
                    }
                    else {
                        estCostTotal += (this.saleAiePage[i].vsrRecords[k].laborCost +
                            this.saleAiePage[i].vsrRecords[k].partsCost);
                    }
                }
            }
        }
        this.saleAiePage[i].actCostTotal = actCostTotal;
        this.saleAiePage[i].estCostTotal = estCostTotal;
        this.saleAiePage[i].estAllTotal = estCostTotal + this.saleAiePage[i].ssBbOther;
        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;
        let bbOtherVal = 0;

        if (null == group.controls['ssBbOther'].value || "" == group.controls['ssBbOther'].value)
            bbOtherVal=0;
        else
        if (null != group.controls['ssBbOther'].value)
           bbOtherVal = parseFloat(group.controls['ssBbOther'].value.toString().replace(",",""));

        let bbELossSrcVal = group.controls['ssBbELossSrc'].value;

        let bbManVal = 0;
        if (null == group.controls['ssBbManVal'].value || "" == group.controls['ssBbManVal'].value)
            bbManVal=0;
        else
        if(null != group.controls['ssBbManVal'].value)
           bbManVal = parseFloat(group.controls['ssBbManVal'].value.toString().replace(",",""));

        this.saleAiePage[i].estAllTotal = +(estCostTotal + bbOtherVal);

        if (bbELossSrcVal == "F") {
            this.saleAiePage[i].estAllTotal = +(estCostTotal + (+bbOtherVal));
            this.saleAiePage[i].estLossTotal = +(this.saleAiePage[i].vhFairMktVal - this.saleAiePage[i].vhSoldProceeds)
            if (this.saleAiePage[i].estLossTotal<0)
                this.saleAiePage[i].estLossTotal=0;
        }
        else
        if (bbELossSrcVal == "P") {
            this.saleAiePage[i].estAllTotal = +bbOtherVal;
            this.saleAiePage[i].estLossTotal=0;
        }
        else
        if (bbELossSrcVal == "M") {
            this.saleAiePage[i].estAllTotal = +bbOtherVal + bbManVal;
            this.saleAiePage[i].estLossTotal= +bbManVal;
        }

        if (null == this.saleAiePage[i].estAllTotal)
            this.saleAiePage[i].estAllTotal=0.00;

        if (vsrBillBackChecked) {
            this.saleAiePage[i].vsrBillBackFlag = true;
            //            console.log("Value of vsrBillBackFlag row " + i + " : " + group.controls['vsrBillBackFlag'].value);
        } else {
            this.saleAiePage[i].vsrBillBackFlag = false;
            //            group.controls['vsrBillBackFlag'].value = false;
            //           console.log("Value of vsrBillBackFlag row " + i + " : " + group.controls['vsr.value);

        }

    }


    createVsrEdit(saleAieCur, i) {
        //alert("createVsrEdit() i:"+ i);

        this.message="";
        let foundVehicle: boolean = true;
        if (null === saleAieCur.vhVin17) {
            this.message = "Vehicle Record not found for :" + saleAieCur.ss_Agency_Cl + "-" + saleAieCur.ss_Tag;
            alert(this.message);
            foundVehicle = false;
        }
        //console.log("passed vehicle vin edit vin: " + saleAieCur.vhVin17);
        if (foundVehicle) {

            let array = this.saleAieForm.get('saRows') as FormArray;
            let group = array.at(i) as FormGroup;

            if (group.controls['newPartsCost'].value.toString().replace(",","") == 0 && group.controls['newLaborCost'].value.toString().replace(",","") == 0) {
                this.message = "Requires Parts or Labor value for the Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                alert(this.message);
                document.getElementsByName('newPartsCost')[0]["style"]["background-color"] = "lightcoral"; //index will only one (so use document.getElementsByName('newPartsCost')[0]["style"]["background-color"]) though row is other than first row)
                document.getElementById('newPartsCost').focus();
                return false;
            }
            else {
                document.getElementsByName('newPartsCost')[0]["style"]["background-color"] = "#fff";
            }

            let numVal = group.controls['newPartsCost'].value.toString().replace(",","");
            if (numVal== null || numVal ==" ")
                numVal=0;

//            let regex = /^[+-]?[0-9]{1,3}(?:,?[0-9]{0,3})*(?:\.[0-9]{0,2})?$/; //number with 2 decimal places or value zero
            if (!isNaN(numVal)) {
                document.getElementsByName('newPartsCost')[0]["style"]["background-color"] = "#fff";
            }
            else {
                this.message = "Parts Cost value is incorrect:" + numVal + " for the Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                alert(this.message);
                document.getElementById('newPartsCost').focus();
                document.getElementsByName('newPartsCost')[0]["style"]["background-color"] = "lightcoral";
                return false;
            }
            numVal = group.controls['newLaborCost'].value.toString().replace(",","");
            if (numVal=="" || numVal ==" ")
            numVal=0;
           // regex = /^[+-]?[0-9]{1,3}(?:,?[0-9]{0,3})*(?:\.[0-9]{0,2})?$/; //number with 2 decimal places or value zero
           // if (regex.test(numVal)) {
            if (!isNaN(numVal)) {
                document.getElementsByName('newLaborCost')[0]["style"]["background-color"] = "#fff";
            }
            else {
                this.message = "Labor Cost value is incorrect:" + numVal + " for Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                alert(this.message);
                document.getElementById('newLaborCost').focus();
                document.getElementsByName('newLaborCost')[0]["style"]["background-color"] = "lightcoral";
                return false;
            }
            let val = group.controls['newRepairClassKey'].value;
            if (val == null || val == "") {
                this.message = "Requires Type selected for the Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                alert(this.message);
                 document.getElementById('newRepairClassKey').focus();
                document.getElementsByName('newRepairClassKey')[0]["style"]["background-color"] = "lightcoral";
                return false;
            }
            else {
                document.getElementsByName('newRepairClassKey')[0]["style"]["background-color"] = "#fff";
            }

            let userDefDsc = group.controls['newUserDefDsc'].value;
            if (userDefDsc == null || userDefDsc == " " || userDefDsc.length == 0) {
                this.message = "Requires Description for the Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                alert(this.message);
                document.getElementById('newUserDefDsc').focus();
                document.getElementsByName('newUserDefDsc')[0]["style"]["background-color"] = "lightcoral";
                return false;
            }
            else
            if ((userDefDsc.toLowerCase().indexOf('"') > -1) ||
                (userDefDsc.toLowerCase().indexOf('<') > -1) ||
                (userDefDsc.toLowerCase().indexOf('/>') > -1) ||
                (userDefDsc.toLowerCase().indexOf('<script') > -1)) {
                this.message='Repair Description contains invalid characters: Quote ("), begin tag (<), end tag (/>) or <script';
                alert(this.message);
                document.getElementById('newUserDefDsc').focus();
                document.getElementsByName('newUserDefDsc')[0]["style"]["background-color"] = "lightcoral";
                return false
            }
            else {
                document.getElementsByName('newUserDefDsc')[0]["style"]["background-color"] = "#fff";
            }
        }
        this.createVsr(saleAieCur, i);
    }
    checkVsrBlackBook(i, element) {
       // alert("row:" + i + " element:" + element);
        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;
      //  console.log("blackBookFlag:" + document.getElementsByName('blackBookFlag')["value"]);
//        console.log("group.controls['blackBookFlag']:" + group.controls['blackBookFlag'].value);
        group.controls['blackBookFlag'].setValue(true);
    }

    onCheckBillBack(i) {
       // console.log("selected row:" + i);
        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;

    /*    // console.log("Value of saleAieForm for row " + i +" : " + group.controls('sa_billBackFlag').value);
        console.log("Value of saleAieForm for row " + i + " : " + group.controls['billBackFlag'].value);
        console.log("group.controls['ssBbOther']:" + group.controls['ssBbOther'].value.toString().(",",""));
        console.log("group.controls['ssBbManValDsc']:" + group.controls['ssBbManValDsc'].value);
        console.log("group.controls['ssBbOtherDesc']:" + group.controls['ssBbOtherDesc'].value);
        console.log("this.repairClassKey:" + this.repairClassKey);
        */

    }
    checkOtherDesc(i, saleAie, descName) {
        this.message="";
        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;
        let othDesc = group.controls['ssBbOtherDesc'];
        let othDescOpt = group.controls[descName].value;
        let addDropDesc = "";
        switch (descName) {
            case 'otherDescTowing': addDropDesc = this.oDTowing; break;
            case 'otherDescTransportation': addDropDesc = this.oDTransportation; break;
            case 'otherDescEarlySelling': addDropDesc = this.oDEarlySelling; break;
            case 'otherDescExtCleaning': addDropDesc = this.oDExtCleaning; break;
            case 'otherDescBioHazard': addDropDesc = this.oDBioHazard; break;
            case 'otherDescExtDecalRemoval': addDropDesc = this.oDExtDecalRemoval; break;
            default: addDropDesc = ""; break;
        }
        if ((!othDescOpt) && (othDesc.value.length > 99)) {
            this.message = "Description too long";
            alert(this.message);
            document.getElementById('ssBbOtherDesc').focus();
            document.getElementsByName('ssBbOtherDesc')[0]["style"]["background-color"] = "lightcoral";
            return false;
        } else {
            document.getElementsByName('ssBbOtherDesc')[0]["style"]["background-color"] = "#fff";
        }
        if ((othDesc.value.indexOf(addDropDesc) >= 0) && (othDescOpt)) {
            let newDesc = othDesc.value.replace(("  " + addDropDesc), ""); // if any double space before content
            newDesc = newDesc.replace((" " + addDropDesc), ""); // if any space before content
            newDesc = newDesc.replace(addDropDesc, "");
            othDesc.setValue(newDesc.trim());
        }
        else {
            othDesc.setValue(othDesc.value + " " + addDropDesc);
        }
        if ((othDesc.value.trim().length === 0)) {
            othDesc.setValue("");
        }
        this.onChangeSsBbOtherDescUpd(i,saleAie) // to update other Costs description to saleAie.ssBbOtherDesc so you can navigate tags and retains the updated value
    }
    // method to handle value change for ManualValue(ssBbManVal) in UI
    onChangeSsBbManValUpd(i, saleAie) {
        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;
        let numVal = group.controls['ssBbManVal'].value;
        if (numVal=="" || numVal ==" ")
            numVal=0;
        //let regex = /^[+-]?[0-9]{1,3}(?:,?[0-9]{0,3})*(?:\.[0-9]{0,2})?$/; //number with 2 decimal places or value zero
        //if (regex.test(numVal)) {
        if (!isNaN(numVal)) {
            saleAie.ssBbManVal = numVal;
        }
    }
    // method to handle value change for Manual Value Description(ssBbManValDsc) in UI
    onChangeSsBbManValDscUpd(i, saleAie) {
        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;
        saleAie.ssBbManValDsc = group.controls['ssBbManValDsc'].value;
    }

    // method to handle value change for Other Costs Description (ssBbOtherDesc) in UI
    onChangeSsBbOtherDescUpd(i, saleAie) {
        let array = this.saleAieForm.get('saRows') as FormArray;
        let group = array.at(i) as FormGroup;
        saleAie.ssBbOtherDesc = group.controls['ssBbOtherDesc'].value;
    }

    editBillBackFields(aieBillBackModal) {
        this.message="";
        for (let i = 0; i < this.saleAiePage.length; i++) {
            let array = this.saleAieForm.get('saRows') as FormArray;
            let group = array.at(i) as FormGroup;
            let bbOther;
            if (null == group.controls['ssBbOther'].value)
               bbOther=0;
            else
               bbOther= group.controls['ssBbOther'].value.toString().replace(",","");

            if (bbOther==null || bbOther ==" ")
            bbOther=0;

            if (!isNaN(bbOther)) {
                document.getElementsByName('ssBbOther')[i]["style"]["background-color"] = "#fff";
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "#eee";
            }
            else {
                this.toggleView(i);
                this.viewThis[i]=true;
                this.message="Other cost value is incorrect: " + bbOther;
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightcoral";
                alert(this.message);
                //document.getElementById('ssBbOther')[i].focus();
                document.getElementsByName('ssBbOther')[i]["style"]["background-color"] = "lightcoral";
                return false;
            }

            let bbElossSrcval = group.controls['ssBbELossSrc'].value;

            let rowOpened = document.getElementsByName('ssBbManValDsc').length;// if one of the row is clicked on tag and opened then you get 1 other zero.
            let bbManVal;
            if (null == group.controls['ssBbManVal'].value)
                bbManVal = 0
            else
                bbManVal = group.controls['ssBbManVal'].value.toString().replace(",","");

            let bbManValDsc = group.controls['ssBbManValDsc'].value;

            if ((bbManValDsc.toLowerCase().indexOf('"') > -1) ||
                (bbManValDsc.toLowerCase().indexOf('<') > -1) ||
                (bbManValDsc.toLowerCase().indexOf('/>') > -1) ||
                (bbManValDsc.toLowerCase().indexOf('<script') > -1)) {
                this.toggleView(i);
                this.viewThis[i]=true;
                this.message='Manual Value Description contains invalid characters: Quote ("), begin tag (<), end tag (/>) or <script';
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightcoral";
                alert(this.message);
                if (rowOpened ==1) {
                    document.getElementById('ssBbManValDsc').focus();
                    document.getElementsByName('ssBbManValDsc')[0]["style"]["background-color"] = "lightcoral"; // only one Manual Value field visible, so us [0]
                }
                //document.getElementById('ssBbOther')[i].focus();
                return false;
            }
            else {
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "#eee";
                if (rowOpened ==1)
                  document.getElementsByName('ssBbManValDsc')[0]["style"]["background-color"] = "#fff";
            }

           // alert("group.controls['ssBbManValDsc'].value:" + group.controls['ssBbManValDsc'].value + "for Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value);
            if (bbElossSrcval == "M" && (bbManValDsc.length==0) || bbManValDsc == " " || bbManValDsc == "  ") {
                this.toggleView(i);
                this.viewThis[i]=true;
                this.message = "Manual Value Description required when Manual Value is used to determine bill-back total" +
                        " for Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightcoral";
                alert(this.message);
                if (rowOpened ==1) {
                    document.getElementById('ssBbManValDsc').focus();
                    document.getElementsByName('ssBbManValDsc')[0]["style"]["background-color"] = "lightcoral"; // only one Manual Value field visible, so us [0]
                }
                //document.getElementById('ssBbOther')[i].focus();
                return false;
            }
            else {
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "#eee";
                if (rowOpened ==1)
                    document.getElementsByName('ssBbManValDsc')[0]["style"]["background-color"] = "#fff"; // only one Manual Value field visible, so us [0]
            }
            if (!isNaN(bbManVal)) {
                if (rowOpened ==1) {
                   document.getElementsByName('ssBbManVal')[0]["style"]["background-color"] = "#fff"; // only one Manual Value field visible, so us [0]
                   document.getElementsByName('tagRow')[i]["style"]["background-color"] = "#eee";
                }
            }
            else {
                this.initViewThis();
                this.viewThis[i] = true;
                this.message = "Manual value is incorrect:" + bbManVal + " for Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightcoral";
                alert(this.message);
                if (rowOpened ==1) {
                    document.getElementById('ssBbManVal').focus();
                    document.getElementsByName('ssBbManVal')[0]["style"]["background-color"] = "lightcoral";
                }
               // document.getElementById('ssBbOther')[i].focus();
                return false;
            }
            // Other Cost Description
            let bbOtherDesc = group.controls['ssBbOtherDesc'].value.trim();

            if (bbOther>0 && bbOtherDesc.length == 0) {
                this.toggleView(i);
                this.viewThis[i]=true;
                this.message = "Other Cost Description required when Other Cost Value is used to determine bill-back total" +
                        " for Tag: " + group.controls['ss_Agency_Cl'].value +"-" + group.controls['ss_Tag'].value;
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightcoral";
                alert(this.message);
                if (rowOpened ==1) {
                    document.getElementById('ssBbOtherDesc').focus();
                    document.getElementsByName('ssBbOtherDesc')[0]["style"]["background-color"] = "lightcoral"; // only one Other cost Value field visible, so us [0]
                }
               // document.getElementById('ssBbOther')[i].focus();
                return false;
            }
            else {
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "#eee";
                if (rowOpened ==1)
                    document.getElementsByName('ssBbOtherDesc')[0]["style"]["background-color"] = "#fff"; // only one Other cost Value field visible, so us [0]
            }

            if ((bbOtherDesc.toLowerCase().indexOf('"') > -1) ||
                (bbOtherDesc.toLowerCase().indexOf('<') > -1) ||
                (bbOtherDesc.toLowerCase().indexOf('/>') > -1) ||
                (bbOtherDesc.toLowerCase().indexOf('<script') > -1)) {
                this.toggleView(i);
                this.viewThis[i]=true;
                this.message='Other Costs Description contains invalid characters: Quote ("), begin tag (<), end tag (/>) or <script';
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightcoral";
                alert(this.message);
                document.getElementById('ssBbOther')[i].focus();
                if (rowOpened ==1)
                document.getElementsByName('ssBbOtherDesc')[0]["style"]["background-color"] = "lightcoral"; // only one Manual Value field visible, so us [0]
                return false;
            }
            else {
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "#eee";
                if (rowOpened ==1)
                    document.getElementsByName('ssBbOtherDesc')[0]["style"]["background-color"] = "#fff";
            }
        } // for loop
        this.updateSSVsrRecords(aieBillBackModal);
    }
    updateSSVsrRecords(aieBillBackModal) {
        this.message="";
        // method to check amended fields in the UI and mark the record as updated = Y
        if (!this.userPermUpd) {
            this.message = "You are not allowed to update Sale AIE records";
            alert(this.message);
            return false;
        }
        let saleAieScreens: SaleAieRecords[] = [];
        let saleAieScreen;

        let vsrScreen;
        this.sasySaleUpdateCount = 0;
        for (let i = 0; i < this.saleAiePage.length; i++) {
            let array = this.saleAieForm.get('saRows') as FormArray;
            let group = array.at(i) as FormGroup;
            let vsrScreens: VehSaRepairs[] = [];
            saleAieScreen = new SaleAieRecords(0, '', '', '', 0, 0, '', '', '', '', 0, '', '', 0, '', '', 0, '', '', '', 0, 0, '', vsrScreens, this.stringArray, false, false, false, false, false, false, false, false, 0, false, 0, 0, '', '', false, 0, 0, 0, 0, false); // initializing saleAieScreen from global to local object
           // console.log("row:" + i);
            saleAieScreen.ss_Region = this.saleAiePage[i].ss_Region;
            saleAieScreen.ss_Agency_Cl = group.controls['ss_Agency_Cl'].value;
            saleAieScreen.ss_Tag = group.controls['ss_Tag'].value;
            saleAieScreen.ssSaleNo = this.saleAiePage[i].ssSaleNo;

            saleAieScreen.billBackFlag = group.controls['billBackFlag'].value;
            // alert("saleAieScreen.billBackFlag:"+ saleAieScreen.billBackFlag + " i:" + i);
            if (saleAieScreen.billBackFlag == null)
            saleAieScreen.billBackFlag=false;
            if (saleAieScreen.billBackFlag) {
                saleAieScreen.ssBillBack = "P";
            }
            else {
                saleAieScreen.ssBillBack = " ";
            }
            if (null == group.controls['ssBbOther'].value)
                saleAieScreen.ssBbOther=0
            else
                saleAieScreen.ssBbOther = parseFloat(group.controls['ssBbOther'].value.toString().replace(",","")); // Need to add + to get the value as number otherwise you will get string
            saleAieScreen.vsrBillBackFlag = group.controls['vsrBillBackFlag'].value;

            if (null == group.controls['ssBbManVal'].value)
                saleAieScreen.ssBbOther=0
            else
                saleAieScreen.ssBbManVal = parseFloat(group.controls['ssBbManVal'].value.toString().replace(",",""));
            saleAieScreen.ssBbELossSrc = group.controls['ssBbELossSrc'].value;
            saleAieScreen.ssBbManValDsc = group.controls['ssBbManValDsc'].value;
            saleAieScreen.ssBbOtherDesc = group.controls['ssBbOtherDesc'].value;
            saleAieScreen.ssBbLid = this.customerLid;
            saleAieScreen.ssToUpdate = false;
            let vsrUpdateFound = false;
            if (this.saleAiePage[i].vsrRecords != null) {
                for (let j = 0; j < this.saleAiePage[i].vsrRecords.length; j++) {
                    vsrScreen = new VehSaRepairs('', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', false, false, 0, false, false);
                    vsrScreen.vsr_Agency_Cl = this.saleAiePage[i].vsrRecords[j].vsr_Agency_Cl;
                    vsrScreen.vsr_Tag = this.saleAiePage[i].vsrRecords[j].vsr_Tag;
                    vsrScreen.vin = this.saleAiePage[i].vsrRecords[j].vin;
                    vsrScreen.vsr_Item_Id = this.saleAiePage[i].vsrRecords[j].vsr_Item_Id;
                    vsrScreen.vsr_Sale = this.saleAiePage[i].vsrRecords[j].vsr_Sale;

                    vsrScreen.billBackFlag = this.saleAiePage[i].vsrRecords[j].billBackFlag;

                    vsrScreen.vsrToUpdate = false;

                    if (this.saleAiePage[i].vsrRecords[j].billBackFlag) {
                        vsrScreen.billBack = 'Y';
                    } else {
                        vsrScreen.billBack = 'N';
                    }

                    if (vsrScreen.billBackFlag != this.saveFieldSaUpds[i].vsrRecords[j].billBackFlag) {
                        vsrScreen.vsrToUpdate = true;
                    }
                    if (vsrScreen.vsrToUpdate) {
                        vsrScreens.push(vsrScreen);
                        vsrUpdateFound = true;
                    }
                }
            }
            if ((saleAieScreen.billBackFlag != this.saveFieldSaUpds[i].billBackFlag) ||
                (saleAieScreen.ssBbOther != this.saveFieldSaUpds[i].ssBbOther) ||
                (saleAieScreen.vsrBillBackFlag != this.saveFieldSaUpds[i].vsrBillBackFlag) ||
                (saleAieScreen.ssBbManVal != this.saveFieldSaUpds[i].ssBbManVal) ||
                (saleAieScreen.ssBbELossSrc != this.saveFieldSaUpds[i].ssBbELossSrc) ||
                (saleAieScreen.ssBbManValDsc != this.saveFieldSaUpds[i].ssBbManValDsc) ||
                (saleAieScreen.ssBbOtherDesc != this.saveFieldSaUpds[i].ssBbOtherDesc)) {
                saleAieScreen.ssToUpdate = true;
             //   console.log("update found at row " + i);
            }

            saleAieScreen.vsrRecords = vsrScreens;
            if (saleAieScreen.ssToUpdate || vsrUpdateFound) {
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightcoral";
                saleAieScreens.push(saleAieScreen); // add record to send to server for update
                this.sasySaleUpdateCount++;
            }
            else {
                document.getElementsByName('tagRow')[i]["style"]["background-color"] = "#eee";
            }
        }
     //   console.log("updated records:", saleAieScreens);
        if (this.sasySaleUpdateCount > 0) {
            this.saleAieUpdObjects = saleAieScreens;
            aieBillBackModal.show();
        }
        else {
            this.message = "Nothing changed to update Sale AIE records";
            alert(this.message);
            return false;
        }
    } // end of updateSSVsrRecords()


    sendSaleAieUpdate() {
        //console.log("customerLid:" + this.customerLid + this.customerName);
        this.loadingBarComponent.loadingModal.show();
        this.saleAieService.setSaleAieUpdate(this.saleAieUpdObjects).
            subscribe(
            result => {
                let message = "";
                console.log("Successfully updated: " + result["_body"]);

                if (result["_body"] = "SUCCESS") {//Return value Received from FmsDAO
                    message = "Selected vehicle sale repair record updated successfully";
                    this.reloadPageAfterUpdate();
                    this.highlightUpdatedRows(this.saleAieUpdObjects);
                }
                else
                    message = "Update Failed due to error " + result["_body"];

                this.message = message;
                this.loadingBarComponent.loadingModal.hide();
            },
            error => {
                this.loadingBarComponent.loadingModal.hide();
                this.errorMessage = <any>error;
                console.log(this.errorMessage);
                console.log("Error while updating the fields: " + this.errorMessage);
            });

    }
    //this method changes background color the row to green after the update completed of that row
    highlightUpdatedRows(updatedSaleAies) {
        for (let updatedSaleAie of updatedSaleAies) {
         //   console.log("updatedSaleAie.ss_Agency_Cl:" + updatedSaleAie.ss_Agency_Cl + updatedSaleAie.ss_Tag);
            for (let i = 0; i < this.saleAiePage.length; i++) {
                if (updatedSaleAie.ss_Agency_Cl === this.saleAiePage[i].ss_Agency_Cl &&
                    updatedSaleAie.ss_Tag === this.saleAiePage[i].ss_Tag)
                    document.getElementsByName('tagRow')[i]["style"]["background-color"] = "lightgreen";
            }
        }
    }
    checkForChanges() {
        this.sasySaleUpdateCount=0;

        let saleAieScreens: SaleAieRecords[] = [];
        let saleAieScreen;

        let vsrScreen;
        this.sasySaleUpdateCount = 0;
        for (let i = 0; i < this.saleAiePage.length; i++) {
            let array = this.saleAieForm.get('saRows') as FormArray;
            let group = array.at(i) as FormGroup;
            let vsrScreens: VehSaRepairs[] = [];
            saleAieScreen = new SaleAieRecords(0, '', '', '', 0, 0, '', '', '', '', 0, '', '', 0, '', '', 0, '', '', '', 0, 0, '', vsrScreens, this.stringArray, false, false, false, false, false, false, false, false, 0, false, 0, 0, '', '', false, 0, 0, 0, 0, false); // initializing saleAieScreen from global to local object
            //console.log("row:" + i);

            saleAieScreen.ss_Region = this.saleAiePage[i].ss_Region;
            saleAieScreen.ss_Agency_Cl = group.controls['ss_Agency_Cl'].value;
            saleAieScreen.ss_Tag = group.controls['ss_Tag'].value;
            saleAieScreen.ssSaleNo = this.saleAiePage[i].ssSaleNo;

            saleAieScreen.billBackFlag = group.controls['billBackFlag'].value;
            if (saleAieScreen.billBackFlag == null)
            saleAieScreen.billBackFlag=false;
            if (saleAieScreen.billBackFlag) {
                saleAieScreen.ssBillBack = "P";
            }
            else {
                saleAieScreen.ssBillBack = " ";
            }
            if(null != group.controls['ssBbOther'].value)
                saleAieScreen.ssBbOther = parseFloat(group.controls['ssBbOther'].value.toString().replace(",",""));
            else
                saleAieScreen.ssBbOther=this.saveFieldSaUpds[i].ssBbOther
             // Need to add + to get the value as number otherwise you will get string
            saleAieScreen.vsrBillBackFlag = group.controls['vsrBillBackFlag'].value;
            if(null != group.controls['ssBbManVal'].value)
                saleAieScreen.ssBbManVal = parseFloat(group.controls['ssBbManVal'].value.toString().replace(",",""));
            else
                saleAieScreen.ssBbManVal=this.saveFieldSaUpds[i].ssBbManVal;
            saleAieScreen.ssBbELossSrc = group.controls['ssBbELossSrc'].value;
            saleAieScreen.ssBbManValDsc = group.controls['ssBbManValDsc'].value;
            saleAieScreen.ssBbOtherDesc = group.controls['ssBbOtherDesc'].value;
            saleAieScreen.ssBbLid = this.customerLid;
            saleAieScreen.ssToUpdate = false;
            let vsrUpdateFound = false;
            if (this.saleAiePage[i].vsrRecords != null) {
                for (let j = 0; j < this.saleAiePage[i].vsrRecords.length; j++) {
                    vsrScreen = new VehSaRepairs('', '', '', '', '', '', '', 0, 0, 0, '', '', '', '', false, false, 0, false, false);
                    vsrScreen.vsr_Agency_Cl = this.saleAiePage[i].vsrRecords[j].vsr_Agency_Cl;
                    vsrScreen.vsr_Tag = this.saleAiePage[i].vsrRecords[j].vsr_Tag;
                    vsrScreen.vin = this.saleAiePage[i].vsrRecords[j].vin;
                    vsrScreen.vsr_Item_Id = this.saleAiePage[i].vsrRecords[j].vsr_Item_Id;
                    vsrScreen.vsr_Sale = this.saleAiePage[i].vsrRecords[j].vsr_Sale;

                    vsrScreen.billBackFlag = this.saleAiePage[i].vsrRecords[j].billBackFlag;

                    vsrScreen.vsrToUpdate = false;

                    if (this.saleAiePage[i].vsrRecords[j].billBackFlag) {
                        vsrScreen.billBack = 'Y';
                    } else {
                        vsrScreen.billBack = 'N';
                    }

                    if (vsrScreen.billBackFlag != this.saveFieldSaUpds[i].vsrRecords[j].billBackFlag) {
                        vsrScreen.vsrToUpdate = true;
                    }
                    if (vsrScreen.vsrToUpdate) {
                        vsrScreens.push(vsrScreen);
                        vsrUpdateFound = true;
                    }
                }
            }

            if ((saleAieScreen.billBackFlag != this.saveFieldSaUpds[i].billBackFlag) ||
                (saleAieScreen.ssBbOther != this.saveFieldSaUpds[i].ssBbOther) ||
                (saleAieScreen.vsrBillBackFlag != this.saveFieldSaUpds[i].vsrBillBackFlag) ||
                (saleAieScreen.ssBbManVal != this.saveFieldSaUpds[i].ssBbManVal) ||
                (saleAieScreen.ssBbELossSrc != this.saveFieldSaUpds[i].ssBbELossSrc) ||
                (saleAieScreen.ssBbManValDsc != this.saveFieldSaUpds[i].ssBbManValDsc) ||
                (saleAieScreen.ssBbOtherDesc != this.saveFieldSaUpds[i].ssBbOtherDesc)) {
                saleAieScreen.ssToUpdate = true;
               // console.log("update found at row " + i);
            }

            if (saleAieScreen.ssToUpdate || vsrUpdateFound) {
                this.sasySaleUpdateCount++;
                break;
            }

        }
       // console.log("updated records:", saleAieScreens);

    } // end of checkForChanges()

}
