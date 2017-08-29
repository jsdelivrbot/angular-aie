import { Component, OnInit, forwardRef, Input, OnChanges } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

export function createCounterRangeValidator(finAcctValue) {
    return (c: FormControl) => {
        let err = {
            mutualExclusiveError: {
                given: c.value,
                disallowedFinAcct: finAcctValue
            }    
        }
        //console.log("SALES code validaton function", c.value, finAcctValue);
        var result = false;    
        switch (c.value) {
        //case "V3": //already defined below
        case "X2": 
        //case "U2": //already defined below
        //case "U3": //already defined below
          if (finAcctValue == "000") {
            //console.log("sc - x2 / must be non empty but is " + finAcctValue + "-  invalid")
            result = true;
          }
          break;
        case "Q1":
        case "A1":
        case "A8":
          if (finAcctValue != "000") {
            //console.log("sc - Q1/A1/A8 / must be 000 but is " + finAcctValue + "-  invalid")
            result = true;
          }
          break;
        case "V3":
          if (finAcctValue != "161") {
            //console.log("sc - V3 / must be 161 but is " + finAcctValue + "-  invalid")
            result = true;
          }
          break;
        case "U2":
        case "U3":
          if (!(finAcctValue == "145" ||
                finAcctValue == "170" ||
                finAcctValue == "172" ||
                finAcctValue == "180" ||
                finAcctValue == "811")) {
            //console.log("sc - U2/U3 / must be 145/170/172/180/811 but is " + finAcctValue + "-  invalid")
            result = true;
        }
          break;
        case "P1":
          if (finAcctValue != "511") {
            //console.log("sc - P1 / must be 511 but is " + finAcctValue + "-  invalid")
            result = true;
          }
          break;
        case "V4":
          if (finAcctValue != "191") {
            //console.log("sc - V4 / must be 191 but is " + finAcctValue + "-  invalid")
            result = true;
          }
          break;      
        }

        return result ? err : null;
    }    
}    
@Component({
  selector: 'sales-app',
  template: `
  
    <select  [(ngModel)]="_salesCode" class="form-control" style="max-width:100%;" 
        (change)="changeSelValue($event)" >
        <option value=""></option>
        <option value="A1">A1</option>
        <option value="A8">A8</option>
        <option value="D1">D1</option>
        <option value="N1">N1</option>
        <option value="P1">P1</option>
        <option value="Q1">Q1</option>
        <option value="S1">S1</option>
        <option value="U2">U2</option>
        <option value="U3">U3</option>
        <option value="V3">V3</option>
        <option value="V4">V4</option>
        <option value="X1">X1</option>
        <option value="X2">X2</option>
        <option value="X4">X4</option>
    </select>
 
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SalesComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SalesComponent), multi: true }
  ]
})
export class SalesComponent implements ControlValueAccessor, OnChanges {
  
  changeSelValue(e) {
      this.salesCode = e.srcElement.value;    
  }
    
  propagateChange: any = () => {};
  validateFn: any = () => {};
  
  @Input('salesCode') _salesCode = "";
  @Input('finAcctValue') finAcctValue = 0;

  get salesCode() {
    return this._salesCode;
  }
  
  set salesCode(val) {
    this._salesCode = val;
    this.propagateChange(val);
  }
  

  ngOnChanges(inputs) {
    if (inputs.salesCode || inputs.finAcctValue) {
      this.validateFn = createCounterRangeValidator(this.finAcctValue);
      this.propagateChange(this.salesCode);
    }
  }

  writeValue(value) {
    if (value) {
      this.salesCode = value;
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