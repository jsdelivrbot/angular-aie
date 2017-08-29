import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common-components/common.service';
import { DataService } from '../common-components/data.service';

@Component({
  selector: 'app-aie-header',
  templateUrl: './aie-header.component.html',
  styleUrls: ['./aie-header.component.css']
})

export class AieHeaderComponent implements OnInit {
  constructor(
        private commonService: CommonService,
        private dataService: DataService
  ) { }

//data service variables
    host: string;
    customerLid: string;
    customerName: string;
    customerRegion: number;
    userPermUpd: boolean = true;
    currentUser: any;
//end data service variables

  isActiveNav() {
    this.currentUser = localStorage.getItem('currentUser');
    let isLogged = false;
    if(this.currentUser){
      isLogged = true;
    }
    return isLogged;
  }

  ngOnInit() {
    this.getGlobalData();
  }


//This getGlobalData will get all common fields available which are populated at home/menu page.
    getGlobalData() {
        this.dataService.currentHostName.subscribe(host => this.host = host);
        this.dataService.currentLid.subscribe(customerLid => this.customerLid = customerLid);
        this.dataService.currentCustomerName.subscribe(customerName => this.customerName = customerName);
        this.dataService.currentRegion.subscribe(customerRegion => this.customerRegion = customerRegion);
//      console.log("host:           "+ this.host          );       // SHOWS EMPTY. THERE'S TIMING ISSUE.
//      console.log("customerLid:    "+ this.customerLid   );       // dataService is not done yet retrieving data.
//      console.log("customerName:   "+ this.customerName  );       // Just look at the body (json/array) displayed
//      console.log("customerRegion: "+ this.customerRegion);       // at the console.
    }

}
