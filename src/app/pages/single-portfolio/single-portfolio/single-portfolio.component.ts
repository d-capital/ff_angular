import { Component, OnInit } from '@angular/core';
import { PortfoliosApiService } from '../../portfolios/portfolios.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PortfolioContent } from 'src/app/models/portfolio-content';
import { DbAssets} from 'src/app/models/dbassets';
import { Portfolio } from '../../portfolios/portfolios.model'
import { Subscription } from 'rxjs';
import { float } from 'aws-sdk/clients/lightsail';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router'
import { LoaderOverlayComponent } from 'src/app/components/loader-overlay/loader-overlay.component';

@Component({
  selector: 'app-single-portfolio',
  templateUrl: './single-portfolio.component.html',
  styleUrls: ['./single-portfolio.component.scss']
})
export class SinglePortfolioComponent implements OnInit {

 

  serverErrors = [];
  uiErrors = [];
  uiErrorsOnSave = [];
  isBPayed: string;
  
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
  isNewP: boolean;
  isExistingP: boolean;
  hasLessThan2Portfolios:boolean;
  spinnerTitle = "Loading portfolio data";
  spinnerSubTitle = "";

  newPortfolioContent: PortfolioContent[] = [];

  lastkeydown1: number = 0;

  constructor(
    private portfoliosApi: PortfoliosApiService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router
    ) { 

    this.portfolioForm = this.fb.group({
      new_name : new FormControl('',[Validators.required]),
      capital: new FormControl('',[Validators.required]),
      cap_currency: new FormControl('',[Validators.required]),
      pAssets: this.fb.array([]),
    });

  }
  

