
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-repair-class-select',
  templateUrl: './repair-class-select.component.html',
  styleUrls: ['./repair-class-select.component.css']
})
export class RepairClassSelectComponent implements OnInit {
    repairClassList: Object[] = [];
    
    @Input() repairClassKey: string;
    @Output() repairClassKeyChange = new EventEmitter();
    
    constructor() { 
        this.repairClassList = [
            { code: "", description: "Select" },            
            { code: "A", description: "Body" }, 
            { code: "E", description: "Enhancement" },
            { code: "G", description: "Glass" },
            { code: "M", description: "Mechanical" },
            { code: "O", description: "Miscellaneous" }
        ]
    }
    ngOnInit() {}
    
    change(event) {
        console.log("in repairClassSelect code is now " + this.repairClassKey);
        this.repairClassKeyChange.emit(this.repairClassKey);
    }     
}