/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { PortfoliosModule } from './portfolios.module';
/* Containers */


/* Guards */

import { SBRouteData } from '@modules/navigation/models';

/* Routes */
export const ROUTES: Routes = [
    {
        path: 'dashboard',
        pathMatch: 'full',
        redirectTo: 'portfolios',
    },
];

@NgModule({
    imports: [PortfoliosModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class PortfoliosRoutingModule {}