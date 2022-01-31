import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { DefaultGuard } from "./guards/default-guard.service";
import { UserGuard } from "./guards/user-guard.service";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { CartViewComponent } from "./pages/user/cart-view/cart-view.component";
import { CatalogDashboardComponent } from "./pages/user/catalog-dashboard/catalog-dashboard.component";
import { ProfileComponent } from "./pages/user/profile/profile.component";

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
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [UserGuard]
      }
    ]
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