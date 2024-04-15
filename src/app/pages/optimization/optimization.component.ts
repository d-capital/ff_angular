import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import { OptimizeApiService } from 'src/app/services/optimize.service';
import { OptimizationInputs } from 'src/app/models/optimization-inputs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-optimization',
  templateUrl: './optimization.component.html',
  styleUrls: ['./optimization.component.css']
})
export class OptimizationComponent implements OnInit {

  serverErrors = [];
  uiErrors = [];
  optimizationInputs: OptimizationInputs = new OptimizationInputs (0,'','','',false,false,'','','','' );
  isBPayed: string;
  optimizationForm: FormGroup;
  constructor(
    private optimizeApi: OptimizeApiService,
    private fb: FormBuilder,
    private router: Router,
    ) { 
      this.optimizationForm = this.fb.group({
        capital : new FormControl({value:'10000', disabled:false},[Validators.required]),
        exchange: new FormControl('NYSE and NASDAQ',[Validators.required]),
        asset_group: new FormControl('Blue Chips',[Validators.required]),
        opt_method: new FormControl(''),
        forecast_method: new FormControl(''),
        use_default_period: new FormControl(true,[Validators.required]),
        use_custom_period: new FormControl(false,[Validators.required]),
        start_date: new FormControl({value:'', disabled:true},[Validators.required]),
        end_date: new FormControl({value:'', disabled:true},[Validators.required]),
        cap_currency: new FormControl('dollar',[Validators.required]),
        save_result: new FormControl(''),
      });
    }
  

  ngOnInit(): void {
    this.isBPayed = localStorage.getItem('isBPayed');
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
    var startDate = <FormControl>this.optimizationForm.get('start_date');
    startDate.setValue(yearAgoUI);
    var endDate = <FormControl>this.optimizationForm.get('end_date');
    endDate.setValue(todayUI);
  }
  startOptimization(){
    const token = localStorage.getItem('auth_token');
    let optInputs = this.optimizationInputs;
    optInputs.cap_currency = this.optimizationForm.controls['cap_currency'].value;
    optInputs.capital = this.optimizationForm.controls['capital'].value;
    optInputs.asset_group = this.optimizationForm.controls['asset_group'].value;
    optInputs.exchange = this.optimizationForm.controls['exchange'].value;
    optInputs.forecast_method = this.isBPayed === "true" ? this.optimizationForm.controls['forecast_method'].value : "average";
    optInputs.opt_method = this.isBPayed === "true" ? this.optimizationForm.controls['opt_method'].value : "markowitz";
    optInputs.use_custom_period = this.optimizationForm.controls['use_custom_period'].value;
    optInputs.start_date = this.optimizationForm.controls['start_date'].value;
    optInputs.end_date = this.optimizationForm.controls['end_date'].value;
    //optInputs.save_result = this.optimizationForm.controls['save_result'].value;
    this.uiErrors = [];
    var startExists = optInputs.start_date !== "";
    var endtExists = optInputs.end_date !== ""
    var lessThan30 = startExists && endtExists && (Date.parse(optInputs.end_date) - Date.parse(optInputs.start_date)) < 30;
    if(lessThan30){
      this.uiErrors.push('Testing period should equal to or be greater than 30 days');
    };
    if(!startExists || !endtExists){
      this.uiErrors.push('Both start and end dates should be filled out');
    };
    if(lessThan30 || !startExists || !endtExists){
      //pass
    } else {
      this.optimizeApi.runOptimization(token, optInputs).pipe().subscribe(data=>{
        var status_data = JSON.stringify(data);
        var status = JSON.parse(status_data)['status'];
        var user_temp_uid =  JSON.parse(status_data)['guid'];
        localStorage.setItem('user_temp_uid', user_temp_uid);
        if(status === 'success'){
          this.router.navigate(['/#/dashboard']);
        };
      }, err => { 
          const validationErrors = err.error;
         if (err instanceof HttpErrorResponse) {
            
            if (err.status === 422) {
              this.serverErrors = err.error.message;
            }
        }
      });
    }
  }
   datesOn() {
    var yesCheck = <HTMLInputElement>document.getElementById("yes1");
    var noCheck = <HTMLInputElement>document.getElementById("no1");
    var startDate = <HTMLInputElement>document.getElementById("startdate1inp");
    var endDate = <HTMLInputElement>document.getElementById("enddate1inp");
    var startDateContainer = <HTMLInputElement>document.getElementById("startdate1");
    var endDateContainer = <HTMLInputElement>document.getElementById("enddate1");
    yesCheck.checked = true;
    noCheck.checked  = false;
    startDate.disabled = false;
    endDate.disabled = false;
    startDateContainer.style.display = 'block';
    endDateContainer.style.display = 'block';
    var max_end_date = new Date();
    var dd = String(max_end_date.getDate()).padStart(2, '0');
    var mm = String(max_end_date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = max_end_date.getFullYear();
    let max_end_date_to_display = yyyy + '-' + mm + '-' + dd;
    startDate.max = max_end_date_to_display;
    endDate.max = max_end_date_to_display;
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let year_ago = new Date();
    var dd_1 = String(year_ago.getDate()).padStart(2, '0');
    var mm_1 = String(year_ago.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy_1 = year_ago.getFullYear() - 1;
    let todayUi = yyyy + '-' + mm + '-' + dd;
    let yearAgoUi = yyyy_1 + '-' + mm_1 + '-' + dd_1;
    startDate.value = yearAgoUi;
    endDate.value = todayUi;
  }
  datesOff() {
    var yesCheck = <HTMLInputElement>document.getElementById("yes1");
    var noCheck = <HTMLInputElement>document.getElementById("no1");
    var startDate = <HTMLInputElement>document.getElementById("startdate1inp");
    var endDate = <HTMLInputElement>document.getElementById("enddate1inp");
    var startDateContainer = <HTMLInputElement>document.getElementById("startdate1");
    var endDateContainer = <HTMLInputElement>document.getElementById("enddate1");
    noCheck.checked = true;
    yesCheck.checked = false;
    startDate.disabled = true;
    endDate.disabled = true;
    startDateContainer.style.display = 'none';
    endDateContainer.style.display = 'none';
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let year_ago = new Date();
    var dd_1 = String(year_ago.getDate()).padStart(2, '0');
    var mm_1 = String(year_ago.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy_1 = year_ago.getFullYear() - 1;
    let todayUi = yyyy + '-' + mm + '-' + dd;
    let yearAgoUi = yyyy_1 + '-' + mm_1 + '-' + dd_1;
    startDate.value = yearAgoUi;
    endDate.value = todayUi;
  }
}
