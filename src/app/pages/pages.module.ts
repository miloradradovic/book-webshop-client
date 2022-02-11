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
import { ProfileComponent } from './profile/profile.component';
import { UsersDashboardComponent } from './admin/users/users-dashboard/users-dashboard.component';
import { OrderedItemsComponent } from './admin/orders/orders-dashboard/ordered-items/ordered-items.component';
import { OrdersDashboardComponent } from './admin/orders/orders-dashboard/orders-dashboard.component';
import { EditUserComponent } from './admin/users/edit-user/edit-user.component';
import { AddUserComponent } from './admin/users/add-user/add-user.component';
import { BooksDashboardComponent } from './admin/books/books-dashboard/books-dashboard.component';
import { AddBookComponent } from './admin/books/add-book/add-book.component';
import { EditBookComponent } from './admin/books/edit-book/edit-book.component';
import { AddWriterComponent } from './admin/writers/add-writer/add-writer.component';
import { WritersDashboardComponent } from './admin/writers/writers-dashboard/writers-dashboard.component';
import { EditWriterComponent } from './admin/writers/edit-writer/edit-writer.component';



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
    OrderedItemsComponent,
    EditUserComponent,
    AddUserComponent,
    BooksDashboardComponent,
    AddBookComponent,
    EditBookComponent,
    AddWriterComponent,
    WritersDashboardComponent,
    EditWriterComponent
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
