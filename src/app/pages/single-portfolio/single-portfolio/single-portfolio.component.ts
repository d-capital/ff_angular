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
  portfoliosInfo!: Portfolio;
  assetListSubs!: Subscription;
  assetList!: DbAssets[];
  InitTotalMoneySpent: float = 0.0;
  InitTotalPercentage: float = 0.0;
  InitFreeMoney: string;
  portfolioForm: FormGroup;
  pAssets: FormArray;
  mathcingAssetList: any;


  lastkeydown1: number = 0;

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
              this.InitTotalPercentage = this.InitTotalPercentage + x.percentage;
              let price = parseFloat(assetInfo.price.toFixed(2));
              let money = assetInfo.price * x.lot * x.to_buy;
              this.InitTotalMoneySpent = this.InitTotalMoneySpent + money;
              control.push(this.fb.group({
                asset: assetInfo.ticker + ' ' + assetInfo.name,
                lot: {value: x.lot, disabled: true},
                to_buy: x.to_buy,
                percentage: x.percentage,
                price: { value: price, disabled: true},
                money: {value: parseFloat((money).toFixed(2)), disabled: true },
              }));
            });
            let moneyLeft = (this.portfoliosContentList[0].capital - this.InitTotalMoneySpent).toFixed(2);
            this.InitFreeMoney = moneyLeft.toString();
            this.InitTotalMoneySpent = Math.round((this.InitTotalMoneySpent + Number.EPSILON)*100)/100;// this is rounding
            this.InitTotalPercentage = Math.round((this.InitTotalPercentage + Number.EPSILON)*100)/100;
            this.portfolioInfoSubs = this.portfoliosApi.getPortfolioInfo(token, pId).subscribe(s => {
              this.portfoliosInfo = s;
              console.log(this.portfoliosInfo.cap_currency);
              const pCapital = <FormControl>this.portfolioForm.get('capital');
              const pCapCurrency = <FormControl>this.portfolioForm.get('cap_currency');
              pCapital.setValue(this.portfoliosInfo.capital);
              pCapCurrency.setValue(this.portfoliosInfo.cap_currency);
              },
              console.error
            );
          },
          console.error
         );
        },
        console.error
      );
  }
  
  getMatchingAssets($event) {
    let assetToSearch = $event.target.value;
    this.mathcingAssetList = [];

    if (assetToSearch.length > 1) {
      if ($event.timeStamp - this.lastkeydown1 > 200) {
        this.mathcingAssetList = this.searchFromArray(this.assetList, assetToSearch);
      }
    }
  }  
  searchFromArray(arr, regex) {
    let matches = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i]['ticker'].toLowerCase().indexOf(regex.toLowerCase())>-1 
      || arr[i]['name'].toLowerCase().indexOf(regex.toLowerCase())>-1) {
        matches.push(arr[i]['ticker'] + '' + arr[i]['name']);
      }
    }
    return matches;
  };
  setNewAsset(event){
    let rowId = event.target.id;
    let newAsset = event.target.value;
    let newAssetSplitted = event.target.value.split(' ');
    let newAssetTicker = newAssetSplitted[0];
    let newAssetInfo = this.assetList.find(x => x.ticker === newAssetTicker);
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    let assetCurrency = newAssetInfo.exchange === 'MOEX' ? 'rub' : 'dollar';
    let calcPrice = this.getCalcPrice(newAssetInfo.price,capCurrency,assetCurrency);
    let capital = this.portfolioForm.controls['capital'].value;
    let currentToBuy = this.portfolioForm.controls.pAssets['controls'].at(rowId).value.to_buy;
    let newMoney = parseFloat((calcPrice*newAssetInfo.lot*currentToBuy).toFixed(2));
    let newPercentage = Math.round(((calcPrice*newAssetInfo.lot*currentToBuy)/capital)*100);
    this.portfolioForm.controls.pAssets['controls'].at(rowId).setValue({
      asset: newAsset, 
      lot: newAssetInfo.lot, 
      money: newMoney, 
      percentage: newPercentage, 
      to_buy: currentToBuy, 
      price: (newAssetInfo.price).toFixed(2) 
    });
    this.setNewTotals()
  }
  deleteAssetFromUi(event){
    const rowToDelete = event.target.dataset.rid;
    (<FormArray>this.portfolioForm.controls.pAssets).removeAt(rowToDelete);
    this.setNewTotals()
  }
  recalcPortfolio(){
    let capital = this.portfolioForm.controls['capital'].value;
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    let pLength = this.portfolioForm.controls.pAssets['controls'].length;
    
    for (var i = 0; i < pLength; i++){
      let toBuy = this.portfolioForm.controls.pAssets['controls'].at(i).value.to_buy;
      let percentage = this.portfolioForm.controls.pAssets['controls'].at(i).value.percentage;
      let rowAsset = this.portfolioForm.controls.pAssets['controls'].at(i).value.asset;
      let price = this.portfolioForm.controls.pAssets['controls'].at(i).value.price;
      let lot = this.portfolioForm.controls.pAssets['controls'].at(i).value.lot;
      let rowTicker = rowAsset.split(' ')[0];
      let assetCurrency = this.assetList.find(x => x.ticker === rowTicker);
      let calcPrice = this.getCalcPrice(price, capCurrency, assetCurrency)
      if(toBuy == NaN && percentage !== NaN){
        let newToBuy = Math.round((capital*(percentage/100))/(lot*price));
        let newMoney = calcPrice*lot*newToBuy;
        let newPercentage = Math.round(((calcPrice*lot*newToBuy)/capital)*100);
        this.portfolioForm.controls.pAssets['controls'].at(i).patchValue({
          money: newMoney, 
          percentage: newPercentage, 
          to_buy: newToBuy
        });
      } else if(toBuy !== NaN && percentage == NaN){
        let newPercentage = Math.round(((calcPrice*lot*toBuy)/capital)*100);
        let newMoney = calcPrice*lot*toBuy;
        this.portfolioForm.controls.pAssets['controls'].at(i).patchValue({
          money: newMoney, 
          percentage: newPercentage
        });
      } else if(toBuy !== NaN && percentage !== NaN){
        let newToBuy = Math.round((capital*(percentage/100))/(lot*calcPrice));
        let newMoney = calcPrice*lot*newToBuy;
        let newPercentage = Math.round(((calcPrice*lot*newToBuy)/capital)*100);
        this.portfolioForm.controls.pAssets['controls'].at(i).patchValue({
          money: newMoney, 
          percentage: newPercentage,
          to_buy: newToBuy
        });
      }else{
        //pass
      };
    }
    this.setNewTotals()
  }
  addRow(){
    const control = <FormArray>this.portfolioForm.get('pAssets');
    control.push(this.fb.group({
      asset: null,
      lot: {value: null, disabled: true},
      to_buy: null,
      percentage: null,
      price: { value: null, disabled: true},
      money: {value: null, disabled: true },
    }));
  }
  getCalcPrice(price, capCurrency, assetCurrency){
    let calcPrice;
    let conversionRate = this.assetList.find(x => x.ticker === 'RUB=X').price;
    if (capCurrency === 'dollar' && assetCurrency === 'rub'){
      calcPrice = price/conversionRate;
    } else if (capCurrency === 'rub' && assetCurrency === 'dollar'){
      calcPrice = price*conversionRate;
    }else{
      calcPrice = price;
    };
    return calcPrice;
  }
  setNewToBy(event){
    let rowId = event.target.id;
    let newToBuy = event.target.value;
    let capital = parseFloat(this.portfolioForm.controls['capital'].value);
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    let price = parseFloat(this.portfolioForm.controls.pAssets['controls'].at(rowId).controls.price.value);
    let rowAsset = this.portfolioForm.controls.pAssets['controls'].at(rowId).value.asset;
    let rowTicker = rowAsset.split(' ')[0];
    let rowAssetInfo = this.assetList.find(x => x.ticker === rowTicker);
    let assetCurrency = rowAssetInfo.exchange === 'MOEX' ? 'rub' : 'dollar';
    let calcPrice = this.getCalcPrice(price,capCurrency,assetCurrency);
    let newPercentage = Math.round(((calcPrice*rowAssetInfo.lot*newToBuy)/capital)*100);;
    let newMoney = parseFloat((calcPrice*rowAssetInfo.lot*newToBuy).toFixed(2));;
    this.portfolioForm.controls.pAssets['controls'].at(rowId).patchValue({
      money: newMoney, 
      percentage: newPercentage, 
      to_buy: newToBuy
    });
    this.setNewTotals();
  }
  setNewPercentage(event){
    let rowId = event.target.id;
    let newPercentage = event.target.value;
    let capital = parseFloat(this.portfolioForm.controls['capital'].value);
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    let price = parseFloat(this.portfolioForm.controls.pAssets['controls'].at(rowId).controls.price.value);
    let rowAsset = this.portfolioForm.controls.pAssets['controls'].at(rowId).value.asset;
    let rowTicker = rowAsset.split(' ')[0];
    let rowAssetInfo = this.assetList.find(x => x.ticker === rowTicker);
    let assetCurrency = rowAssetInfo.exchange === 'MOEX' ? 'rub' : 'dollar';
    let calcPrice = this.getCalcPrice(price,capCurrency,assetCurrency);
    let newToBuy = Math.round((capital*(newPercentage/100))/(rowAssetInfo.lot*price));
    let newMoney = parseFloat((calcPrice*rowAssetInfo.lot*newToBuy).toFixed(2));
    this.portfolioForm.controls.pAssets['controls'].at(rowId).patchValue({
      money: newMoney, 
      percentage: newPercentage, 
      to_buy: newToBuy
    });
    this.setNewTotals();
  }
  onSave(){
    //TODO
  }
  setNewTotals(){
    let capital = this.portfolioForm.controls['capital'].value;
    let newTotalMoney = 0;
    let newTotalPercentage = 0;
    for (var i = 0 ; i<this.portfolioForm.controls.pAssets['controls'].length;i++) {
      newTotalMoney = newTotalMoney + this.portfolioForm.controls.pAssets['controls'].at(i).controls.money.value;
      newTotalPercentage = newTotalPercentage + (parseFloat(this.portfolioForm.controls.pAssets['controls'].at(i).controls.percentage.value));
    }
    document.getElementById('totalMoneySpent').innerText = (newTotalMoney.toFixed(2)).toString();
    document.getElementById('freeMoney').innerText = ((capital - newTotalMoney).toFixed(2)).toString();
    document.getElementById('totalPercentage').innerText = newTotalPercentage.toFixed(2).toString();
  }

}
