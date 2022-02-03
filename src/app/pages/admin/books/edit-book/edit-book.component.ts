import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book, ModifyBook } from 'src/app/model/book.model';
import { User } from 'src/app/model/user.model';
import { Writer, WriterForSelect } from 'src/app/model/writer.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';
import { EditUserComponent } from '../../users/edit-user/edit-user.component';
import { EditWriterComponent } from '../../writers/edit-writer/edit-writer.component';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  form: FormGroup;
  private fb: FormBuilder;
  book!: Book;
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
    private dialog: MatDialog,
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
      this.equalArrays(this.form.value.genres, this.book.genres) && this.equalArrays(this.form.value.writers, this.getWriterIds())
    ) {
      return false;
    }
    return true;
  }

  getWriterIds(): number[] {
    let writerIds: number[] = [];
    this.book.writers.forEach(element => {
      writerIds.push(element.id);
    })
    return writerIds;
  }

  equalArrays(array1: any[], array2: any[]): boolean {
    if (array1.length === array2.length) {
      return array1.every((element, index) => {
        if (element === array2[index]) {
          return true;
        }

        return false;
      });
    }

    return false;
  }

  fillOutEmptyFields(): void {

    if (!this.form.value.name) {
      this.form.controls['name'].setValue(this.book.name);
    }

    if (!this.form.value.yearReleased) {
      this.form.controls['yearReleased'].setValue(this.book.yearReleased);
    }

    if (!this.form.value.recap) {
      this.form.controls['recap'].setValue(this.book.recap);
    }

    if (!this.form.value.inStock) {
      this.form.controls['inStock'].setValue(this.book.inStock);
    }

    if (!this.form.value.price) {
      this.form.controls['price'].setValue(this.book.price);
    }

    if (this.form.value.genres.length === 0) {
      this.form.controls['genres'].setValue(this.book.genres);
    }

    if (this.form.value.writers.length === 0) {
      let writers: number[] = [];
      this.book.writers.forEach(writer => {
        writers.push(writer.id);
      })
      this.form.controls['writers'].setValue(writers);
    }
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
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.getAllWriters();
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
    })
  }

  prepareEdit(): void {
    this.spinnerService.show();
    this.fillOutEmptyFields();
    if (this.checkFields()) {
      this.edit();
    } else {
      this.spinnerService.hide();
      this.snackBar.open("You haven't changed anything!", 'Ok', {
        duration: 3000,
      });
    }
  }

  edit() {
    this.catalogService.editBook(new ModifyBook(this.book.id, this.form.value.name, this.form.value.yearReleased,
      this.form.value.recap, this.form.value.inStock, this.form.value.price, this.form.value.genres,
      this.form.value.writers)).subscribe({
        next: (result) => {
          this.spinnerService.hide();
          this.snackBar.open('Book was successfully updated.', 'Ok', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.spinnerService.hide();
          if (err.status === 403) {
            const dialogRef = this.dialog.open(RefreshTokenComponent, {});
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'refreshSuccess') {
                this.edit();
              } else if (result === 'refreshFail') {
                this.router.navigate(['/']);
              } else if (result === 'logout') {
                this.router.navigate(['/']);
              }
            })
          } else {
            this.snackBar.open(err.error, 'Ok', { duration: 3000 });
            this.initializeFields();
          }
        },
      });
  }

}
