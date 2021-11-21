import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('auth_token')
    let goRedirect;
    if (token) {
      return this.auth.ensureAuthenticated(token).pipe(map(isLoggedIn=>{
        let userStatus = isLoggedIn['status'];
        if (userStatus === 'success'){
          this.router.parseUrl('/#/'+route.routeConfig.path);
          return true;
        }
        
      }));
    } else {
      this.router.navigate(['/login']);
    }
  }
}

