import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/app/env';


@Injectable()
export class UserProfileApiService {
  private getProfileUrl = `${API_URL}api/get_profile`;
  private payForBUrl=`${API_URL}api/payment/plan_b`;
  private updateBillStatusUrl=`${API_URL}api/update_bill_status/plan_b`;
  private rejectBillUrl=`${API_URL}api/reject_payment/plan_b`;

  constructor(private http: HttpClient) {
    
  }

  
  public getUserProfile(token:any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(this.getProfileUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  public payForB(token:any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(this.payForBUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  public updateBillStatus(token:any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(this.updateBillStatusUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  public rejectBill(token:any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(this.rejectBillUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}