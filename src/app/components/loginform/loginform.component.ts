import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router'


@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent {

  
  loginForm = new FormGroup ({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });

  serverErrors = [];

  user: User = new User('','','', '');
  
  constructor(
    private auth: AuthService,
    private router: Router,
    ) {}

  onLogin(): void {
    //console.warn(this.loginForm.value);
    const formControl = this.loginForm;
    this.auth.login(this.loginForm.value).pipe().subscribe(data=>{
      var auth_data = JSON.stringify(data);
      localStorage.setItem('auth_token', JSON.parse(auth_data)['auth_token']);
      var status = JSON.parse(auth_data)['status'];
      this.router.navigate(['/#/dashboard'])
      }, err => { 
        const validationErrors = err.error;
        if (err instanceof HttpErrorResponse) {
          
          if (err.status === 422) {
            this.serverErrors = err.error.message
          }
      }
    });
  }
}
