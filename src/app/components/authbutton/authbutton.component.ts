import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authbutton',
  templateUrl: './authbutton.component.html',
})
export class AuthbuttonComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    ) {  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.auth.ensureAuthenticated(token).subscribe(res=>{
        let userStatus = res['status'];
        if (userStatus === 'success'){
          this.isLoggedIn = true;
        }
      });
    }
  }
  logOut() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('pId');
    window.location.reload();
    this.router.navigate(['/#/dashboard'], {skipLocationChange: true});
  }

}
