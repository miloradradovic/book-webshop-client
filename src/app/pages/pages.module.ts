import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CatalogDashboardComponent } from './user/catalog-dashboard/catalog-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DetailedBookComponent } from './user/catalog-dashboard/detailed-book/detailed-book.component';
import { CartViewComponent } from './user/cart-view/cart-view.component';
import { CartItemsComponent } from './user/cart-view/cart-items/cart-items.component';
import { CatalogItemComponent } from './user/catalog-dashboard/catalog-item/catalog-item.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UsersDashboardComponent } from './admin/users/users-dashboard/users-dashboard.component';
import { OrderedItemsComponent } from './admin/orders/orders-dashboard/ordered-items/ordered-items.component';
import { OrdersDashboardComponent } from './admin/orders/orders-dashboard/orders-dashboard.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CatalogDashboardComponent,
    DetailedBookComponent,
    CartViewComponent,
    CartItemsComponent,
    CatalogItemComponent,
    ProfileComponent,
    OrdersDashboardComponent,
    UsersDashboardComponent,
    OrderedItemsComponent
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
