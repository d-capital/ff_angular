import { Component, OnInit } from '@angular/core';
import { PortfoliosApiService } from '../../portfolios/portfolios.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PortfolioContent } from 'src/app/models/portfolio-content';
import { DbAssets } from 'src/app/models/dbassets';
import { Portfolio } from '../../portfolios/portfolios.model'
import { Subscription } from 'rxjs';
import { float } from 'aws-sdk/clients/lightsail';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';


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
  InitTotalMoneySpent: float;
  InitTotalPercentage: float;
  InitFreeMoney: float;
  portfolioForm: FormGroup;
  pAssets: FormArray;


  constructor(private portfoliosApi: PortfoliosApiService, private fb: FormBuilder) { 

    this.portfolioForm = this.fb.group({
      capital: new FormControl('',[Validators.required]),
      cap_currency: new FormControl('',[Validators.required]),
      pAssets: this.fb.array([]),
    });

  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    const pId = parseFloat(localStorage.getItem('pId'));
    this.portfolioInfoSubs = this.portfoliosApi
    .getPortfolioInfo(token, pId)
    .subscribe(s => {
      this.portfoliosInfo = s;
      //console.log(this.portfoliosInfo[0].capital);
      const pCapital = <FormControl>this.portfolioForm.get('capital');
      const pCapCurrency = <FormControl>this.portfolioForm.get('cap_currency');
      },
      console.error
    );

    this.portfoliosContentListSubs = this.portfoliosApi
      .getPortfolioContent(token, pId)
      .subscribe(res => {
          this.portfoliosContentList = res;
          this.assetListSubs = this.portfoliosApi
          .getAssets().subscribe(res => {
            this.assetList = res;
            const control = <FormArray>this.portfolioForm.get('pAssets');
            this.portfoliosContentList.forEach(x =>{
              let assetInfo =  this.assetList.filter(s => s.ticker == x.asset)[0];
              control.push(this.fb.group({
                asset: assetInfo.ticker + ' ' + assetInfo.name,
                lot: x.lot,
                to_buy: x.to_buy,
                percentage: x.percentage,
                price: parseFloat(assetInfo.price.toFixed(2)),
                money: parseFloat((assetInfo.price * x.lot * x.to_buy).toFixed(2)),
              }));
            });


          },
          console.error
         );
        },
        console.error
      );
  }

}
