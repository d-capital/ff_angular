import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { PortfoliosComponent } from '../../pages/portfolios/portfolios.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment as env } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { IsLoggedInService } from 'src/app/services/guards/is-logged-in.service';
import { SinglePortfolioComponent } from 'src/app/pages/single-portfolio/single-portfolio/single-portfolio.component';
import { OptimizationComponent } from 'src/app/pages/optimization/optimization.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentsModule } from '../../components/components.module';
import { OptimizeApiService } from 'src/app/services/optimize.service';
import { LocationService } from 'src/app/services/location.service';
import { TasksApiService } from 'src/app/services/tasks.services';
import { ResultsApiService } from 'src/app/services/results.service';
import { UserProfileApiService } from 'src/app/services/user-profile.service';
import { isBPayedService } from 'src/app/services/guards/is-plan-b-payed.service';
import { PatreonProcessingComponent } from 'src/app/pages/patreon-processing/patreon-processing.component';
import { W8benComponentComponent } from 'src/app/pages/w8ben-component/w8ben-component.component';

// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    MatFormFieldModule,
    MatInputModule,
    ComponentsModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    PortfoliosComponent,
    SinglePortfolioComponent,
    OptimizationComponent,
    PatreonProcessingComponent,
    W8benComponentComponent
  ],
  providers: [
    AuthService, 
    IsLoggedInService, 
    OptimizeApiService, 
    LocationService,
    TasksApiService, 
    ResultsApiService, 
    UserProfileApiService,
    isBPayedService,
  ],
})

export class AdminLayoutModule {}
