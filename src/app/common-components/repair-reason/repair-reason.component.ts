import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-repair-reason',
  templateUrl: './repair-reason.component.html',
  styleUrls: ['./repair-reason.component.css']
})
export class RepairReasonComponent implements OnInit {

    
    repList: Object[] = [];
    
    @Input() repReason: string;
    @Output() repReasonChange = new EventEmitter();
   
    change(repReason){
        this.repReason= repReason;
        this.repReasonChange.emit(repReason);
    }

    ngOnInit() { }
    
    constructor() {
        this.repList = [
            { code: "", description: "Please Select Reason Code/Description" },            
            { code: "01", description: "Breakdown" }, 
            { code: "02", description: "Consumption-Fuel" },
            { code: "03", description: "Consumption-Oil" },
            { code: "04", description: "Driver's Report" },
            { code: "05", description: "Inspection-Routine" },
            { code: "06", description: "Lubrication" },
            { code: "07", description: "Pre-Delivery" },
            { code: "08", description: "Preventive Maintenance" },
            { code: "09", description: "Rework" },
            { code: "10", description: "Road Call" },
            { code: "11", description: "Routine" },
            { code: "12", description: "CAPS (Not for Regional Use)" },
            { code: "13", description: "US Government Credit Card Purchase (Non-Pay Transactions)" },
            { code: "21", description: "Capital Improvement Repair Management Decision" },
            { code: "22", description: "Conversion Repair Management Decision" },
            { code: "23", description: "Modification Repair Management Decision" },
            { code: "24", description: "Special Study Repair Management Decision" },
            { code: "25", description: "Sales Prep" },
            { code: "29", description: "Car Rental Due to Accident Repair" },
            { code: "30", description: "Incident (Automatically defaults to charge funtion code 160)" },
            { code: "31", description: "Turn In Damage - Reassignment Vehicle (Defaults to function code 160)" },
            { code: "32", description: "Accident-Reported Repairs ( Defaults to charge function code 160)" },
            { code: "33", description: "Manufacture's Recall Repairs" },
            { code: "34", description: "Catastrophic Damage" },
            { code: "35", description: "Statutory Modification Repairs" },
            { code: "36", description: "Theft Repairs" },
            { code: "37", description: "Vandalism Repairs" },
            { code: "38", description: "Warranty Repairs" },
            { code: "39", description: "Acts of Nature" },
            { code: "40", description: "Glass Replacement" },
            { code: "41", description: "Goodwill Warranty" },
            { code: "99", description: "Other" }
        ]
    }   

}
