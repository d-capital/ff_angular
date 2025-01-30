import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { InterestRateService } from 'src/app/services/interest-rate.service';

@Component({
  selector: 'app-barometer',
  template: `
    <div style="display: table-row">
        <div style="color: white">{{ currencyPair }}</div>
        <div class="barometer">
            <svg viewBox="0 0 200 100">
                <!-- Background arc -->
                <path d="M10,100 A90,90 0 0,1 190,100" stroke="#ccc" stroke-width="10" fill="none" />
                
                <!-- Needle -->
                <line [attr.x1]="100" [attr.y1]="100" 
                    [attr.x2]="needleX" [attr.y2]="needleY" 
                    stroke="red" stroke-width="4" />
            </svg>
            <div class="value">{{ value.toFixed(2) }}</div>
            <div class="label-container">
                <span class="sell-label">Sell</span>
                <span class="buy-label">Buy</span>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .barometer {
      display: flex;
      flex-direction: column;
      align-items: center;
      width:200px;
      height:200px;
      float: left;
      background-color: white;
      border: 2px solid white;
      border-radius: 25px;
      margin-left: 10px;
      margin-right: 2%;
      margin-top: 2%;
      margin-bottom: 2%;
    }
    .value {
      font-size: 20px;
      margin-top: 10px;
      color: black;
    }
    .label-container {
        display: flex;
        justify-content: space-between;
        width: 200px; /* Adjust width as needed */
        padding: 10px;
        border: 1px solid #ccc;
    }

    .sell-label {
        color: red;
        font-weight: bold;
    }

    .buy-label {
        color: green;
        font-weight: bold;
    }
  `]
})
export class BarometerComponent implements OnInit {
    serverErrors=[];
    constructor(
        private interestRateService: InterestRateService,
      ) { }
    @Input() value: number = 0.5; // Value from -1 to 1
    @Input() currencyPair: string = "eur/usd"; // Value from -1 to 1

    ngOnInit(): void {
        this.getInterestRate();
      }

    getInterestRate():void {
        this.interestRateService.getInterestRate().pipe().subscribe(data=>{
            const firstCurrency = this.currencyPair.split("/")[0].toLowerCase();
            const secondCurrency = this.currencyPair.split("/")[1].toLowerCase();
            var firstCurrencyRates = data['interest_rate'][firstCurrency]
            var firstCurrencyCurrentRate = firstCurrencyRates[firstCurrencyRates.length - 1]
            var firstCurrencyCurrentRateValue = firstCurrencyCurrentRate['actual'] / 100
            var secondCurrencyRates = data['interest_rate'][secondCurrency]
            var secondCurrencyCurrentRate = secondCurrencyRates[secondCurrencyRates.length - 1]
            var secondCurrencyCurrentRateValue = secondCurrencyCurrentRate['actual'] / 100
            console.log("ir value");
            var diff = firstCurrencyCurrentRateValue/secondCurrencyCurrentRateValue
            console.log(firstCurrencyCurrentRateValue)
            console.log(secondCurrencyCurrentRateValue)
            console.log(diff)
            if(diff > 1 && diff < 2){
                var rating = 0.5 * diff;
            }
            else if (diff>2){
                var rating = 0.99;
            }
            else if(diff < 1){
                var rating = 1-diff;
            }
            console.log(rating);
            this.value = rating;
          },err => { 
            document.getElementById('mbc-spinner').setAttribute('style','display:none');  
            const validationErrors = err.error;
              if (err instanceof HttpErrorResponse) {
                
                if (err.status === 422) {
                  this.serverErrors = err.error.message
                }
            }
          });
      }

    get needleX(): number {
        return 100 + 90 * Math.cos((1 - this.value) * Math.PI);
    }

    get needleY(): number {
        return 100 - 90 * Math.sin((1 - this.value) * Math.PI);
    }
}
