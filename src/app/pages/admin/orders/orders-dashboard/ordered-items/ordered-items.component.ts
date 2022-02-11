import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderedItem } from 'src/app/model/order.model';

@Component({
  selector: 'app-ordered-items',
  templateUrl: './ordered-items.component.html',
  styleUrls: ['./ordered-items.component.css']
})
export class OrderedItemsComponent implements OnInit {

  dataSource = new MatTableDataSource();
  orderedItems: OrderedItem[] = [];
  columnsToDisplay: string[] = ['Name', 'Unit price', 'Amount', 'Final price'];
  columnsToIterate: string[] = ['name', 'amount', 'price', 'amount', 'finalPrice'];

  constructor(
    public dialogRef: MatDialogRef<OrderedItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderedItem[]
  ) { }

  ngOnInit(): void {
    this.orderedItems = this.data;

    this.orderedItems.forEach(orderedItem => {
      orderedItem.finalPrice = orderedItem.amount * orderedItem.price;
    })

    this.dataSource.data = this.orderedItems;
  }

}
