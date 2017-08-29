import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TypeaheadModule } from 'ngx-bootstrap';
import { AieMultipleService } from '../../aie-multiple/aie-multiple.service';
import { LoadingBarComponent } from '../loading-bar/loading-bar.component';

@Component({
  selector: 'cust-select',
  templateUrl: './cust-select.component.html',
  styleUrls: ['./cust-select.component.css']
})
export class CustomerSelectComponent implements OnInit {
   
  @ViewChild(LoadingBarComponent) public loadingBarComponent: LoadingBarComponent;
  @ViewChild('idFMC') idFMC;
  
  regions = ["1","2","3","4","5","6","7","8","9","10","11"];
    
  regionSelect;
  fmcSelect;
    
  constructor(private aieMultipleService: AieMultipleService) { }

  ngOnInit() {
  }
    
    /*
        @Input is an annotation that defines a component property that can
        receive data from another component. In HTML code, you can use 
        "[childInputVariable]="parentVariable" (ex. "[region]="parentRegion") 
        to receive data for that variable.
    
        @Output is an annotation that is declared as and set to be an 
        EventEmitter. This allows you to define customer EventEmitters, much
        like those that are native to Angular (ex. "(click)", "(change)", 
        "(ngModelChange)", etc.) to be used in the parent component for
        event handling. We also can pass data for data binding as well with
        EventEmitter as shown below.
    
        In my case, I chose to get the data from the service directly instead 
        of having the parent component call the service and then sending the 
        data as an input (that is an option though).
    
        One example of a good use of @Input would be for options in the child
        component which enable some logic for different paths for creating the
        component. Such as, taking a path in this component for alternate ordering
        of the drop downs, or displaying completely different drop downs all together.
    
        In this example the parent component is not passing any super useful 
        input to this child component, but this shows you how to define it
        and allows for two way data binding (if both input and output are defined).
    */
    @Output() validChange = new EventEmitter();
    
    @Input() region;
    @Output() regionChange = new EventEmitter();
    
    @Input() fmc;
    @Output() fmcChange = new EventEmitter();
    
    @Input() customer;
    @Output() customerChange = new EventEmitter();
    
    progressVisible: boolean = false;
    
    /*
        These three change functions use EventEmitter.emit to send an event
        (data in this case) to the parent component. This then emits a change
        to our @Output varChange allowing the parent to listen for events that
        occur in the child.
    */
    
    changeRegion(region, loadingModal){
        this.region = region;
        this.regionChange.emit(region);
        this.getFMCs(loadingModal);
    }
    
    changeFMC(fmc, loadingModal){
        this.fmcChange.emit(fmc);
        this.fmc = fmc; 
        this.getCustomers(loadingModal);
    }
    
    changeCustomer(customer){
        this.customer = customer;
        this.customerChange.emit(customer);
    }
    
    fmcs: string[];
    errorMessage: string;
    getFMCs(loadingModal) {
       this.loadingBarComponent.loadingModal.show();
       this.aieMultipleService.getCustFmcRecords(this.region)
            .subscribe(
                fmcs => {
                    this.validChange.emit(this.idFMC.valid);
                    this.fmcs = fmcs;
                    this.loadingBarComponent.loadingModal.hide();
                    },
                error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
               });
            console.log("FMCs: ", this.fmcs);
    }
     
    customers: string[];
    getCustomers(loadingModal) {
        this.loadingBarComponent.loadingModal.show();
        this.aieMultipleService.getCustomers(this.region, this.fmc)
            .subscribe(
                customers => {
                    this.customers = customers;
                    this.loadingBarComponent.loadingModal.hide();
                    this.validChange.emit(this.idFMC.valid);
                    },
                 error =>  {
                   this.loadingBarComponent.loadingModal.hide();
                   this.errorMessage = <any>error;
               });
        console.log("Customers: ", this.customers);
    }
   
}
