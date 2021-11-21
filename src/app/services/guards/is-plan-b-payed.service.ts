import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class isBPayedService implements CanActivate {

  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const isBPayed = localStorage.getItem('isBPayed');
    if (isBPayed === 'true') {
        this.router.parseUrl('/#/'+route.routeConfig.path);
        return true;
    } else{
        return false;
      };
      
    }
}
