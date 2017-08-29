import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sales-cost-select',
  templateUrl: './sales-cost-select.component.html',
  styleUrls: ['./sales-cost-select.component.css']
})
export class SalesCostSelectComponent implements OnInit {
        
  salesCodes = ["","A1","A8","N1","P1","Q1", "S1","U2","U3","V3","V4","X1","X2","X4"];
  salesLvl1_2 = ["","A1","A8","D1", "D2", "N1","P1","Q1", "S1","U2","U3","V3","V4","X1","X2","X4"];  // For D1 or D2, se-lvl1 or se-lvl2 = 'X'
  costAccountBlank = [];
  costAccountZero = [0];
  costAccountAll = [145,160,161,170,171,180,190,191,511,611,711,712,811];
  costAccountP1 = [511];
  costAccountU23 = [145,170,172,180,811];
  costAccountV3 = [160, 161];
  costAccountV4 = [191];
  costAccountX2 = [145,160,161,170,171,180,190,191,511,611,711,712,811];

  constructor() { }

  ngOnInit() { }
  
    @Input() salesCode: string = "";
    @Output() salesCodeChange = new EventEmitter();
    
    @Input() costAccount: number = 0;
    @Output() costAccountChange = new EventEmitter();
    
    @Input() isTable: boolean;
    @Input() lvl1Perm: string;
    @Input() lvl2Perm: string;
    
    changeSalesCode(salesCode){
        this.salesCode = salesCode;
        this.salesCodeChange.emit(salesCode);
        if (salesCode == "A1" || salesCode == "A8" || salesCode == "Q1"){
            this.costAccount = 0;
            this.costAccountChange.emit(0);
        } else if (salesCode == "X2") {
            this.costAccount = 145;
            this.costAccountChange.emit(145);
        } else if (salesCode == "V3") {
            this.costAccount = 160;
            this.costAccountChange.emit(160);
        } else if (salesCode == "V4") {
            this.costAccount = 191;
            this.costAccountChange.emit(191);
        } else if (salesCode=="U2" || salesCode=="U3"){
            this.costAccount = 145;
            this.costAccountChange.emit(145);
        } else if (salesCode == "P1"){
            this.costAccount = 511;
            this.costAccountChange.emit(511);
        } else if (salesCode == "D1" || salesCode == "D2" || salesCode == "N1" || salesCode == "S1" || salesCode == "X1" || salesCode == "X4") {
            this.costAccount = 0;
            this.costAccountChange.emit(0);
        }
    }
    
    changeCostAccount(costAccount){
        this.costAccount = costAccount;
        this.costAccountChange.emit(costAccount);
    }

}
