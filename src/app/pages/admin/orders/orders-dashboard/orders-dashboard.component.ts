import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from 'src/app/model/order.model';
import { OrderService } from 'src/app/services/order.service';
import { timer, Subscription } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OrderedItemsComponent } from './ordered-items/ordered-items.component';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css']
})
export class OrdersDashboardComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource();
  orders: Order[] = [];
  subscription!: Subscription;
  columnsToDisplay: string[] = ['Status', 'Address', 'Phone number', 'Final price (RSD)', 'View ordered items'];
  columnsToIterate: string[] = ['orderStatus', 'address', 'phoneNumber', 'finalPrice'];


  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription = timer(0, 20000).pipe(
          switchMap(() => this.orderService.getAll())
        ).subscribe({
          next: (result) => {
            let newOrders: Order[] = result;
            newOrders.forEach(order => {
              if (order.orderStatus === 'NOT_ACCEPTED') {
                order.orderStatus = 'NOT ACCEPTED'
              }
            })
            this.orders = newOrders;
            this.dataSource.data = this.orders;
          },
          error: (err) => {
            this.snackBar.open(err.error, 'Ok', {duration: 2000});
          }
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewOrderedItems(orderId: number) {
    let orderForDialog!: Order;
    this.orders.forEach(order => {
      if (order.id === orderId) {
        orderForDialog = order;
      }
    })
    const dialogRef = this.dialog.open(OrderedItemsComponent, {
      width: '50%',
      height: '50%',
      data: orderForDialog.orderedItems,
    });
  }
}
