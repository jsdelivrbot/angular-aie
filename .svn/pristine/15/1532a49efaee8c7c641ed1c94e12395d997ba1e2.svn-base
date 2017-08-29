
import { Component, OnInit, NgModule, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingBarComponent } from '../common-components/loading-bar/loading-bar.component';

import { TagGetCustVehService } from './tag-get-cust-veh.service';
import { customer } from '../common-components/common-structures';
import { vehicle } from '../common-components/common-structures';

@Component({
    selector: 'app-tag-get-cust-veh',
    templateUrl: './tag-get-cust-veh.component.html',
    styleUrls: ['./tag-get-cust-veh.component.css']
})

export class TagGetCustVehComponent implements OnInit {
        
    @ViewChild(LoadingBarComponent) public loadingBarComponent: LoadingBarComponent;
    
    @Output() updateCustAndVehicle = new EventEmitter();
    customer: customer;
    emptyCustomer: customer;
    vehicle: vehicle;
    emptyVehicle: vehicle;
    data;
    tagSearchForm;
    
    constructor(private TagGetCustVehService: TagGetCustVehService) { }
  
    ngOnInit() {
        this.emptyCustomer = new customer("", 0, "", "", "", 0, 0, 0, "", 0, "", "", 0, "", "", "", "", "");
        this.emptyVehicle = new vehicle("", "", "", "", 0, "", "", "", "", 0, 0, 0, 0, 0, "", "", "", "", "", 0, "", 0);
        this.customer = this.emptyCustomer;
        this.vehicle = this.emptyVehicle;
        
        this.tagSearchForm = new FormGroup({
            agencyCl: new FormControl("", Validators.compose([
                Validators.required
                ,Validators.pattern('[0-9]{2}')
            ])),
            tag: new FormControl("", Validators.compose([
                Validators.required
                ,Validators.pattern('[0-9]{4}[A-Za-z]{1}')
            ]))    
        });
        this.tagSearchForm.valueChanges
            .subscribe( form => {
                if (!this.tagSearchForm.valid && 
                    this.tagSearchForm.controls.agencyCl.value.length == 2 && 
                    this.tagSearchForm.controls.tag.value.length == 5) {
                    //this.errorString = "Tag must be in the format G##-####X";
                    alert("Tag must be in the format G##-####X");
                } else {
                    this.errorString = "";
                }
            })
    }
    
    errorMessage: string;
    errorString: string = "";
    
    public clearFields() {
        //console.log(this.tagSearchForm);
        this.tagSearchForm.controls["agencyCl"].setValue("");
        this.tagSearchForm.controls["tag"].setValue("");
        this.customer = this.emptyCustomer;
        this.vehicle = this.emptyVehicle;
        this.errorString = "";
    }

    public findCustVehByTagSubmit(loadingModal, f) {
        this.loadingBarComponent.loadingModal.show();
        let a = f.controls["agencyCl"];
        let t = f.controls["tag"];
        t.setValue(t.value.toUpperCase());
        this.TagGetCustVehService.getCustVeh(f.controls["agencyCl"].value, f.controls["tag"].value)
            .subscribe(
                data => {
                    if (!data.customer) { 
                        //console.log("back from api - Customer is undefined");
                        this.errorString = "Tag not found.";
                        this.data = {};
                        this.customer = this.emptyCustomer;
                        this.vehicle = this.emptyVehicle;
                       } else {
                        //console.log("back from api - Customer is OK");
                        this.errorString = "";
                        this.data = data;
                        this.customer = data.customer;
                        this.vehicle = data.vehicle;
                       }
                       this.loadingBarComponent.loadingModal.hide();
                       this.updateCustAndVehicle.emit(this.data);
                    },
                error =>  {
                    this.errorMessage = <any>error;
                    this.errorString = this.errorMessage.toString();
                    this.loadingBarComponent.loadingModal.hide();
                });
    }
}
