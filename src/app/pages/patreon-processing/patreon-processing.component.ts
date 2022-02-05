import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfileApiService } from 'src/app/services/user-profile.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-patreon-processing',
    templateUrl: './patreon-processing.component.html',
    styleUrls: ['./patreon-processing.component.css']
  })
  export class PatreonProcessingComponent implements OnInit {
    serverErrors: any;
  
    constructor(
      private auth: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      private userProfileService: UserProfileApiService,
    ) { }
  
    ngOnInit() {
        let patreonId = this.route.snapshot.queryParams["patreonId"];
        let token_ff = localStorage.getItem('auth_token');
        this.userProfileService.savePatreonData(token_ff, patreonId).pipe().subscribe(
            data=>{
                this.router.navigate(['dashboard']);
            },
            err=>{
              this.router.navigate(['user-profile']);
              const validationErrors = err.error;
              if (err instanceof HttpErrorResponse) {
                
                if (err.status === 422) {
                  this.serverErrors = err.error.message
                }
              }
            }
          );
    }
 
  }
  