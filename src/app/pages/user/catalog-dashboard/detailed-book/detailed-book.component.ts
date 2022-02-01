import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookCatalogData } from 'src/app/model/book.model';
import { Cart, CartItem } from 'src/app/model/cart.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-detailed-book',
  templateUrl: './detailed-book.component.html',
  styleUrls: ['./detailed-book.component.css']
})
export class DetailedBookComponent implements OnInit {

  form: FormGroup;
  private fb: FormBuilder;
  book!: BookCatalogData;
  bookAmountInCart: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DetailedBookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookCatalogData,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    fb: FormBuilder
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });
   }

  ngOnInit(): void {
    this.book = this.data;
    this.checkCart();
  }

  checkCart(): void {
    let cartItemsJson = this.storageService.getStorageItem('cart');
    if (cartItemsJson) {
      let cartItems: CartItem[] = JSON.parse(cartItemsJson);
      cartItems.forEach(cartItem => {
        if (cartItem.book.id === this.book.id) {
          this.bookAmountInCart = cartItem.amount;
        }
      })
    }
  }

  addToCart(): void {
    let cartString = this.storageService.getStorageItem('cart');
    console.log(cartString);
    if (cartString) {
      let cartItems: CartItem[] = JSON.parse(cartString);
      let found: boolean = false;
      let inStockError: boolean = false;
      cartItems.forEach((cartItem) => {
        if (cartItem.book.id === this.book.id) {
          found = true;
          let newAmount = cartItem.amount + this.form.value.amount;
          if (newAmount > cartItem.book.inStock) {
            inStockError = true;
            this.snackBar.open("The amount you are trying to order is greater than in stock!", 'Ok', {duration: 5000});
          } else {
            cartItem.amount = newAmount;
            this.snackBar.open("Cart was updated!", 'Ok', {duration: 5000});
            this.dialogRef.close();
          }
        }
        if (!found) {
          let cartItem = new CartItem(this.book, this.form.value.amount);
          cartItems.push(cartItem);
          this.storageService.setStorageItem('cart', JSON.stringify(cartItems));
          this.snackBar.open("Cart was updated!", 'Ok', {duration: 5000});
          this.dialogRef.close(true);
        } else if (!inStockError) {
          this.storageService.setStorageItem('cart', JSON.stringify(cartItems));
          this.snackBar.open("Cart was updated!", 'Ok', {duration: 5000});
          this.dialogRef.close(true);
        }
      })
    } else {
      let cartItem = new CartItem(this.book, this.form.value.amount);
      let cartItems: CartItem[] = [];
      cartItems.push(cartItem);
      this.storageService.setStorageItem('cart', JSON.stringify(cartItems));
      this.snackBar.open("Cart was updated!", 'Ok', {duration: 5000});
      this.dialogRef.close(true);
    }
  }

}
