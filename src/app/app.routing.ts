import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { DefaultGuard } from "./guards/default-guard.service";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";

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