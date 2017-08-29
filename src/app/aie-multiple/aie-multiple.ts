/**
 * New typescript file
 */
export class AieMultCust {
  constructor(
      public cu_Region: number,
      public fmc: number,
      public subFMC: number,
      public strSubFmc : string,
      public boac: string,
      public serial: number,
      public cu_Cst_Dt_Time: string,
      public contact: string,
      public phoneAc: string,
      public phone7: string
    ) { }
}
export class AieMultCustData {
  constructor(
      public cu_Cst_Dt_Time: string,
      public contact: string,
      public phoneAc: string,
      public phone7: string
    ) { }
}
export class AieMultVeh {
  constructor(
      public vh_Agency_Cl: string
     ,public vh_Tag: string
     ,public vehDtTime: string
     ,public acct1: string
     ,public acct2: string
     ,public garageZip: number
     ,public vh_Tag_Checked: boolean
    ) { }
}
export class AieFormData {
   constructor(
      public cu_Region: number,
      public fmc: number,
      public subFMC: number,
      public boac: string,
      public serial: number,     
      public billBackOrCredit: string,
      public fundCode: string,
      public acct1: string,
      public acct2: string,
      public salesCode: string,
      public costAcct: string,
      public descript: string,
      public amtToAllocate: number,
      public amtPerTag: number,
      public userLID: string
   ) { }
}
export class AieMultBaarTemp {
    constructor (
         public btActiveInd: string
        ,public btBoac: string
        ,public btFedCode: string
        ,public btFiscalYear: number
        ,public btTemplate: string
    ) { }
}
export class AieMultDataToUpd {
    constructor (
         public aieFormData: AieFormData
        ,public aieCustData: AieMultCustData
        ,public tagsToUpd : AieMultVeh[]
    ) { }
}