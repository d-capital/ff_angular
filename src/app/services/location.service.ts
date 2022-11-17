import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private http: HttpClient
  ) { }

  getIpAddress() {
    return this.http
          .get('https://api.ipify.org/?format=json')
          .pipe(
            catchError(this.erroHandler)
          );
  }

  getGEOLocation(ip) {
    // Update your api key to get from https://ipgeolocation.io
    let url = "https://api.ipgeolocation.io/ipgeo?apiKey=38daa914bbd147408601cb6571668f58&ip="+ip; 
      return this.http
            .get(url)
            .pipe(
              catchError(this.erroHandler)
            );
    } 

  erroHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
