import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModifyBook } from 'src/app/model/book.model';
import { Writer, WriterForSelect } from 'src/app/model/writer.model';
import { CatalogService } from 'src/app/services/catalog.service';
import { PhotoService } from 'src/app/services/photo.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';

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

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile!: File;

  writers: WriterForSelect[] = [];

  constructor(
    fb: FormBuilder,
    public router: Router,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private catalogService: CatalogService,
    public dialogRef: MatDialogRef<AddBookComponent>,
    public dialog: MatDialog,
    private photoService: PhotoService
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
    this.getAllWriters();
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

  add(): void {
    this.spinnerService.show();
    this.createBook();
  }

  createBook(): void {
    const bookData: ModifyBook = new ModifyBook(-1, this.form.value.name, this.form.value.yearReleased,
      this.form.value.recap, this.form.value.inStock, this.form.value.price, this.form.value.genres,
      this.form.value.writers);

    this.catalogService.createBook(bookData).subscribe({
      next: (result) => {
        this.upload();
      },
      error: (err) => {
        this.spinnerService.hide();
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.createBook();
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

  upload(): void {
    this.photoService.upload(this.selectedFile, this.form.value.name).subscribe({
      next: (result) => {
        this.spinnerService.hide();
        this.snackBar.open('Book was successfully created!', 'Ok', {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.spinnerService.hide();
        this.snackBar.open('Something went wrong while uploading your photo. Please try again later!', 'Ok', { duration: 3000 });
        this.deleteBook();
      }
    })
  }

  deletePhoto(): void {
    this.photoService.delete(this.form.value.name).subscribe({
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', { duration: 3000 });
      }
    })
  }

  selectedFileEvent(event: File) {
    this.selectedFile = event;
  }

  deleteBook(): void {
    this.catalogService.deleteBookByName(this.form.value.name).subscribe({
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', { duration: 3000 });
      }
    });
  }
}
