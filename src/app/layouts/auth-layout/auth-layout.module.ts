import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';


import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { LoginformComponent} from '../../components/loginform/loginform.component'
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LoginformComponent,
    ForgotPasswordComponent,
  ],
  providers: [AuthService],
})
export class AuthLayoutModule { }
