import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router'
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signupForm = new FormGroup ({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    confirmpassword: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email])
  });
  serverErrors = [];

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  onSignup(): void{
    const formControl = this.signupForm;
    this.auth.signup(this.signupForm.value).pipe().subscribe(
      data=>{
        this.router.navigate(['/#/login']);
      },
      err=>{
          const validationErrors = err.error;
          if (err instanceof HttpErrorResponse) {
            
            if (err.status === 422) {
              this.serverErrors = err.error.message
            }
        }
      });
  }
}
