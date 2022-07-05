import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  first_name:string = "";
  last_name:string = "";
  phone_number:string = "";
  email:string = "";
  password:string = "";
  updateStatus = false;
  showMessgae = "none";


  constructor(private cs:CommonService, private router:Router) { }

  updateUser() {
    let id = localStorage.getItem("photoUserID");
    this.cs.updateUser(id, this.first_name, this.last_name, this.phone_number, this.email, this.password).subscribe(updateConfirmation => {
      console.log(updateConfirmation.update);
      this.showMessgae = "block";
      this.updateStatus = updateConfirmation.update;
    })
  }

  deleteUser() {
    if(confirm("Are you sure?")){
      let userID = localStorage.getItem("photoUserID");
      this.cs.deleteUser(userID).subscribe(response=> {
        console.log(response);
        if(response.deleteUser) {
          localStorage.setItem("photoUserID", "0");
          this.router.navigate(['/signup']);
        }
      })
    }
  }

  ngOnInit(): void {
    console.log(localStorage.getItem("photoUserID"))
    let userID = localStorage.getItem("photoUserID");
    this.cs.getUser(userID).subscribe(userDetails => {
      console.log(userDetails);
      this.first_name = userDetails.userData[0].first_name;
      this.last_name = userDetails.userData[0].last_name;
      this.phone_number = userDetails.userData[0].phone_number;
      this.email = userDetails.userData[0].email;
      this.password = userDetails.userData[0].password;
    })
  }

}
