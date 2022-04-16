import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment as env } from '../../environments/environment';
import { LoadingComponent } from './loading/loading.component';
import { AuthService } from '../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthbuttonComponent } from './authbutton/authbutton.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TaskStatusComponent } from './task-status/task-status.component';
import { LoaderOverlayComponent } from './loader-overlay/loader-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoadingComponent,
    AuthbuttonComponent,
    TaskStatusComponent,
    LoaderOverlayComponent

  ],
  providers: [AuthService],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TaskStatusComponent,
    LoaderOverlayComponent
  ]
})
export class ComponentsModule { }
