import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/app/env';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private getNewsUrl = `${API_URL}api/get_news`;

  constructor(private http: HttpClient) { }

  public getNews(): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.getNewsUrl,
      {headers: headers}).pipe(catchError(this.erroHandler));
  }

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
