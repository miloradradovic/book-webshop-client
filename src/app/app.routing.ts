import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "./guards/admin-guard.service";
import { DefaultGuard } from "./guards/default-guard.service";
import { UserGuard } from "./guards/user-guard.service";
import { OrdersDashboardComponent } from "./pages/admin/orders/orders-dashboard/orders-dashboard.component";
import { UsersDashboardComponent } from "./pages/admin/users/users-dashboard/users-dashboard.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { CartViewComponent } from "./pages/user/cart-view/cart-view.component";
import { CatalogDashboardComponent } from "./pages/user/catalog-dashboard/catalog-dashboard.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { UserAdminGuard } from "./guards/user-admin-guard.service";
import { BooksDashboardComponent } from "./pages/admin/books/books-dashboard/books-dashboard.component";
import { WritersDashboardComponent } from "./pages/admin/writers/writers-dashboard/writers-dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [DefaultGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [DefaultGuard]
  },
  {
    path: 'user',
    children: [
      {
        path: 'catalog-dashboard',
        component: CatalogDashboardComponent,
        canActivate: [UserGuard]
      },
      {
        path: 'cart-view',
        component: CartViewComponent,
        canActivate: [UserGuard]
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'orders-dashboard',
        component: OrdersDashboardComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'users-dashboard',
        component: UsersDashboardComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'books-dashboard',
        component: BooksDashboardComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'writers-dashboard',
        component: WritersDashboardComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [UserAdminGuard]
  },
  {
    path: '**',
    component: LoginComponent,
    canActivate: [DefaultGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }