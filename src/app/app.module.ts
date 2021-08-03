import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import {PortfoliosApiService} from './pages/portfolios/portfolios.service';

import { environment as env } from '../environments/environment';
import { domain } from 'process';
import { AuthService } from './services/auth.service';
import { IsNotLoggedInService } from './services/guards/is-not-logged-in.service';
import { IsLoggedInService } from './services/guards/is-logged-in.service';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  providers: [PortfoliosApiService, AuthService, IsNotLoggedInService, IsLoggedInService],
  bootstrap: [AppComponent]
})
export class AppModule { }
