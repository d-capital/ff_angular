import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { Results } from 'src/app/models/results';
import { ResultsApiService } from 'src/app/services/results.service';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public Results: Results;
  public curveRefined = [];
  serverErrors=[];
  public sharpeRatio: number;
  public maxDrawdown: number;
  public maxWin: number;
  public testPeriod: string;
  public endCap: number;
  public returns: number;
  
  constructor(
    private resultsApiService: ResultsApiService,
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('auth_token');
    this.resultsApiService.getResults(token).pipe().subscribe(data=>{
      let curve = data['curve'].split(',');
      curve[0] = curve[0].replace('[','');
      curve[curve.length-1] = curve[curve.length-1].replace(']','');
      for(var i=0; i<curve.length;i++){
        let s = parseFloat(curve[i].replace(' ','')).toFixed(2);
        this.curveRefined.push(s);
      }
      this.data = this.curveRefined;
      this.sharpeRatio = data['sr'];
      this.testPeriod = data['start_date'] +' - '+data['end_date'];
      this.maxDrawdown = data['max_drawdown'];
      this.maxWin = data['max_win'];
      this.endCap = this.curveRefined[this.curveRefined.length-1];
      this.returns = ((this.endCap/data['capital'])*100);
      var chartSales = document.getElementById('chart-sales');
      this.datasets = [
        [0, 20, 10, 30, 15, 40, 20, 60, 60],
        [0, 20, 5, 25, 10, 30, 15, 40, 40]
      ];
      this.salesChart = new Chart(chartSales, {
        type: 'line',
        options: chartExample1.options,
        data: chartExample1.data
      });
      this.updateOptions();
      document.getElementById("bt-results").style.display = "block";;
    }, err => { 
      const validationErrors = err.error;
      if (err instanceof HttpErrorResponse) {
        
        if (err.status === 422) {
          this.serverErrors = err.error.message
        }
    }
  });

    
    //this.data = this.curveRefined;


    //var chartOrders = document.getElementById('chart-orders');

    //parseOptions(Chart, chartOptions());


    //var ordersChart = new Chart(chartOrders, {
      //type: 'bar',
      //options: chartExample2.options,
      //data: chartExample2.data
    //});

  }


  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
