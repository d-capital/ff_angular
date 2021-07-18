import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest } from "@angular/common/http";
import {API_URL} from '../../../src/app/env';
import { User } from '../models/user';
import { catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';



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
      JSON.stringify(body),{headers:headers})
  }

  ensureAuthenticated(token: any): Observable<any>{
    let url = this.BASE_URL+'api/userstatus';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url, {headers: headers}).pipe(catchError(this.erroHandler));
  };
    

  signup(user: User) {
    const body = { username: user.username, password: window.btoa(user.password),
       email: user.email, confirmationpassword: window.btoa(user.confirmationpassword) };
    const headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(
      this.BASE_URL + 'api/signup',
      JSON.stringify(body),{headers:headers})
  }

  erroHandler(error: HttpErrorResponse) {
    console.log(error.message);
    return throwError(error.message || 'server Error');
  }
}
