import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest } from "@angular/common/http";
import {API_URL} from '../../../src/app/env';
import { User } from '../models/user';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) {}

  private BASE_URL: string = `${API_URL}`;

  
  login(user: User) {
    const body = { username: user.username, password: window.btoa(user.password) };
    const headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(
      this.BASE_URL+'api/login',
      JSON.stringify(body),{headers:headers}).
      subscribe(data=>{
        var auth_data = JSON.stringify(data);
        localStorage.setItem('auth_token', JSON.parse(auth_data)['auth_token']);
      });
  }
  register(user: User) {
    const body = { username: user.username, password: user.password };
    return this.http.post(
      this.BASE_URL,
      body,
    );
  }

  erroHandler(error: HttpErrorResponse) {
    console.log(error.message);
    return throwError(error.message || 'server Error');
  }
}
