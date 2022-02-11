import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartItem } from 'src/app/model/cart.model';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {

  @Input() cartItems!: CartItem[];
  @Output() lower = new EventEmitter<number>();
  @Output() grow = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  lowerInStock(bookId: number) {
    this.lower.emit(bookId);
  }

  growInStock(bookId: number) {
    this.grow.emit(bookId);
  }

}
