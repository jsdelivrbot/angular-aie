import { Component, OnInit } from '@angular/core';
import {SsoService} from "../sso/sso.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../common-components/data.service";
import {AlertService} from "../_services/alert.service";

@Component({
  selector: 'app-login-validate',
  templateUrl: './login-validate.component.html',
  styleUrls: ['./login-validate.component.css']
})
export class LoginValidateComponent implements OnInit {
  public redirectUrl: string;
  loading = false;
  errorMessage: string;
  ssoInitResult: string;
  isLoggedIn: boolean = false;
  returnUrl: string;

  constructor(private ssoService: SsoService,
              private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService,
              private alertService: AlertService) {
  }
  ngOnInit() {
    // reset login status
    this.ssoService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.ssoService.initiateSSO()
        .subscribe(
          ssoInitResult => {
            this.ssoInitResult = ssoInitResult["_body"];
            console.log("sso Url "+ this.ssoInitResult);
            this.redirectUrl = this.ssoInitResult;
            if (this.redirectUrl && !this.isLoggedIn) {
              this.isLoggedIn = true;
              window.location.href = this.redirectUrl;
            }
          },
          error =>  {
            this.alertService.error(error);
            this.loading = false;
          });

  }

}
