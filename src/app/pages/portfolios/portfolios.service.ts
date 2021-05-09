import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {API_URL} from 'src/app/env';
import {Portfolio} from './portfolios.model';



@Injectable()
export class PortfoliosApiService {
private portfoliosUrl = `${API_URL}/manage_portfolios`;
  constructor(private http: HttpClient) {
    
  }

  // GET list of public, future events
  getPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(this.portfoliosUrl).pipe(catchError(this.erroHandler));
  }
  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}