import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/app/env';
import { OptimizationInputs } from './../models/optimization-inputs';




@Injectable()
export class OptimizeApiService {
private optimizeUrl = `${API_URL}/api/run_optimization`;

  constructor(private http: HttpClient) {
    
  }

  
  public runOptimization(token:any, optimizationInputs: OptimizationInputs): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const body = { optimizationInputs: optimizationInputs};
    return this.http.post(this.optimizeUrl,
      JSON.stringify(body),
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}