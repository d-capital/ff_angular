import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/app/env';

@Injectable({
  providedIn: 'root'
})
export class ForexForecastService {
  private getForexForecastServiceUrl = `${API_URL}api/get_macro_forecast`;

  constructor(private http: HttpClient) { }

  public getForexForecast(first_currency, second_currency, currency_pair): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {first_currency:first_currency, second_currency:second_currency, currency_pair:currency_pair}
    return this.http.post(this.getForexForecastServiceUrl,JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
