import { Component, OnInit, OnDestroy } from '@angular/core';
import {LoginformComponent} from '../../components/loginform/loginform.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor() {}

  title = 'Loading your data';

  ngOnInit() {
  }
  ngOnDestroy() {
  }

}
