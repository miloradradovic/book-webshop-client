import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationUserComponent } from './navigation/navigation-user/navigation-user.component';
import { NavigationAdminComponent } from './navigation/navigation-admin/navigation-admin.component';
import { NavigationUnauthenticatedComponent } from './navigation/navigation-unauthenticated/navigation-unauthenticated.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TableComponent } from './table/table.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { CatalogItemComponent } from './catalog-item/catalog-item.component';



@NgModule({
  declarations: [
    NavigationUserComponent,
    NavigationAdminComponent,
    NavigationUnauthenticatedComponent,
    NavigationComponent,
    TableComponent,
    CatalogItemComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavigationAdminComponent,
    NavigationComponent,
    NavigationUserComponent, 
    NavigationUnauthenticatedComponent,
    TableComponent,
    CatalogItemComponent
  ]
})
export class SharedModule { }
