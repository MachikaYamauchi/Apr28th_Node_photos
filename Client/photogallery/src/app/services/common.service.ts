import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
interface Login {
  login: boolean;
  message:string;
  data:[
    {
      userID:number;
      email:string;
      password:string;
    }
  ]
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private loginURL = "http://localhost:4400/login";
  private userURL = "http://localhost:4400/user";
  private updateURL = "http://localhost:4400/updateUser";
  private deleteURL = "http://localhost:4400/deleteuser";

  constructor(private http:HttpClient) { }

  loginService(email:string, password:string) {
    let loginBody = {
      email:email,
      password:password
    }
    // <Login> is data type for getting data from database
    return this.http.post<Login>(this.loginURL, loginBody);
  }

  getUser(id:any) {
    return this.http.get<{user:boolean, message:string, userData:[{userID:number, first_name:string, last_name:string, phone_number:string, email:string, password:string}]}>(this.userURL + "/" + id);
  }

  updateUser(id:any, first_name:string, last_name:string, phone_number:string, email:string, password:string) {
    let updateBody = {
      "userID":id,
      "first_name": first_name,
      "last_name": last_name,
      "phone_number": phone_number,
      "email": email,
      "password": password
    }
    return this.http.put<{update:boolean, message:any}>(this.updateURL, updateBody);
  }

  deleteUser(id:any){
    return this.http.delete<{deleteUser:boolean, message:any}>(this.deleteURL + "/" + id);
  }
}
