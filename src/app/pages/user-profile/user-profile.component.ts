import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserProfileApiService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  serverErrors=[];
  public username:string;
  public email:string;
  public payPlanBUrl?:string;
  public planBStart?:string;
  public planBEnd?:string;

  constructor(
    private UserPorfileApiService: UserProfileApiService,
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('auth_token');
    this.UserPorfileApiService.getUserProfile(token).pipe().subscribe(
      data=>{
        this.username = data['username'];
        this.email = data['email'];
        this.payPlanBUrl = data['plan_b_url'];
        this.planBStart = data['plan_b_start'];
        this.planBEnd = data['plan_b_end'];
      },
      err=>{
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
