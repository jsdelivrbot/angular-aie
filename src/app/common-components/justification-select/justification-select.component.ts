import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-justification-select',
  templateUrl: './justification-select.component.html',
  styleUrls: ['./justification-select.component.css']
})
export class JustificationSelectComponent implements OnInit {

    allJust: any[] = []
    justifications: any[] = [];
    
    @Input() justification: number;
    @Input() justType: string;
    @Output() justificationChange = new EventEmitter();
    
    change(justification){
        this.justification = justification;
        this.justificationChange.emit(justification);
    }

    private decision123Includes = [0, 1, 2];
    private decision45Includes  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    private fctOneIncludes      = [0, 1, 2, 18, 19, 20, 21, 22, 23]
    private fctTwoIncludes      = [0, 1, 2, 18, 19, 20, 21, 22]

    ngOnInit() {
        switch(this.justType) {
        case "decision123":
            this.build(this.decision123Includes);
            break;
        case "decision45":
            this.build(this.decision45Includes);
            break;
        case "fctOne":
            this.build(this.fctOneIncludes);
            break;
        case "fctTwo":
            this.build(this.fctTwoIncludes);
            break
        default:
            this.build(this.decision123Includes);
        }
        
        //if not already selected, select the first item
        //console.log(this.justification);
        if (this.justification == null || typeof this.justification === "undefined") 
            this.justification = 0;
    }

    constructor () {
        this.allJust = [
            { code: 0, description: "Justification..."},
            { code: 1, description: "AIE needs billed"},
            { code: 2, description: "AIE different agency"},
            { code: 3, description: "Bed liner covered by GSA"},
            { code: 4, description: "Brakes high miles miscoded"},
            { code: 5, description: "Cost adjustment"},
            { code: 6, description: "Driver authorized repair over $100"},
            { code: 7, description: "Driver authorized repair under $100"},
            { code: 8, description: "Equipment code added to vehicle"},
            { code: 9, description: "High mile tire replacement miscoded"},
            { code: 10, description: "Non-abuse repair miscoded"},
            { code: 11, description: "PM overdue"},
            { code: 12, description: "PM services performed"},
            { code: 13, description: "Shop performed work before PO"},
            { code: 14, description: "Towed by subcontractor of shop, not called in for PO"},
            { code: 15, description: "Weekend Repairs"},

            { code: 18, description: "No AIE - Customer Education"},
            { code: 19, description: "No AIE - Covered by GSA"},
            { code: 20, description: "No AIE - Updated FMS"},
            { code: 21, description: "No AIE - Product Miscode"},
            { code: 22, description: "No AIE - Incorrect Data Entry"},
            
            { code: 23, description: "No AIE - Incorrect Vehicle Tank Size"}

        ];

    }
    private build(arr) {
        for (var a of this.allJust) {
        if (arr.indexOf(a.code) > -1) { 
            this.justifications.push(a);
         }
    }
    
    }   

}
