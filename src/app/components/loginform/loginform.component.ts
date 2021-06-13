import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent {

  
  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  user: User = new User('','');
  
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder) {}
  onLogin(): void {
    //console.warn(this.loginForm.value);
    this.auth.login(this.loginForm.value);
  }
  onRegister(): void {
    this.auth.register(this.user);
  }
}
