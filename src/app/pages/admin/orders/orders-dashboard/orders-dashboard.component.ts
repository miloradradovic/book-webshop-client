import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from 'src/app/model/order.model';
import { OrderService } from 'src/app/services/order.service';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OrderedItemsComponent } from './ordered-items/ordered-items.component';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';
import { getLocaleExtraDayPeriods } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css'],
})
export class OrdersDashboardComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource();
  orders: Order[] = [];
  subscription!: Subscription;
  columnsToDisplay: string[] = [
    'Status',
    'Address',
    'Phone number',
    'Final price (RSD)',
    'View ordered items',
  ];
  columnsToIterate: string[] = [
    'orderStatus',
    'address',
    'phoneNumber',
    'finalPrice',
  ];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.subscription = timer(0, 20000)
      .pipe(switchMap(() => this.orderService.getAll()))
      .subscribe({
        next: (result) => {
          let newOrders: Order[] = result;
          newOrders.forEach((order) => {
            if (order.orderStatus === 'NOT_ACCEPTED') {
              order.orderStatus = 'NOT ACCEPTED';
            }
          });
          this.orders = newOrders;
          this.dataSource.data = this.orders;
        },
        error: (err) => {
          if (err.status === 403) {
            const dialogRef = this.dialog.open(RefreshTokenComponent, {});
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'refreshSuccess') {
                this.getOrders();
              } else if (result === 'refreshFail') {
                this.router.navigate(['/']);
              } else if (result === 'logout') {
                this.router.navigate(['/']);
              }
            })
          } else {
            this.snackBar.open(err.error, 'Ok', { duration: 3000 });
          }
        },
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewOrderedItems(orderId: number) {
    let orderForDialog!: Order;
    this.orders.forEach((order) => {
      if (order.id === orderId) {
        orderForDialog = order;
      }
    });
    const dialogRef = this.dialog.open(OrderedItemsComponent, {
      data: orderForDialog.orderedItems,
    });
  }
}
