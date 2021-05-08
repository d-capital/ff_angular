import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliosComponent } from './portfolios/portfolios.component';

/* Guards */
import * as portfoliosGuards from './guards';

@NgModule({
  declarations: [PortfoliosComponent],
  imports: [
    CommonModule
  ],
  providers:[
    ...portfoliosGuards.guards
  ]
})
export class PortfoliosModule { }
