import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CantRegisterService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    const token = localStorage.getItem('auth_token')
    if (token) {
      this.auth.ensureAuthenticated(token).subscribe(res=>{
        let userStatus = res['status'];
        if (userStatus === 'success'){
          this.router.navigate(['/#/dashboard']);
          return false;
        }
        else {
          
          return true;
        }
      });
    }
    else {
      
      return true;
    }
  }
}
