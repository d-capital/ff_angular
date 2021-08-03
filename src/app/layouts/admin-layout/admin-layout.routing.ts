import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { PortfoliosComponent } from '../../pages/portfolios/portfolios.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { IsLoggedInService } from '../../services/guards/is-logged-in.service';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'portfolios',     component: PortfoliosComponent, canActivate: [IsLoggedInService] }
];
