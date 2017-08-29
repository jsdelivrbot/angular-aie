import { customer } from '../common-components/common-structures';
import { vehicle } from '../common-components/common-structures';


export class repairAie {
    constructor(
        public repairCl: number,
        public reason: number,
        public salesCode: string,
        public finCA: number,
        public assembly: string,
        public dateCert: number,            
        public actNo: string,
        public totAmtAuth: number,
        public aieAmt: number,
        public aieAuto: string,
        public aieStatus: string,
        public rpRegion: number,
        public rpSequenceNo: number,
        public asComment: string,
        public asRegion: number,
        public asActDtTime: string,
        public asCstDtTime: string
    ) {}
};


 export class repairAieExtended extends repairAie {
     constructor(
        public repairCl: number,
        public reason: number,
        public salesCode: string,
        public finCA: number,
        public assembly: string,
        public dateCert: number,            
        public actNo: string,
        public totAmtAuth: number,
        public aieAmt: number,
        public aieAuto: string,
        public aieStatus: string,
        public rpRegion: number,
        public rpSequenceNo: number,
        public asComment: string,
        public asRegion: number,
        public asActDtTime: string,
        public asCstDtTime: string
    ) { super(
            repairCl,
            reason,
            salesCode,
            finCA,
            assembly,
            dateCert,           
            actNo,
            totAmtAuth,
            aieAmt,
            aieAuto,
            aieStatus,
            rpRegion,
            rpSequenceNo,
            asComment,
            asRegion,
            asActDtTime,
            asCstDtTime
        );
        
     }
    public dc: any;
    public id: any;
    public desc1: string;
    public desc2: string;
    public desc3: string;
    public desc4: string;
    public aieDesc: any;
}    

export class postData {
    constructor() {}

    public userLid: String;
    public userRegion: Number;
    public userName: String;
    public hostname: String;

    public customer: customer;
    public vehicle: vehicle;
    public asrpRecords: repairAieExtended[] = [];
}
