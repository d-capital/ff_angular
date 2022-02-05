import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Subscription, of} from 'rxjs';
import {PortfoliosApiService} from './portfolios.service';
import {Portfolio} from './portfolios.model';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit, OnDestroy {
  
  @ViewChild('el') table:ElementRef;
  serverErrors = [];
  
  portfoliosListSubs!: Subscription;
  portfoliosList!: Portfolio[];
  isBPayed?:string;
  hasLessThan2Portfolios?:Boolean;
  constructor(private portfoliosApi: PortfoliosApiService, private router: Router) { 

  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    this.isBPayed = localStorage.getItem('isBPayed');
    this.portfoliosListSubs = this.portfoliosApi
      .getPortfolios(token)
      .subscribe(res => {
          this.portfoliosList = res;
          this.portfoliosApi
          .getPortfoliosCount(token)
          .subscribe(res => {
            let response = JSON.stringify(res);
            let pCount = JSON.parse(response)['portfolios_count'];
            this.hasLessThan2Portfolios = (pCount <= 2);
            },
            console.error
          );
        },
        console.error
      );
  }
  ngOnDestroy(): void {
    this.portfoliosListSubs.unsubscribe();
  }

  deletePortfolioFromUi(event){
    const portfolioIdToDelete = event.target.dataset.pid;
    const token = localStorage.getItem('auth_token');
    this.portfoliosApi.
    deletePortfolio(token,portfolioIdToDelete).pipe().subscribe(
      data=>{
        var resp = JSON.stringify(data);
        var status = JSON.parse(resp)['status'];
        if(status === 'success'){
          this.table.nativeElement.getElementsByTagName('tr')
          .namedItem(portfolioIdToDelete).remove()
        };
      }, err=>{
        const validationErrors = err.error;
          if (err instanceof HttpErrorResponse) {
            
            if (err.status === 422) {
              this.serverErrors = err.error.message
            }
        }
      }
    );
  }
  savePortfolioName(event, newName){
    const portfolioIdToRename = event.target.dataset.pid;
    const token = localStorage.getItem('auth_token');
    this.portfoliosApi.
    renamePortfolio(token,portfolioIdToRename,newName).pipe().subscribe(
      data=>{
        var resp = JSON.stringify(data);
        var status = JSON.parse(resp)['status'];
        if(status === 'success'){
          let table_row = this.table.nativeElement.getElementsByTagName('tr')
          .namedItem(portfolioIdToRename);
          table_row.getElementsByTagName('a')[0].textContent = newName;
        };
      }, err=>{
        const validationErrors = err.error;
          if (err instanceof HttpErrorResponse) {
            
            if (err.status === 422) {
              this.serverErrors = err.error.message
            }
        }
      }
    );
  }

  openPortfolio(event){
    const portfolioToOpen = event.target.dataset.pid;
    localStorage.setItem('pId', portfolioToOpen);
    localStorage.setItem('isTempPortfolio','false');
    this.router.navigate(['single-portfolio']);
  }

  openEditMode(event){
    const portfolioToOpenEditMode = event.target.dataset.pid;
    document.getElementById('pName'+portfolioToOpenEditMode).style.display = 'none';
    document.getElementById('pNameControl'+portfolioToOpenEditMode).style.display = 'block';
  }
  closeEditMode(event){
    const portfolioToCloseEditMode = event.target.dataset.pid;
    document.getElementById('pName'+portfolioToCloseEditMode).style.display = 'block';
    document.getElementById('pNameControl'+portfolioToCloseEditMode).style.display = 'none';
  }
  openNewPortfolio(){
    localStorage.removeItem('pId');
    this.router.navigate(['single-portfolio']);
  }

}
