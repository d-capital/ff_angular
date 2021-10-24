import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/app/env';
import { Results } from '../models/results';


@Injectable()
export class ResultsApiService {
private getResultsUrl = `${API_URL}api/get_results`;

  constructor(private http: HttpClient) {
    
  }

  
  public getResults(token:any): Observable<Results>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Results>(this.getResultsUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
