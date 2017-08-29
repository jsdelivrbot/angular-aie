import { Component, OnInit, Input } from '@angular/core';
import { SsoService } from '../sso/sso.service';
import { DataService } from '../common-components/data.service';
import { HostDetails } from '../common-components/host.details';
import {Router} from "@angular/router";
import { LandingPageService } from './landing-page.service';
import { SecurityRecord } from '../common-components/common-structures';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  public redirectUrl: string;
  selectedLID: string;
  lids: string[] = [];
  name: string;
  region: number;
  host: string;
  errorMessage: string;
  ssoInitResult: string;
  isLoggedIn: boolean = false;
  currentUser: string;
  securityRecord: SecurityRecord;

  constructor(private landingPageService: LandingPageService,private router: Router, private dataService: DataService) {
  }

    
  ngOnInit() {
    this.dataService.currentLid.subscribe(currentLid => this.selectedLID = currentLid);
    this.dataService.currentLids.subscribe(currentLids => this.lids = currentLids);
    this.currentUser = localStorage.getItem('currentUser');
    
    // TODO: Temporary until SSO integrated for all
    if( null == this.currentUser || "" == this.currentUser ) {
        this.currentUser = "KARUNAKARCHATLA";
    }
    if( null == this.lids ) {
        console.log("Getting LIDs...");
        this.landingPageService.getLIDs(this.currentUser)
         .subscribe(
           lids => {
               this.lids = lids;
               this.dataService.setLids(lids);
           },
           error =>  {
           this.errorMessage = <any>error;
       });
    }

    //this.name = "Karun Chatla";
    //this.region = 2;
  }

  changeLid(newLid) {
        this.dataService.setLid(this.selectedLID);
        this.landingPageService.getSecurityRecord(this.selectedLID)
         .subscribe(
           securityRecord => {
               this.securityRecord = securityRecord;
               this.dataService.setSecurityRecord(securityRecord);
               if( null != securityRecord ) {
                    if ( "X" ==securityRecord.lvl1Perm ||       // CO Admin 
                         "X" ==securityRecord.lvl2Perm ||       // CO Support
                         "X" ==securityRecord.lvl5Perm ||       // AMC
                         "X" ==securityRecord.lvl7Perm ||       // FSR
                         "X" ==securityRecord.lvl8Perm          // SCO
                       ) { 
                        this.dataService.setEditAccess(true);
                    }
                    else {
                        this.dataService.setEditAccess(false);
                    }

                    this.dataService.setCustomerName(securityRecord.name);
                    this.dataService.setRegion(securityRecord.region);
               }
               console.log("securityRecord : " + securityRecord);
           },
           error =>  {
           this.errorMessage = <any>error;
       });
  }
}