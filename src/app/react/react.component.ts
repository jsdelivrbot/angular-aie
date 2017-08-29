import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.css']
})
export class ReactComponent implements OnInit {


  teamForm;            //
  allTeamDetails: any; //asrp - RepairAieExtended
    
  constructor(private formBuilder: FormBuilder) {
    this.teamForm = this.formBuilder.group({
      memberDetails: this.formBuilder.array([])
    });
            
    this.allTeamDetails = [
    {first_name: "bob", last_name: "Robert"}
    ,{first_name: "222", last_name: "bbbbbb"}
    ,{first_name: "333", last_name: "cccccc"}
    ,{first_name: "444", last_name: "dddddd"}
  ];
 }
    
  ngOnInit() {   
    this.teamForm = this.formBuilder.group({
      memberDetails: this.formBuilder.array(
        this.allTeamDetails.map(x => this.formBuilder.group({
          firstName: [x.first_name, [Validators.required, Validators.minLength(2)]],
          lastName: [x.last_name, [Validators.required, Validators.minLength(2)]]
        }))
      )
    })
  }
}
