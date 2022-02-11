import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book, ModifyBook } from 'src/app/model/book.model';
import { Writer, WriterForSelect } from 'src/app/model/writer.model';
import { CatalogService } from 'src/app/services/catalog.service';
import { PhotoService } from 'src/app/services/photo.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';

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
    @Inject(MAT_DIALOG_DATA) public data: Book,
    private photoService: PhotoService
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

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile!: File;
  photo: string = '';

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
    this.getPhotoByName(this.book.name);
  }

  getPhotoByName(name: string) {
    this.photoService.getByName(name).subscribe({
      next: (result) => {
        if (result.name) {
          this.photo = 'data:image/png;base64,' + result.name;
        }
      },
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', { duration: 3000 });
      }
    })
  }

  selectedFileEvent(event: File) {
    this.selectedFile = event;
  }

  checkFields(): boolean {
    if (
      this.form.value.name === this.book.name &&
      this.form.value.yearReleased === this.book.yearReleased &&
      this.form.value.recap === this.book.recap &&
      this.form.value.inStock === this.book.inStock &&
      this.form.value.price === this.book.price &&
      this.equalArrays(this.form.value.genres, this.book.genres) && this.equalArrays(this.form.value.writers, this.getWriterIds()) &&
      !this.selectedFile
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

  upload() {
    if (!this.selectedFile) {
      this.spinnerService.hide();
      this.snackBar.open('Book was successfully edited!', 'Ok', { duration: 3000 });
      this.dialogRef.close(true);
    } else {
      this.photoService.upload(this.selectedFile, this.form.value.name).subscribe({
        next: (result) => {
          this.spinnerService.hide();
          this.snackBar.open('Book was successfully edited!', 'Ok', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.spinnerService.hide();
          this.snackBar.open('Something went wrong while uploading the photo. Please try again later!', 'Ok', { duration: 3000 });
          this.undoBookChanges();
        }
      })
    }
  }

  edit() {
    this.catalogService.editBook(new ModifyBook(this.book.id, this.form.value.name, this.form.value.yearReleased,
      this.form.value.recap, this.form.value.inStock, this.form.value.price, this.form.value.genres,
      this.form.value.writers)).subscribe({
        next: (result) => {
          this.upload();
        },
        error: (err) => {
          this.spinnerService.hide();
          if (err.status === 403) {
            const dialogRef = this.dialog.open(RefreshTokenComponent, {});
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'refreshSuccess') {
                this.edit();
              } else if (result === 'refreshFail') {
                this.deletePhoto();
                this.router.navigate(['/']);
              } else if (result === 'logout') {
                this.deletePhoto();
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

  convertWritersToWriterIds(writers: Writer[]): number[] {
    let writerIds: number[] = []
    writers.forEach(element => {
      writerIds.push(element.id);
    })
    return writerIds;
  }

  undoBookChanges(): void {
    this.catalogService.editBook(new ModifyBook(this.book.id, this.book.name, this.book.yearReleased,
      this.book.recap, this.book.inStock, this.book.price, this.book.genres,
      this.convertWritersToWriterIds(this.book.writers))).subscribe({
        error: (err) => {
          if (err.status === 403) {
            const dialogRef = this.dialog.open(RefreshTokenComponent, {});
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'refreshSuccess') {
                this.undoBookChanges();
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

  deletePhoto(): void {
    if (this.selectedFile) {
      this.photoService.delete(this.book.name).subscribe({
        error: (err) => {
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
        }
      })
    }
  }

}
