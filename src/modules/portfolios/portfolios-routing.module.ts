/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SBRouteData } from '@modules/navigation/models';

/* Module */
import { PortfoliosModule } from './portfolios.module';
/* Containers */


/* Guards */
import * as portfoliosGuards from './guards';



/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        pathMatch: 'full',
        redirectTo: 'portfolios',
        data: {
            title: 'Portfolios - manage your portfolios',
            breadcrumbs: [
                {
                    text: 'Portfolios',
                    active: true,
                },
            ]
        } as SBRouteData,
        component: PortfoliosModule,
    },
];

@NgModule({
    imports: [PortfoliosModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class PortfoliosRoutingModule {}