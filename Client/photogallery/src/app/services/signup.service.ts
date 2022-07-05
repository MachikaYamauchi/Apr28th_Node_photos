import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
interface Signup {
  signup:boolean;
  message:any;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private signupURL = "http://localhost:4400/signup";

  constructor(private http:HttpClient) { }

  signupServices(first_name:string, last_name:string, phone_number:string, email:string, password:string) {
    let signupBody = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      email: email,
      password: password
    }
    return this.http.post<Signup>(this.signupURL, signupBody)
  }
}