  ngOnInit(): void {
    this.startSpinning('Loading your portfolio data', '');
    this.isBPayed = localStorage.getItem("isBPayed");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let todayUI = yyyy + '-' + mm + '-' + dd;
    var year_ago = new Date();
    var dd_1 = String(year_ago.getDate()).padStart(2, '0');
    var mm_1 = String(year_ago.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy_1 = year_ago.getFullYear() - 1;
    let yearAgoUI = yyyy_1 + '-' + mm_1 + '-' + dd_1;
    var btStartDate = <HTMLInputElement>document.getElementById('backtestStart');
    btStartDate.value = yearAgoUI;
    var btEndDate = <HTMLInputElement>document.getElementById('backtestEnd');
    btEndDate.value = todayUI;
    const token = localStorage.getItem('auth_token');
    const pId = parseFloat(localStorage.getItem('pId'));
    this.isNewP = !(pId);
    this.isExistingP = !!(this.portfoliosContentList);
    const isTempPortfolio = localStorage.getItem('isTempPortfolio')
    if(!(isNaN(pId)) && (pId => 0)){
      var cap;
      var cap_curr;
      var displayedEnd;
      var dsiplayedStart
      this.portfoliosContentListSubs = this.portfoliosApi
        .getPortfolioContent(token, pId, isTempPortfolio)
        .subscribe(res => {
            this.portfoliosContentList = res;
            cap = this.portfoliosContentList[0].capital;
            cap_curr = this.portfoliosContentList[0].cap_currency  === "dollar" ? "$" : this.portfoliosContentList[0].cap_currency;
            displayedEnd = this.portfoliosContentList[0].end_date;
            dsiplayedStart = this.portfoliosContentList[0].start_date;
            this.assetListSubs = this.portfoliosApi
            .getAssets().subscribe(res => {
              this.assetList = res;
              const control = <FormArray>this.portfolioForm.get('pAssets');
              this.portfoliosContentList.forEach(x =>{
                let assetInfo =  this.assetList.filter(s => s.ticker == x.asset)[0];
                this.InitTotalPercentage = this.InitTotalPercentage + x.percentage;
                let price = parseFloat(assetInfo.price.toFixed(2));
                let assetCurrency = assetInfo.exchange === 'MOEX' ? 'rub' : 'dollar';
                let sumCalcCapCurrency = this.portfoliosContentList[0].cap_currency !== 'rub' ? 'dollar' : 'rub';
                let sumCalcPrice = this.getCalcPrice(assetInfo.price,sumCalcCapCurrency, assetCurrency);
                let money = sumCalcPrice * x.lot * x.to_buy;
                this.InitTotalMoneySpent = this.InitTotalMoneySpent + money;
                var displayedAssetName = assetInfo.ticker + ' ' + assetInfo.name;
                control.push(this.fb.group({
                  asset: displayedAssetName,
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
              const pCapital = <FormControl>this.portfolioForm.get('capital');
              const pCapCurrency = <FormControl>this.portfolioForm.get('cap_currency');
              const pName = <FormControl>this.portfolioForm.get('new_name');
              if (isTempPortfolio === 'false'){
                this.portfolioInfoSubs = this.portfoliosApi.getPortfolioInfo(token, pId).subscribe(s => {
                  this.portfoliosInfo = s;
                  pCapital.setValue(this.portfoliosInfo.capital);
                  pCapCurrency.setValue(this.portfoliosInfo.cap_currency);
                  pName.setValue(this.portfoliosInfo.portfolio_name)
                  document.getElementById('startEnd').innerText = dsiplayedStart + ' - ' +displayedEnd;
                  }, err => {
                    console.error;
                    document.getElementById('overlay').style.display = "none";
                  }
                );
              } else {
                pCapital.setValue(cap);
                pCapCurrency.setValue(cap_curr);
                pName.setValue('New Name');
                document.getElementById('startEnd').innerText = dsiplayedStart + ' - ' +displayedEnd;
              };
              this.portfoliosApi
              .getPortfoliosCount(token)
              .subscribe(res => {
                let response = JSON.stringify(res);
                let pCount = JSON.parse(response)['portfolios_count'];
                this.hasLessThan2Portfolios = (pCount <= 2);
                },
                console.error
              );
              document.getElementById('overlay').style.display = "none";
            }, err => {
              console.error;
              document.getElementById('overlay').style.display = "none";
            }
          );
        }, err =>{
          console.error;
          document.getElementById('overlay').style.display = "none";
        }
      );
    } else {
      const control = <FormArray>this.portfolioForm.get('pAssets');
      control.push(this.fb.group({
        asset: '',
        lot: {value: 0, disabled: true},
        to_buy: 0,
        percentage: 0,
        price: { value: 0, disabled: true},
        money: {value: 0, disabled: true },
      }));
      this.assetListSubs = this.portfoliosApi
            .getAssets().subscribe(res => {
              this.assetList = res;
              this.portfoliosApi
              .getPortfoliosCount(token)
              .subscribe(res => {
                let response = JSON.stringify(res);
                let pCount = JSON.parse(response)['portfolios_count'];
                this.hasLessThan2Portfolios = (pCount <= 2);
                }, err => {
                  console.error;
                  document.getElementById('overlay1').style.display = "none";
                }
              );
            });
    };
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
    let capital = this.portfolioForm.controls['capital'].value === "" ? 0 : this.portfolioForm.controls['capital'].value;
    let currentToBuy = this.portfolioForm.controls.pAssets['controls'].at(rowId).value.to_buy;
    let newMoney = parseFloat((calcPrice*newAssetInfo.lot*currentToBuy).toFixed(2));
    let calcedNewPercentage = Math.round(((calcPrice*newAssetInfo.lot*currentToBuy)/capital)*100);
    let newPercentage = isNaN(calcedNewPercentage)? 0 : calcedNewPercentage;
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
    let capital = this.portfolioForm.controls['capital'].value === "" ? 0 : this.portfolioForm.controls['capital'].value;
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    let pLength = this.portfolioForm.controls.pAssets['controls'].length;
    
    for (var i = 0; i < pLength; i++){
      let toBuy = this.portfolioForm.controls.pAssets['controls'].at(i).value.to_buy;
      let percentage = this.portfolioForm.controls.pAssets['controls'].at(i).value.percentage;
      let rowAsset = this.portfolioForm.controls.pAssets['controls'].at(i).value.asset;
      let price = this.portfolioForm.controls.pAssets['controls'].at(i).controls.price.value;
      let lot = this.portfolioForm.controls.pAssets['controls'].at(i).controls.lot.value;
      let rowTicker = rowAsset.split(' ')[0];
      let assetExchange = this.assetList.find(x => x.ticker === rowTicker).exchange;
      let assetCurrency = assetExchange === 'MOEX' ? 'rub' : 'dollar'
      let calcPrice = this.getCalcPrice(price, capCurrency, assetCurrency)
      if(toBuy == NaN && percentage !== NaN){
        let newToBuy = Math.round((capital*(percentage/100))/(lot*price));
        let newMoney = calcPrice*lot*newToBuy;
        let calcedNewPercentage1 = Math.round(((calcPrice*lot*newToBuy)/capital)*100);
        let newPercentage = isNaN(calcedNewPercentage1) ? 0 : calcedNewPercentage1;
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
        let calcedNewPercentage2 = Math.round(((calcPrice*lot*newToBuy)/capital)*100);
        let newPercentage = isNaN(calcedNewPercentage2) ? 0 : calcedNewPercentage2;
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
    let capital = this.portfolioForm.controls['capital'].value ==="" ? 0 : parseFloat(this.portfolioForm.controls['capital'].value);
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    let price = parseFloat(this.portfolioForm.controls.pAssets['controls'].at(rowId).controls.price.value);
    let rowAsset = this.portfolioForm.controls.pAssets['controls'].at(rowId).value.asset;
    let rowTicker = rowAsset.split(' ')[0];
    let rowAssetInfo = this.assetList.find(x => x.ticker === rowTicker);
    let assetCurrency = rowAssetInfo.exchange === 'MOEX' ? 'rub' : 'dollar';
    let calcPrice = this.getCalcPrice(price,capCurrency,assetCurrency);
    let newCalcedPercentage = Math.round(((calcPrice*rowAssetInfo.lot*newToBuy)/capital)*100);
    let newPercentage = isFinite(newCalcedPercentage) ? newCalcedPercentage : 0;
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
    let newPercentage = parseInt(event.target.value);
    let capital = this.portfolioForm.controls['capital'].value === "" ? 0 : parseFloat(this.portfolioForm.controls['capital'].value);
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    let price = parseFloat(this.portfolioForm.controls.pAssets['controls'].at(rowId).controls.price.value);
    let rowAsset = this.portfolioForm.controls.pAssets['controls'].at(rowId).value.asset;
    let rowTicker = rowAsset.split(' ')[0];
    let rowAssetInfo = this.assetList.find(x => x.ticker === rowTicker);
    let assetCurrency = rowAssetInfo.exchange === 'MOEX' ? 'rub' : 'dollar';
    let calcPrice = this.getCalcPrice(price,capCurrency,assetCurrency);
    let calcedNewToBuy = Math.round((capital*(newPercentage/100))/(rowAssetInfo.lot*calcPrice));
    let newToBuy = isNaN(calcedNewToBuy) ? 0 : calcedNewToBuy;
    let newMoney = parseFloat((calcPrice*rowAssetInfo.lot*newToBuy).toFixed(2));
    this.portfolioForm.controls.pAssets['controls'].at(rowId).patchValue({
      money: newMoney, 
      percentage: newPercentage, 
      to_buy: newToBuy
    });
    this.setNewTotals();
  }
  public openModal(content){
    let capital = this.portfolioForm.controls['capital'].value;
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    var capitalEmpty = !capital;
    var capCurrencyEmpty = !capCurrency;
    const pLength = this.portfolioForm.controls.pAssets['controls'].length;
    var portfolioEmpty = pLength <= 0;
    let currentFreeMoney = parseFloat(document.getElementById('freeMoney').innerText);
    var negativeFreeMoney = currentFreeMoney<0; 
    this.uiErrorsOnSave = [];
    if (capCurrencyEmpty){
      this.uiErrorsOnSave.push('Currency of the capital is not defined');
    }
    if (capitalEmpty){
      this.uiErrorsOnSave.push('Capital must be provided to run the test or save portfolio');
    }
    if (portfolioEmpty){
      this.uiErrorsOnSave.push('There are no assets in your portfolio');
    }
    if (negativeFreeMoney){
      this.uiErrorsOnSave.push("You've spent more money than you have");
    }
    if(portfolioEmpty || capitalEmpty || capCurrencyEmpty || negativeFreeMoney){
      console.warn('Multiple errors while starting backtest on users side');
    } else {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    }
  }
  public onSave(howToSave){
    const token = localStorage.getItem('auth_token');
    //ask to save as new portfolio or to change exisiting one?
    let pId: string;
    if(howToSave && howToSave=='new')
      pId = '0'; 
    else if(howToSave && howToSave=='old'){
      pId = localStorage.getItem('pId');
    }
    const pLength = this.portfolioForm.controls.pAssets['controls'].length;
    this.newPortfolioContent = [];
    for(var i=0; i < pLength; i++){
      let asset = this.portfolioForm.controls.pAssets['controls'].at(i).value.asset;
      let assetTicker = asset.split(' ')[0];
      let assetInfo = this.assetList.find(x => x.ticker === assetTicker);
      this.newPortfolioContent.push({
        user_id: null,//user_id will be identified on backend
        portfolio_id: parseInt(pId),
        asset: assetTicker,
        lot: this.portfolioForm.controls.pAssets['controls'].at(i).controls.lot.value,
        to_buy: parseInt(this.portfolioForm.controls.pAssets['controls'].at(i).value.to_buy),
        percentage: this.portfolioForm.controls.pAssets['controls'].at(i).value.percentage,
        start_date: new Date(),//since it is manual portfolio there is no date
        end_date: new Date(),//since it is manual portfolio there is no date
        exchange: assetInfo.exchange,
        asset_group: this.portfoliosInfo ? this.portfoliosInfo.asset_group : '',
        capital: this.portfolioForm.controls['capital'].value,
        cap_currency: this.portfolioForm.controls['cap_currency'].value,
        er: null,//since it is manual portfolio there is er
        price:this.portfolioForm.controls.pAssets['controls'].at(i).controls.price.value,
        money:this.portfolioForm.controls.pAssets['controls'].at(i).controls.money.value
      });
    };
    var newPContent = this.newPortfolioContent;
    newPContent = this.mergeDuplicates(newPContent);
    const new_name = (this.portfolioForm.controls['new_name'].value).toString();
    this.portfoliosApi.savePortfolio(token, new_name, pId, newPContent).pipe().subscribe(data=>{
      //give user a message that portfolios is saved
      }, err => { 
        const validationErrors = err.error;
        if (err instanceof HttpErrorResponse) {
          
          if (err.status === 422) {
            this.serverErrors = err.error.message
          }
      }
    });
  }
  setNewTotals(){
    let capital = this.portfolioForm.controls['capital'].value === "" ? 0 : this.portfolioForm.controls['capital'].value;
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
  
  startBacktest(){
    let backtestStartInput = <HTMLInputElement>document.getElementById('backtestStart');
    let backtestEndInput = <HTMLInputElement>document.getElementById('backtestEnd');
    let backtestStartDate = backtestStartInput.value;
    let backtestEndDate = backtestEndInput.value;
    var datesEmpty = !backtestStartDate || !backtestEndDate;
    let capital = this.portfolioForm.controls['capital'].value;
    let capCurrency = this.portfolioForm.controls['cap_currency'].value === 'rub' ? 'rub' : 'dollar';
    var capitalEmpty = !capital;
    var capCurrencyEmpty = !capCurrency;
    const pLength = this.portfolioForm.controls.pAssets['controls'].length;
    var portfolioEmpty = pLength <= 0;
    let currentFreeMoney = parseFloat(document.getElementById('freeMoney').innerText);
    var negativeFreeMoney = currentFreeMoney<0; 
    //check duplicates here
    this.uiErrors = [];
    if (datesEmpty){
      this.uiErrors.push('Both start and end dates are required fileds');
    }
    if (capCurrencyEmpty){
      this.uiErrors.push('Currency of the capital is not defined');
    }
    if (capitalEmpty){
      this.uiErrors.push('Capital must be provided to run the test');
    }
    if (portfolioEmpty){
      this.uiErrors.push('There are no assets in your portfolio');
    }
    if (negativeFreeMoney){
      this.uiErrors.push("You've spent more money than you have");
    }
    if(portfolioEmpty || capitalEmpty || datesEmpty || capCurrencyEmpty || negativeFreeMoney){
      console.warn('Multiple errors while starting backtest on users side');
    } else {
      const token = localStorage.getItem('auth_token');
      let stocksForTest = [];
      let allocationForTest = [];
      for(var i=0; i < pLength; i++){
        let asset = this.portfolioForm.controls.pAssets['controls'].at(i).value.asset;
        let assetTicker = asset.split(' ')[0];
        stocksForTest.push(assetTicker)
      }
      const toFindDuplicates = stocksForTest.filter((item, index) => stocksForTest.indexOf(item) !== index)
      if(toFindDuplicates.length > 0){
        this.uiErrors.push(`The following assets are duplicated: ${toFindDuplicates}. Please reconsider your choice.`);
      } else {
        for(var i=0; i < pLength; i++){
          let percentage = this.portfolioForm.controls.pAssets['controls'].at(i).value.percentage;
          allocationForTest.push(percentage)
        }
        this.startSpinning('We started to test your portfolio.', 'Wait a bit to see results.');
        this.portfoliosApi.startBacktest(token, stocksForTest, allocationForTest, capital, capCurrency, backtestStartDate, backtestEndDate).pipe().subscribe(data=>{
          this.router.navigate(['/#/results']);
          }, err => { 
            const validationErrors = err.error;
            if (err instanceof HttpErrorResponse) {
              
              if (err.status === 422) {
                this.serverErrors = err.error.message
              }
          }
        });
      }
    }
  }

  mergeDuplicates(newPContent){
    var duplicateAssets = newPContent
     .map(e => e['asset'])
     .map((e, i, final) => final.indexOf(e) !== i && i)
     .filter(obj=> newPContent[obj])
     .map(e => newPContent[e]["asset"]);
    var duplicate = newPContent.filter(obj=> duplicateAssets.includes(obj.asset));
    var unique = newPContent.filter((set => f => !set.has(f.asset) && set.add(f.asset))(new Set));
    unique.forEach(e=>{
      var assetDuplicate = duplicate.filter(x => x.asset === e.asset);
      var uniMoney = 0;
      var uniToBuy = 0;
      var uniPercentage = 0;    
      assetDuplicate.forEach(aD => {
          uniMoney = uniMoney + aD.money;
          uniToBuy = uniToBuy + aD.to_buy;
          uniPercentage = uniPercentage + aD.percentage;
      });
      if (duplicate.some(x => x.asset === e.asset)){
        e.money = uniMoney;
        e.to_buy = uniToBuy;
        e.percentage = uniPercentage;
      };
    })
    return unique;
  }

  startSpinning(newSpinnerTitle, newSpinnerSubTitle){
    this.spinnerTitle = newSpinnerTitle;
    this.spinnerSubTitle = newSpinnerSubTitle;
    document.getElementById('overlay').style.display = "block";
  };

}
