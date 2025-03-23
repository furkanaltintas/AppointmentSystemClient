import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { FormValidateDirective } from 'form-validate-angular';
import { HttpService } from '../../services/http.service';
import { LoginResponseModel } from '../../models/login-response.model';
import { Router } from '@angular/router';
import { loginAction } from '../../constants/urlconstants';

@Component({
  selector: 'app-login',
  imports: [FormsModule, FormValidateDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginModel: LoginModel = new LoginModel();

  constructor(
    private http: HttpService,
    private router: Router
  ) {}

  @ViewChild("password") password : ElementRef<HTMLInputElement> | undefined;

  showOrHidePassword() {
    if(this.password === undefined) return;
    if(this.password?.nativeElement.type === "password") {
      this.password.nativeElement.type = "text";
    } else {
      this.password.nativeElement.type = "password";
    }
  }


  signIn(form:NgForm) {
    if(form.valid) {
      this.http.post<LoginResponseModel>(loginAction, this.loginModel, (res) => {
          localStorage.setItem("key", res.data!.token);
          this.router.navigateByUrl("/");
      })
    }
  }
}
