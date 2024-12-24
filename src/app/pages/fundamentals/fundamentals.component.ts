import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FundamentalsService } from 'src/app/services/fundamentals.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import { FundamentalsInput } from 'src/app/models/fundamentals-inputs';

@Component({
  selector: 'app-fundamentals',
  templateUrl: './fundamentals.component.html',
  styleUrls: ['./fundamentals.component.css']
})
export class FundamentalsComponent implements OnInit {
  public fundamentalAnalysis: string = 'Результаты анализа будут тут.';
  public selectedPair:string;
  serverErrors=[];
  uiErrors = [];
  fundamentalsInput: FundamentalsInput = new FundamentalsInput ('');
  fundamentalsForm: FormGroup;


  constructor(
    private fundamentalsService: FundamentalsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fundamentalsForm = this.fb.group({
        currencyPair: new FormControl('EURUSD',[Validators.required])
    });
  }

  getFundamentalAnalysis():void {
    this.selectedPair = this.fundamentalsForm.controls['currencyPair'].value;
    document.getElementById('mbc-spinner').setAttribute('style','display:block');
    this.fundamentalAnalysis = 'Результаты анализа будут тут.'
    this.fundamentalsService.getFundamentals(this.selectedPair).pipe().subscribe(data=>{
        console.log('data loaded');
        this.fundamentalAnalysis = this.formatText(data['analysis']);
        document.getElementById('mbc-spinner').setAttribute('style','display:none');  
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

  formatText(rawText: string): string {
    if (!rawText) return '';
    const boldedText = rawText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Split text into paragraphs using double newlines or custom logic
    const paragraphs = boldedText.split(/\n{2,}/);
  
    // Wrap each paragraph with a <p> tag
    return paragraphs.map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
  }

}
