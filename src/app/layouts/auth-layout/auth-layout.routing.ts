import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { IsNotLoggedInService } from '../../services/guards/is-not-logged-in.service';

export const AuthLayoutRoutes: Routes = [
    { 
        path: 'login',
        component: LoginComponent 
    },
    { 
        path: 'register',
        component: RegisterComponent,
        canActivate: [IsNotLoggedInService]
    }
];
