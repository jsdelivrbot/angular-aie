import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgDateRangePickerModule } from 'ng-daterangepicker';
import { Ng2CompleterModule } from "ng2-completer";
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { TypeaheadModule } from 'ngx-bootstrap';
import { DatepickerModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DaterangeComponent } from './daterange/daterange.component';


import { AppComponent } from './app.component';
import { RepairAieComponent } from './repair-aie/repair-aie.component';
import { RepairAieService } from './repair-aie/repair-aie.service';
import { AieHeaderComponent } from './aie-header/aie-header.component';
import { AieFooterComponent } from './aie-footer/aie-footer.component';
import { AieFleetCardComponent } from './aie-fleet-card/aie-fleet-card.component';
import { AieFleetCardService } from './aie-fleet-card/aie-fleet-card.service';
import { MyDatePipe } from './my-date.pipe';
import { MyTimePipe } from './my-time.pipe';
import { AieDecisionComponent } from './aie-decision/aie-decision.component';
import { AieDecisionService   } from './aie-decision/aie-decision.service';
import { AieMultipleComponent } from './aie-multiple/aie-multiple.component';
import { AieMultipleService } from './aie-multiple/aie-multiple.service';
import { AieMiscComponent } from './aie-misc/aie-misc.component';
import { AieMiscService } from './aie-misc/aie-misc.service';
import { SaleAieComponent } from './sale-aie/sale-aie.component';
import { SaleAieService } from './sale-aie/sale-aie.service';
import { CommonService } from './common-components/common.service';
import { TagGetCustVehComponent } from './tag-get-cust-veh/tag-get-cust-veh.component';
import { TagGetCustVehService } from './tag-get-cust-veh/tag-get-cust-veh.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageService } from './landing-page/landing-page.service';
import { AieSingleComponent } from './aie-single/aie-single.component';
import { AieSingleService } from './aie-single/aie-single.service';

import { RegionSelectComponent } from './common-components/region-select/region-select.component';
import { JustificationSelectComponent } from './common-components/justification-select/justification-select.component';
import { RepairReasonComponent } from './common-components/repair-reason/repair-reason.component';
import { SalesCodeSelectComponent } from './common-components/sales-code-select/sales-code-select.component';
import { CostAcctSelectComponent } from './common-components/cost-acct-select/cost-acct-select.component';
import { LoadingBarComponent } from './common-components/loading-bar/loading-bar.component';
import { RepairClassSelectComponent } from './common-components/repair-class-select/repair-class-select.component';
import { ReactComponent } from './react/react.component';
import { SalesComponent } from './common-components/sales/sales.component';
import { SsoComponent } from './sso/sso.component';
import { SsoService } from './sso/sso.service';
import { CookieService } from 'angular2-cookie/core';
import { DataService } from './common-components/data.service';
import { CustomerSelectComponent } from './common-components/cust-select/cust-select.component';
import { CostAcctComponent } from './common-components/cost-acct/cost-acct.component';
import { LoginValidateComponent } from './login-validate/login-validate.component';
import {AlertService} from "./_services/alert.service";
import {AuthGuard} from "./_guards/auth.guard";
import { SalesCostSelectComponent } from './common-components/sales-cost-select/sales-cost-select.component';
import {ZeroPadderPipe} from "./zero-padder.pipe";
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    AppComponent,
    ZeroPadderPipe,
    AieHeaderComponent,
    AieFooterComponent,
    RepairAieComponent,
    AieFleetCardComponent,
    MyDatePipe,
    MyTimePipe,
    AieDecisionComponent,
    AieMultipleComponent,
    AieMiscComponent,
    SaleAieComponent,
    TagGetCustVehComponent,
	DaterangeComponent,
    LandingPageComponent,
    AieSingleComponent,
    AieSingleComponent,
    RegionSelectComponent,
    JustificationSelectComponent,
    RepairReasonComponent,
    SalesCodeSelectComponent,
    CostAcctSelectComponent,
    LoadingBarComponent,
    RepairClassSelectComponent,
    ReactComponent,
    SalesComponent,
    SsoComponent,
    CustomerSelectComponent,
    CostAcctComponent,
    LoginValidateComponent,
    SalesCostSelectComponent,
    LogoutComponent,

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    NgDateRangePickerModule,
    Ng2CompleterModule,
    Ng2AutoCompleteModule,
    Daterangepicker,
    TypeaheadModule.forRoot(),
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
//    Moment,
    AlertModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: LandingPageComponent },
      { path: '', component: LoginValidateComponent },
        {
            path: 'sale',
            component: SaleAieComponent
        },
        {
            path: 'repair',
            component: RepairAieComponent
        },
        {
            path: 'single',
            component: AieSingleComponent
        },
        {
            path: 'fleet-card',
            component: AieFleetCardComponent
        },
        {
            path: 'decision/:repairClasses',
            component: AieDecisionComponent
        },
        {
            path: 'misc',
            component: AieMiscComponent
        },
        {
            path: 'multiple',
            component: AieMultipleComponent
        },
        {
          path: 'logout',
          component: LogoutComponent
        },
        {
            path: 'validatesso',
            component: SsoComponent
        },// otherwise redirect to home
        { path: '**', redirectTo: '' }
    ])
  ],

  providers: [
      SaleAieService,
      RepairAieService,
      AieMiscService,
      AieFleetCardService,
      TagGetCustVehService,
      AieDecisionService,
      AieMultipleService,
      AieSingleService,
      CommonService,
      SsoService,
      CookieService,
      DataService,
      AlertService,
      AuthGuard,
      LandingPageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
