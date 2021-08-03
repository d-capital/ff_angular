import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {API_URL} from 'src/app/env';
import {Portfolio} from './portfolios.model';




@Injectable()
export class PortfoliosApiService {
private portfoliosUrl = `${API_URL}/manage_portfolios`;
private deletePortfoliosUrl = `${API_URL}/api/delete_portfolio`;
private renamePortfoliosUrl = `${API_URL}/api/rename_portfolio`;
  constructor(private http: HttpClient) {
    
  }

  // GET list of portfolios
  getPortfolios(token: any): Observable<Portfolio[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Portfolio[]>(this.portfoliosUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  deletePortfolio(token:any, portfolio_id: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = { portfolio_id: portfolio_id};
    return this.http.post(this.deletePortfoliosUrl,
      JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }
  renamePortfolio(
    token:any, 
    portfolio_id: string, 
    new_name: string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = { 
      portfolio_id: portfolio_id,
      new_name: new_name
    };
    return this.http.post(this.renamePortfoliosUrl,
      JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}