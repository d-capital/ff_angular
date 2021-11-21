import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import {Router} from '@angular/router'
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup ({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    confirmationpassword: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email])
  });
  serverErrors = [];
  user: User = new User('','','', '');

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  onSignup(): void{
    const formControl = this.forgotPasswordForm;
    this.auth.changePassword(this.forgotPasswordForm.value).pipe().subscribe(
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
