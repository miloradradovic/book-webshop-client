import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from './material/material.module';
import { PagesModule } from './pages/pages.module';
import { HttpAuthInterceptor } from './interceptor/http-auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientModule,
    NgxSpinnerModule,
    MaterialModule,
    PagesModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
