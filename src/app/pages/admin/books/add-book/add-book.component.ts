import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModifyBook } from 'src/app/model/book.model';
import { RegisterData } from 'src/app/model/register.model';
import { Writer, WriterForSelect } from 'src/app/model/writer.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { AddUserComponent } from '../../users/add-user/add-user.component';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;

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
    public dialogRef: MatDialogRef<AddBookComponent>
  ) {
    this.fb = fb;
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      yearReleased: [null, [Validators.required]],
      recap: [null, [Validators.required, Validators.maxLength(150)]],
      inStock: [null, [Validators.required]],
      price: [null, [Validators.required]],
      genres: [[], [Validators.required]],
      writers: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
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

  add(): void {
    this.spinnerService.show();
    const bookData: ModifyBook = new ModifyBook(-1, this.form.value.name, this.form.value.yearReleased,
      this.form.value.recap, this.form.value.inStock, this.form.value.price, this.form.value.genres,
      this.form.value.writers);
    console.log(bookData);

    this.catalogService.createBook(bookData).subscribe({
      next: (result) => {
        this.spinnerService.hide();
        this.snackBar.open('Book was successfully created!', 'Ok', {
          duration: 5000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.spinnerService.hide();
        this.snackBar.open(err.error, 'Ok', { duration: 3000 });
      },
    });

  }
}
