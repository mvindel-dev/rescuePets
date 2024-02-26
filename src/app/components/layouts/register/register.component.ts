import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formGroup !: FormGroup;

  constructor(private _authService:AuthService, private _formBuilder:FormBuilder){
    this.formGroup = this._formBuilder.group({
      userNameControl: ["", Validators.required],
      userEmailControl: ["", Validators.compose([Validators.email, Validators.required])],
      userPasswordControl: ["", Validators.compose([Validators.minLength(6), Validators.required])],
      userConfirmPasswordControl: ["", Validators.compose([Validators.required])]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('userPasswordControl');
    const confirmPasswordControl = formGroup.get('userConfirmPasswordControl');

    if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }

  register(formData: any){
    this._authService.register(formData.userNameControl, formData.userEmailControl, formData.userPasswordControl)
  }
}
