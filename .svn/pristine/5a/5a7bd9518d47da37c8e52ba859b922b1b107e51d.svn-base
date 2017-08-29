import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sales-code-select',
  templateUrl: './sales-code-select.component.html',
  styleUrls: ['./sales-code-select.component.css']
})
export class SalesCodeSelectComponent implements OnInit {
    @Input() salesCode: string;
    @Output() salesCodeChange = new EventEmitter();
    constructor() { }
    ngOnInit() {}
    change(event) {
        //console.log("in salesCodeSelect code is now " + this.salesCode);
        this.salesCodeChange.emit(this.salesCode);
    }
}
