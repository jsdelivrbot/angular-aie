import { Component, AfterViewInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

import * as moment from 'moment';

@Component({
  selector: 'app-daterange',
  templateUrl: './daterange.component.html',
  styleUrls: ['./daterange.component.css']
})

export class DaterangeComponent  {
    
    @Input() dr: string;
    @Output() updateDateRange = new EventEmitter<any>();

    today: moment.Moment = moment();
    current_fiscal_year_start;
    current_fiscal_year_end;                  
    last_fiscal_year_start;
    last_fiscal_year_end;

    dates: {[ id: string]: moment.Moment} = {};
    
    @ViewChild(DaterangePickerComponent)
    private picker: DaterangePickerComponent;
    
    constructor(private daterangepickerOptions: DaterangepickerConfig) {
        
        if (this.today.quarter() == 4) {
           this.current_fiscal_year_start = moment().month('October').startOf('month');
           this.current_fiscal_year_end = moment().add(1, 'year').month('September').endOf('month');                  
           this.last_fiscal_year_start = moment().subtract(1, 'year').month('October').startOf('month');
           this.last_fiscal_year_end = moment().month('September').endOf('month');
        } else {
           this.current_fiscal_year_start = moment().subtract(1, 'year').month('October').startOf('month');
           this.current_fiscal_year_end = moment().month('September').endOf('month');                   
           this.last_fiscal_year_start = moment().subtract(2, 'year').month('October').startOf('month');
           this.last_fiscal_year_end = moment().subtract(1, 'year').month('September').endOf('month');
        };
        
        
        this.daterangepickerOptions.settings = {
            locale: { format: 'MM/DD/YYYY' },
            alwaysShowCalendars: true,
            ranges: {
               'One Week': [moment().subtract(1, 'week'), moment()],
               'Two Weeks': [moment().subtract(2, 'week'), moment()],
               'This FY': [this.current_fiscal_year_start, this.current_fiscal_year_end],
               'Last FY': [this.last_fiscal_year_start, this.last_fiscal_year_end],
            }
        };
    }
    
    ngAfterViewInit() { 
      //console.log("in ngOnInit for daterangepicker", this.picker.datePicker);
          this.dates.startDate = this.picker.datePicker.startDate;
          this.dates.endDate = this.picker.datePicker.endDate;
        this.updateDateRange.emit(this.dates);

    }
        
    doRange(whichButton) {
        //switch(whichButton) {
        //case 1:
        //    this.startDate = this.dateRangePickerObject
            
        //}
            
        //console.log("daterangepickerobject");
        //console.log(whichButton);
        //console.log(this.daterangepickerOptions);
        this.dates.startDate = this.daterangepickerOptions.settings.ranges[whichButton][0];
        this.dates.endDate = this.daterangepickerOptions.settings.ranges[whichButton][1];
        
            
        this.picker.datePicker.setStartDate(this.daterangepickerOptions.settings.ranges[whichButton][0]);
        this.picker.datePicker.setEndDate(this.daterangepickerOptions.settings.ranges[whichButton][1]);
        
        this.updateDateRange.emit(this.dates);
    }
    

    public selectedDate(value: any) {
        //console.log("heeeeeere");
        //console.log(value);
        //console.log(this.picker.datePicker);
        this.dates.startDate = value.start;
        this.dates.endDate = value.end;
        this.updateDateRange.emit(this.dates);
        
    }
    

}
