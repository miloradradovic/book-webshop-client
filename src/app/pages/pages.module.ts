import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CatalogDashboardComponent } from './user/catalog-dashboard/catalog-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DetailedBookComponent } from './user/detailed-book/detailed-book.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CatalogDashboardComponent,
    DetailedBookComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class PagesModule { }
