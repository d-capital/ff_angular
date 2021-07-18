import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { CantRegisterService } from '../../services/guards/cant-register.service';

export const AuthLayoutRoutes: Routes = [
    { 
        path: 'login',
        component: LoginComponent 
    },
    { 
        path: 'register',
        component: RegisterComponent,
        canActivate: [CantRegisterService]
    }
];
