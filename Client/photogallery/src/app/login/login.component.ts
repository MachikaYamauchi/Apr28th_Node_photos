import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
// nagigate from a compenent to anothercomponent
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email:string = '';
  password:string = '';
  // 表示させないのはどちらなのかで、trueかfalseを判断する。
  loginStatus = true;

  constructor(private cs:CommonService, private router:Router) { }

  login() {
    this.cs.loginService(this.email, this.password).subscribe(loginData => {
      console.log(loginData);
      this.loginStatus = loginData.login;
      if(loginData.login) {
        console.log(loginData.data[0].userID);
        localStorage.setItem("photoUserID", JSON.stringify(loginData.data[0].userID));

        // Navigate method takes an array. The first element is the path and the rest are parameters
        this.router.navigate(['/photos']);
      }
    })
  }

  ngOnInit(): void {
  }

}
