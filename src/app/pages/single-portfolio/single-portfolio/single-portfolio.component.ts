import { Component, OnInit } from '@angular/core';
import {PortfoliosApiService} from '../../portfolios/portfolios.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PortfolioContent } from 'src/app/models/portfolio-content';
import { DbAssets } from 'src/app/models/dbassets';
import { Portfolio } from '../../portfolios/portfolios.model'
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-single-portfolio',
  templateUrl: './single-portfolio.component.html',
  styleUrls: ['./single-portfolio.component.scss']
})
export class SinglePortfolioComponent implements OnInit {

  serverErrors = [];
  
  portfoliosContentListSubs!: Subscription;
  portfoliosContentList!: PortfolioContent[];
  portfolioInfoSubs!: Subscription;
  portfoliosInfo!: Portfolio[];
  assetListSubs!: Subscription;
  assetList!: DbAssets[];

  constructor(private portfoliosApi: PortfoliosApiService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    const pId = parseFloat(localStorage.getItem('pId'));
    this.portfoliosContentListSubs = this.portfoliosApi
      .getPortfolioContent(token, pId)
      .subscribe(res => {
          this.portfoliosContentList = res;
          this.assetListSubs = this.portfoliosApi
          .getAssets().subscribe(res => {
            this.assetList = res;
            for (let asset of this.portfoliosContentList){
              let assetInfo =  this.assetList.filter(s => s.ticker == asset.asset)[0]
              asset.price = parseFloat(assetInfo.price.toFixed(2));
              asset.asset = assetInfo.ticker + ' ' + assetInfo.name;
              asset.money = parseFloat((assetInfo.price * asset.lot * asset.to_buy).toFixed(2));
            }
          },
          console.error
         );
        },
        console.error
      );
    this.portfolioInfoSubs = this.portfoliosApi
      .getPortfolioInfo(token, pId)
      .subscribe(res => {
        this.portfoliosInfo = res;
      },
      console.error
    );

  }

}
