import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { IsNotLoggedInService } from '../../services/guards/is-not-logged-in.service';
import { isBPayedService } from 'src/app/services/guards/is-plan-b-payed.service';

export const AuthLayoutRoutes: Routes = [
    { 
        path: 'login',
        component: LoginComponent 
    },
    { 
        path: 'register',
        component: RegisterComponent,
        canActivate: [IsNotLoggedInService]
    },
    { 
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [IsNotLoggedInService]
    }
];
