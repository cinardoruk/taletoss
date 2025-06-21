import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../auth.service';
import { LoginRequest } from '../login-request';
import { LoginResult } from '../login-result';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  title?: string;
  loginResult?: LoginResult;
  form!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  )
  {}

  ngOnInit(){
    this.form = new FormGroup(
      {
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      }
    );
  }

  onSubmit()
  {
    var loginRequest = <LoginRequest>{};
    loginRequest.email = this.form.controls['email'].value;
    loginRequest.password = this.form.controls['password'].value;

    this.authService.login(loginRequest).subscribe(
      {
        'next': (result) => {
          console.log(result);
          this.loginResult = result;
          if (result.success) {
            this.router.navigate(["/teacher"]);
          }
        },
        'error': (error) => {
          console.log(error);
          if (error.status == 401) {
            this.loginResult = error.error;
          }
        }
      }
    );
  }

  getErrors(
    control: AbstractControl,
    displayName: string,
  ): string[] {
    var errors: string[] = [];
    Object.keys(control.errors || {}).forEach((key) => {
      switch (key) {
        case 'required':
          errors.push(`${displayName} is required.`);
        break;
        case 'pattern':
          errors.push(`${displayName} contains invalid characters.`);
        break;
        case 'isDupeField':
          errors.push(`${displayName} already exists: please choose another.`);
        break;
        default:
          errors.push(`${displayName} is invalid.`);
        break;
      }
    });
    return errors;
  }

}
