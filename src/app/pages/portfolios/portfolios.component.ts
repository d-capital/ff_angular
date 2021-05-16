import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription, of} from 'rxjs';
import {PortfoliosApiService} from './portfolios.service';
import {Portfolio} from './portfolios.model';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit, OnDestroy {
  portfoliosListSubs!: Subscription;
  portfoliosList!: Portfolio[];
  constructor(private portfoliosApi: PortfoliosApiService) { 

  }

  ngOnInit(): void {
    this.portfoliosListSubs = this.portfoliosApi
      .getPortfolios()
      .subscribe(res => {
          this.portfoliosList = res;
        },
        console.error
      );

  }
  ngOnDestroy(): void {
    this.portfoliosListSubs.unsubscribe();
  }

}
