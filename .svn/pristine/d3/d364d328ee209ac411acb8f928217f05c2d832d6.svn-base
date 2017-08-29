import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { SsoService } from '../sso/sso.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Http, Response } from '@angular/http';
import {Observable} from "rxjs/Observable";
import {AlertService} from "../_services/alert.service";

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.css']
})
export class SsoComponent implements OnInit {
  private headers: any;
  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  constructor(private _cookieService:CookieService,private alertService: AlertService,
              private router: Router, private ssoService: SsoService, private activatedRoute: ActivatedRoute, private http : Http) { }
    loading = false;
    entName: string;
    errorMessage: string;
    returnUrl: string;

      ngOnInit() {
          let entVal ;
          //console.log("Cookie: " + this.getCookie("eu"));
          this.activatedRoute.queryParams.subscribe((params: Params) => {
             entVal = params['name'];
          });
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';

        this.ssoService.loginWithSSO().subscribe(
          entName => {
            this.entName = entName._body;
            console.log("EntName "+ this.entName);
            let user = this.entName;
            if (user){
              localStorage.setItem('currentUser', user);
            }
           // this.router.navigate([this.returnUrl]);
            this.redirectUrl = '/home';
            if (this.redirectUrl) {
              this.router.navigate([this.redirectUrl]);
              this.redirectUrl = null;
            }
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
      }

    getCookie(key: string){
        return this._cookieService.get(key);
    }

}
