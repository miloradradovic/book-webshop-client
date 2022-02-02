import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book, ModifyBook } from 'src/app/model/book.model';
import { User } from 'src/app/model/user.model';
import { Writer, WriterForSelect } from 'src/app/model/writer.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { EditUserComponent } from '../../users/edit-user/edit-user.component';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  form: FormGroup;
  private fb: FormBuilder;
  book!: Book;
  modifyBook: ModifyBook = new ModifyBook(1, '', 0, '', 0, 0, [], []);
  genres: any[] = [
    { originalName: 'SCI_FI', name: 'sci fi' },
    { originalName: 'ROMANTIC', name: 'romantic' },
    { originalName: 'COMEDY', name: 'comedy' },
    { originalName: 'TRAGEDY', name: 'tragedy' },
    { originalName: 'SCIENCE', name: 'science' },
  ];
  writers: WriterForSelect[] = [];


  constructor(
    fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private catalogService: CatalogService,
    public dialogRef: MatDialogRef<EditBookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      name: [null, []],
      yearReleased: [null, []],
      recap: [null, [Validators.maxLength(150)]],
      inStock: [null, []],
      price: [null, []],
      genres: [[], []],
      writers: [[], []]
    });
  }

  ngOnInit(): void {
    this.getAllWriters();
    this.initializeFields();
  }

  initializeFields(): void {
    this.book = this.data;
    this.form.controls['name'].setValue(this.book.name);
    this.form.controls['yearReleased'].setValue(this.book.yearReleased);
    this.form.controls['recap'].setValue(this.book.recap);
    this.form.controls['inStock'].setValue(this.book.inStock);
    this.form.controls['price'].setValue(this.book.price);
    this.form.controls['genres'].setValue(this.book.genres);
    let writers: number[] = [];
    this.book.writers.forEach(writer => {
      writers.push(writer.id);
    })
    this.form.controls['writers'].setValue(writers);
  }

  checkFields(): boolean {
    if (
      this.form.value.name === this.book.name &&
      this.form.value.yearReleased === this.book.yearReleased &&
      this.form.value.recap === this.book.recap &&
      this.form.value.inStock === this.book.inStock &&
      this.form.value.price === this.book.price &&
      this.form.value.genres.length === 0 && this.form.value.writers.length === 0
    ) {
      return false;
    }
    return true;
  }

  fillOutEmptyFields(): boolean {
    let emptyName: boolean = false;
    let emptyYearReleased: boolean = false;
    let emptyRecap: boolean = false;
    let emptyInStock: boolean = false;
    let emptyPrice: boolean = false;
    let emptyGenres: boolean = false;
    let emptyWriters: boolean = false;

    if (!this.form.value.name) {
      emptyName = true;
      this.modifyBook.name = this.book.name;
    } else {
      this.modifyBook.name = this.form.value.name;
    }

    if (!this.form.value.yearReleased) {
      emptyYearReleased = true;
      this.modifyBook.yearReleased = this.book.yearReleased;
    } else {
      this.modifyBook.yearReleased = this.form.value.yearReleased;
    }

    if (!this.form.value.recap) {
      emptyRecap = true;
      this.modifyBook.recap = this.book.recap;
    } else {
      this.modifyBook.recap = this.form.value.recap;
    }

    if (!this.form.value.inStock) {
      emptyInStock = true;
      this.modifyBook.inStock = this.book.inStock;
    } else {
      this.modifyBook.inStock = this.form.value.inStock;
    }

    if (!this.form.value.price) {
      emptyPrice = true;
      this.modifyBook.price = this.book.price;
    } else {
      this.modifyBook.price = this.form.value.price;
    }

    if (this.form.value.genres.length === 0) {
      emptyGenres = true;
      this.modifyBook.genres = this.book.genres;
    } else {
      this.modifyBook.genres = this.form.value.genres;
    }

    if (this.form.value.writers.length === 0) {
      emptyWriters = true;
      let writers: number[] = [];
      this.book.writers.forEach(writer => {
        writers.push(writer.id);
      })
      this.modifyBook.writerIds = writers;
    } else {
      this.modifyBook.writerIds = this.form.value.writers;
    }

    this.modifyBook.id = this.book.id;

    if (
      emptyName &&
      emptyYearReleased &&
      emptyRecap &&
      emptyInStock &&
      emptyPrice &&
      emptyGenres &&
      emptyWriters
    ) {
      return false;
    }
    return true;
  }

  getAllWriters(): void {
    this.catalogService.getAllWriters().subscribe({
      next: (result) => {
        let newWriters: WriterForSelect[] = [];
        let writers: Writer[] = result;
        writers.forEach(writer => {
          let writerForSelect: WriterForSelect = new WriterForSelect(writer.id, writer.name + ' ' + writer.surname);
          newWriters.push(writerForSelect);
        })
        this.writers = newWriters;
      },
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', { duration: 3000 });
      }
    })
  }

  edit(): void {
    this.spinnerService.show();
    if (this.checkFields() && this.fillOutEmptyFields()) {
      console.log(this.modifyBook);
      this.catalogService.editBook(this.modifyBook).subscribe({
        next: (result) => {
          this.spinnerService.hide();
          this.snackBar.open('Book was successfully updated.', 'Ok', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.spinnerService.hide();
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
          this.initializeFields();
        },
      });
    } else {
      this.spinnerService.hide();
      this.snackBar.open("You haven't changed anything!", 'Ok', {
        duration: 3000,
      });
    }
  }

}
