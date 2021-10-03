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
    OptimizationComponent
  ],
  providers: [AuthService, IsLoggedInService, OptimizeApiService],
})

export class AdminLayoutModule {}
