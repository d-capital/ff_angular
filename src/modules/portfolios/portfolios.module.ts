import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliosComponent } from './containers/portfolios/portfolios.component';
import { RouterModule } from '@angular/router';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Guards */
import * as portfoliosGuards from './guards';



@NgModule({
  declarations: [PortfoliosComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule,
    NavigationModule,
  ],
  providers:[
    ...portfoliosGuards.guards
  ]
})
export class PortfoliosModule { }
