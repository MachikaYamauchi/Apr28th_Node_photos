import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/signup.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  first_name:string = "";
  last_name:string = "";
  phone_number:string = "";
  email:string = "";
  password1:string = "";
  password2:string = "";
  signunMessage:any = "";
  signupStatus:boolean = false;


  constructor(private su:SignupService) { }

  ngOnInit(): void {
  }

  signup(email:any) {
    // this.su.signupServices(this.first_name, this.last_name, this.phone_number, this.email, this.password).subscribe(signupData=> {
    //   console.log(signupData);
    //   this.signupStatus = signupData.signup;
    //   this.signunMessage = signupData.message;
    // })
    console.log(email)
  }

}
