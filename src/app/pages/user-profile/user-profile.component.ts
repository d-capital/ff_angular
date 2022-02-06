import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UserProfileApiService } from 'src/app/services/user-profile.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  serverErrors=[];
  public username:string;
  public email:string;
  public patreonLink = 'https://www.patreon.com/oauth2/authorize?response_type=code&client_id=_ZGTUGhQet30wwBt5II-sP0A4k8VDZyoaubFmDl319ne9E__uwXqLv5rNJ3aXQJn&redirect_uri=https://thefinefolio.com/oauth/redirect';
  public payPlanBUrl?:string;
  public planBStart?:string;
  public planBEnd?:string;
  public isBPayed?:string;
  public isPatron?:string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
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
        localStorage.setItem('isBPayed', data['is_b_payed']);
        this.isBPayed = data['is_b_payed'];
        this.isPatron = data['is_patron'];
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
  buyBPlan(){
    const token = localStorage.getItem('auth_token');
    this.UserPorfileApiService.payForB(token).pipe().subscribe(
      data=>{
        this.payPlanBUrl = data['payUrl'];
        this.document.location.href = data['payUrl'] ;
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
  updateBillStatus(){
    const token = localStorage.getItem('auth_token');
    this.UserPorfileApiService.updateBillStatus(token).pipe().subscribe(
      data=>{
        window.location.reload();
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
  rejectPayment(){
    const token = localStorage.getItem('auth_token');
    this.UserPorfileApiService.rejectBill(token).pipe().subscribe(
      data=>{
        window.location.reload();
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
