import { Component, OnInit, forwardRef, Input, OnChanges } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

export function createCAValidator(salesValue) {
    return (c: FormControl) => {
        let err = {
            mutualExclusiveError: {
                given: c.value,
                disallowedSalesValue: salesValue
            }    
        }
        //console.log("Cost Account validaton function", c.value, salesValue);
        //console.log("validaton check", c.value, finAcctValue, err);
        var result = false;    
        switch (salesValue) {
        //case "V3": //already defined below
        case "X2": 
        //case "U2": //already defined below
        //case "U3": //already defined below
          if (c.value == "000") {
            //console.log("ca - x2 / must be non empty  but is " + c.value + " - invalid")
            result = true;
          }
          break;
        case "Q1":
        case "A1":
        case "A8":
          if (c.value != "000") {
            //console.log("ca - Q1/A1/A8 / must be 000  but is " + c.value + " - invalid")
            result = true;
          }
          break;
        case "V3":
          if (c.value != "161") {
            //console.log("ca - V3 / must be 161  but is " + c.value + " - invalid")
            result = true;
          }
          break;
        case "U2":
        case "U3":
          if (!(c.value == "145" ||
                c.value == "170" ||
                c.value == "172" ||
                c.value == "180" ||
                c.value == "811")) {
            //console.log("ca - U2/U3 / must be 145/170/172/180/811  but is " + c.value + " - invalid")
            result = true;
        }
          break;
        case "P1":
          if (c.value != "511") {
            //console.log("ca - P1 / must be 511  but is " + c.value + " - invalid")
            result = true;
          }
          break;
        case "V4":
          if (c.value != "191") {
            //console.log("ca - V4 / must be 191 but is " + c.value + " - invalid")
            result = true;
          }
          break;      
        }
        return result ? err : null;
    }    
}    
@Component({
  selector: 'app-cost-acct',
  template: `
    <select  [(ngModel)]="_costAcct" class="form-control" style="max-width:100%;" 
      (change)="changeSelValue($event)" >
        <option value="000"></option>
        <option value="145">145</option>
        <option value="160">160</option>
        <option value="161">161</option>
        <option value="170">170</option>
        <option value="171">171</option>
        <option value="172">172</option>
        <option value="180">180</option>
        <option value="190">190</option>
        <option value="191">191</option>
        <option value="511">511</option>
        <option value="611">611</option>
        <option value="711">711</option>
        <option value="712">712</option>
        <option value="811">811</option>
    </select>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CostAcctComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CostAcctComponent), multi: true }
  ]
})
export class CostAcctComponent implements ControlValueAccessor, OnChanges {
  
  changeSelValue(e) {
      //console.log("setting this.costAcct to e.srcElement.value ", e.srcElement.value); 
      this.costAcct = e.srcElement.value;    
  }
    
  propagateChange: any = () => {};
  validateFn: any = () => {};
  
  @Input('salesCode') salesCode = "";
  @Input('costAcct') _costAcct = 0;

  get costAcct() {
    return this._costAcct;
  }
  
  set costAcct(val) {
    this._costAcct = val;
    this.propagateChange(val);
  }
  

  ngOnChanges(inputs) {
    if (inputs.salesCode || inputs.costAcct) {
      this.validateFn = createCAValidator(this.salesCode);
      this.propagateChange(this.costAcct);
    }
  }

  writeValue(value) {
    if (value) {
      this.costAcct = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  validate(c: FormControl) {
    return this.validateFn(c);
  }
}