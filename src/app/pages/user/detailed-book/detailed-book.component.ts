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
  }

  addToCart(): void {
    let cartString = sessionStorage.getItem('cart');
    if (cartString) {
      let cartItems: CartItem[] = JSON.parse(cartString);
      let found: boolean = false;
      cartItems.forEach((cartItem) => {
        if (cartItem.book.id === this.book.id) {
          found = true;
          cartItem.amount = cartItem.amount + this.form.value.amount;
        }
        if (!found) {
          let cartItem = new CartItem(this.book, this.form.value.amount);
          cartItems.push(cartItem);
        }
        this.storageService.setStorageItem('cart', JSON.stringify(cartItems));
      })
    } else {
      let cartItem = new CartItem(this.book, this.form.value.amount);
      let cartItems: CartItem[] = [];
      cartItems.push(cartItem);
      this.storageService.setStorageItem('cart', JSON.stringify(cartItems));
    }
    this.snackBar.open("Cart was updated!", 'Ok', {duration: 5000});
    this.dialogRef.close(true);
  }

}
