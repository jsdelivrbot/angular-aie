import { Component } from '@angular/core';
import { SsoService } from './sso/sso.service';
import { CookieService } from 'angular2-cookie/core';
import { DataService } from './common-components/data.service';
import { HostDetails } from './common-components/host.details';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AIE Decision Tool';
    constructor(private ssoService: SsoService, private _cookieService:CookieService, private dataService: DataService) {}
    
    ssoInitResult: boolean;
    errorMessage: string;
    host: string;
    ngOnInit() {
        this.ssoService.getHostDetails()
             .subscribe(
               hostDetails => {
                   this.host = hostDetails.host;
                   this.dataService.setHost(hostDetails.host);
                   console.log("Host : " + hostDetails.host);
               },
               error =>  {
               this.errorMessage = <any>error;
           });
    }
    
    getCookie(key: string){
        return this._cookieService.get(key);
    }
}
