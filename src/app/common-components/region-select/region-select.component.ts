import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TypeaheadModule } from 'ngx-bootstrap';
import { AieFleetCardService } from '../../aie-fleet-card/aie-fleet-card.service';
import { AieDecisionService } from  '../../aie-decision/aie-decision.service';
import { LoadingBarComponent } from '../loading-bar/loading-bar.component';

@Component({
  selector: 'app-region-select',
  templateUrl: './region-select.component.html',
  styleUrls: ['./region-select.component.css']
})
export class RegionSelectComponent implements OnInit {
   
  @ViewChild(LoadingBarComponent) public loadingBarComponent: LoadingBarComponent;
  @ViewChild('idLID') idLID;
//  @ViewChild('idCustomer') idCustomer;
  
  zones = ["1","2","3","4"];
    
  zoneSelect;
  lidSelect;
    
  constructor(private aieDecisionService: AieDecisionService) { }

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
    @Output('validLID') validChange = new EventEmitter();
    
//    @Output('validCustomer') validCustomerChange = new EventEmitter();
    
    @Input() zone: string;
    @Output() zoneChange = new EventEmitter();
    
    @Input() lid: string;
    @Output() lidChange = new EventEmitter();
    
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
    
    changeZone(zone, loadingModal){
        this.zone = zone;
        this.zoneChange.emit(zone);
        this.getLIDs();
    }
    
    changeLID(lid, loadingModal){
        this.lidChange.emit(lid);
        this.lid = lid;
        this.getCustomers();
    }
    
    changeCustomer(customer, valid){
        this.customer = customer;
        this.customerChange.emit(customer);
//        this.changeValidCustomer(valid);
    }
    
//    
//    lids: string[];
//    getLIDs(loadingModal) {
//        this.loadingBarComponent.loadingModal.show();
//       this.aieFleetCardService.getLIDs(this.zone)
//            .subscribe(
//                lids => {
//                    this.lids = lids;
//                    this.loadingBarComponent.loadingModal.hide();
//                    },
//                error =>  {
//                    this.loadingBarComponent.loadingModal.hide();
//                   this.errorMessage = <any>error;
//               });
//            console.log("LIDs: ", this.lids);
//    }
//     
//    customers: string[];
//    getCustomers(loadingModal) {
//        this.loadingBarComponent.loadingModal.show();
//        this.aieFleetCardService.getCustomers(this.zone, this.lid)
//            .subscribe(
//                customers => {
//                    this.customers = customers;
//                    this.validChange.emit(this.idLID.valid);
//                    this.loadingBarComponent.loadingModal.hide();
//                    },
//                 error =>  {
//                   this.loadingBarComponent.loadingModal.hide();
//                   this.errorMessage = <any>error;
//               });
//        console.log("Customers: ", this.customers);
//    }
    
    lids: string[];
    getLIDs() {
        this.loadingBarComponent.loadingModal.show();
        
        this.lid = "";
        this.customer = "";
        
        this.aieDecisionService.getLIDs(this.zone)
            .subscribe(
                lids  => {
                    this.lids = lids;
                    this.loadingBarComponent.loadingModal.hide();
                    //this.hideTableButtons();
                    if (lids.length == 0) {
                        alert('LIDS NOT FOUND!');
                        return false;
                    }
                },
                error => {
                    this.loadingBarComponent.loadingModal.hide();
                    //this.errorMessage = <any>error;
                }
            );
//         console.log("LIDs: ", this.lids);
    }

    customers: string[];
    getCustomers() {
        this.loadingBarComponent.loadingModal.show();

        this.customer = "";

        console.log("this.lid=" + this.lid);
        this.aieDecisionService.getCustomers(this.lid)
            .subscribe(
                customers => {
                    this.customers = customers;
                    this.validChange.emit(this.idLID.valid);
                    this.loadingBarComponent.loadingModal.hide();
                    //this.hideTableButtons();
                    if (customers.length == 0) {
                        alert('CUSTOMERS NOT FOUND!');
                        return false;
                    }
                },
                error => {
                    this.loadingBarComponent.loadingModal.hide();
                    //this.errorMessage = <any>error;
                    //this.customerForm.pathValue({message: this.errorMessage});
                }); 
    }
    
}
