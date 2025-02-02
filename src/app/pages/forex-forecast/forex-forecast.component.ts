import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ForexForecastService } from 'src/app/services/forex-forecast.service';

@Component({
    selector: 'app-forex-test',
    templateUrl: './forex-forecast.component.html',
})
export class ForexForecastComponent implements OnInit {

    constructor(
        private forexForecastService: ForexForecastService,
    ) { }
    serverErrors = [];
    public currentExchangeRate: number = 0.0;
    public futureExchangeRate: number = 0.0;
    public regressionExchangeRate: number = 0.0;
    public selectedCurrencyPair: string = "";

    ngOnInit(): void {
        this.getForecast();
    }
    getForecast(): void {
        const selcetedCurrencyPair = localStorage.getItem("currencyPair"); 
        this.selectedCurrencyPair = selcetedCurrencyPair;
        const firstCurrency = selcetedCurrencyPair.split("/")[0].toLowerCase();
        const secondCurrency = selcetedCurrencyPair.split("/")[1].toLowerCase();
        const currencyPair = firstCurrency.toUpperCase() + secondCurrency.toUpperCase() + "=X";
        this.forexForecastService.getForexForecast(firstCurrency, secondCurrency, currencyPair).pipe().subscribe(data => {
            console.log(data);
            this.currentExchangeRate = data['exchange_rate'];
            this.futureExchangeRate = data['future_exchange_rate'];
            this.regressionExchangeRate = data['regression_forecast'];
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
