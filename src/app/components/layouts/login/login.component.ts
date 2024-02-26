import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  formGroup !: FormGroup;

  constructor(private _authService:AuthService, private _formBuilder:FormBuilder){
    this.formGroup = this._formBuilder.group({
      userMailControl: ["", Validators.email],
      userPasswordControl: ["", Validators.compose([Validators.minLength(6), Validators.required])],
    }, {
    })
  }

  login(formData: any){
    this._authService.loginWithEmail(formData.userMailControl, formData.userPasswordControl);
  }

  googleLogin(){
    this._authService.loginWithGoogle();
  }
}
