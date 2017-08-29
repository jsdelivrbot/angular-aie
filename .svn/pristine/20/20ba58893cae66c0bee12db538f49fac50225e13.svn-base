import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cost-acct-select',
  templateUrl: './cost-acct-select.component.html',
  styleUrls: ['./cost-acct-select.component.css']
})
export class CostAcctSelectComponent implements OnInit {

    @Input() costAcct: string;
    @Output() costAcctChange = new EventEmitter();
    constructor() { }
    ngOnInit() {}
    change(event) {
        //console.log("in costAcctSelect code is now " + this.costAcct);
        this.costAcctChange.emit(this.costAcct);
    }

}
