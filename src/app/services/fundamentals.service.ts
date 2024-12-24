import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/app/env';

@Injectable({
  providedIn: 'root'
})
export class FundamentalsService {
  private getFundamentalsUrl = `${API_URL}api/get_fundamental_analysis`;

  constructor(private http: HttpClient) { }

  public getFundamentals(currency_pair:string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body  = {currency_pair:currency_pair};
    return this.http.post(this.getFundamentalsUrl, JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
