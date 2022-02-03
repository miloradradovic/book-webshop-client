import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartForOrderPlacing, CartItem, CartItemForOrderPlacing } from 'src/app/model/cart.model';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit {

  cartItems: CartItem[] = [];
  form: FormGroup;
  toggleChecked: boolean = true;
  private fb: FormBuilder;
  finalPrice: number = 0.0;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    fb: FormBuilder,
    private storageService: StorageService,
    private orderService: OrderService,
    private dialog: MatDialog
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      address: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    let cartItemsJson = this.storageService.getStorageItem('cart');
    if (!cartItemsJson) {
      this.snackBar.open('Your cart is empty!', 'Ok', { duration: 2000 });
      this.router.navigate(['/']);
    } else {
      this.cartItems = JSON.parse(cartItemsJson);
      this.form.controls['address'].setValue('dummy');
      this.form.controls['phoneNumber'].setValue('dummy');
    }
  }

  lower(bookId: number) {
    let newCartItems: CartItem[] = [];
    let indexes: number[] = [];
    this.cartItems.forEach((element, index) => {
      if (element.book.id === bookId) {
        element.book.inStock = element.book.inStock + 1;
        let newAmount = element.amount - 1;
        if (newAmount === 0) {
          indexes.push(index);
        } else {
          element.amount = newAmount;
        }
      }
      newCartItems.push(element);
    })
    indexes.forEach(index => {
      newCartItems.splice(index, 1);
    })
    this.cartItems = newCartItems;
    this.generateFinalPrice();
    if (this.cartItems.length === 0) {
      this.storageService.removeStorageItem('cart');
      this.snackBar.open('Your cart is empty!', 'Ok', { duration: 5000 });
      this.router.navigate(['/']);
    } else {
      this.storageService.setStorageItem('cart', JSON.stringify(this.cartItems));
    }
  }

  grow(bookId: number) {
    let newCartItems: CartItem[] = [];
    this.cartItems.forEach(element => {
      if (element.book.id === bookId) {
        element.book.inStock = element.book.inStock - 1;
        element.amount = element.amount + 1;
      }
      newCartItems.push(element);
    })
    this.cartItems = newCartItems;
    this.generateFinalPrice();
  }

  changedMatStep(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      this.generateFinalPrice();
    } else {
      this.finalPrice = 0.0;
    }
  }

  generateFinalPrice(): void {
    this.finalPrice = 0.0;
    this.cartItems.forEach(cartItem => {
      let itemPrice = this.calculateItemPrice(cartItem.amount, cartItem.book.price);
      this.finalPrice = this.finalPrice + itemPrice;
    })
    this.finalPrice = Math.round(this.finalPrice * 100) / 100
  }

  calculateItemPrice(amount: number, price: number): number {
    return amount * price;
  }

  toggleChange(): void {
    if (this.toggleChecked) {
      this.toggleChecked = false;
      this.form.controls['address'].setValue('');
      this.form.controls['phoneNumber'].setValue('');
    } else {
      this.toggleChecked = true;
      this.form.controls['address'].setValue('dummy');
      this.form.controls['phoneNumber'].setValue('dummy');
    }
  }

  placeOrder(): void {
    this.spinnerService.show();
    let cartItemsForOrder: CartItemForOrderPlacing[] = [];
    this.cartItems.forEach(cartItem => {
      let cartItemForOrder: CartItemForOrderPlacing = new CartItemForOrderPlacing(
        cartItem.book.id,
        cartItem.amount
      )
      cartItemsForOrder.push(cartItemForOrder);
    })
    let cartForOrder: CartForOrderPlacing = new CartForOrderPlacing(
      cartItemsForOrder,
      this.toggleChecked,
      this.form.value.address,
      this.form.value.phoneNumber,
      this.finalPrice
    );
    this.orderService.create(cartForOrder).subscribe({
      next: (result) => {
        this.spinnerService.hide();
        this.snackBar.open("Order was successfully placed!", 'Ok', { duration: 5000 });
        this.storageService.removeStorageItem('cart');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.spinnerService.hide();
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.placeOrder();
            } else if (result === 'refreshFail') {
              this.router.navigate(['/']);
            } else if (result === 'logout') {
              this.router.navigate(['/']);
            }
          })
        } else {
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
        }
      }
    });
  }

}
