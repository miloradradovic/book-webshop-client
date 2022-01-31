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
import { CartViewComponent } from './user/cart-view/cart-view.component';
import { CartItemsComponent } from './user/cart-view/cart-items/cart-items.component';
import { CatalogItemComponent } from './user/catalog-dashboard/catalog-item/catalog-item.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CatalogDashboardComponent,
    DetailedBookComponent,
    CartViewComponent,
    CartItemsComponent,
    CatalogItemComponent
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
