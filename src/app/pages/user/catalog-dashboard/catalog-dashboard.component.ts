import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book, BookCatalogData } from 'src/app/model/book.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { PhotoService } from 'src/app/services/photo.service';
import { RefreshTokenComponent } from 'src/app/shared/refresh-token/refresh-token.component';
import { DetailedBookComponent } from './detailed-book/detailed-book.component';

@Component({
  selector: 'app-catalog-dashboard',
  templateUrl: './catalog-dashboard.component.html',
  styleUrls: ['./catalog-dashboard.component.css'],
})
export class CatalogDashboardComponent implements OnInit {
  booksCatalog: BookCatalogData[] = [];
  fetchedBooks: Book[] = [];

  constructor(
    private catalogService: CatalogService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks(): void {
    this.spinnerService.show();
    this.catalogService.getAllBooks().subscribe({
      next: (result) => {
        this.fetchedBooks = result;
        let forCatalog: BookCatalogData[] = [];
        result.forEach((book: Book) => {
          let genres = '';
          let writers = '';
          book.genres.forEach((genre, index) => {
            if (genre === 'SCI_FI') {
              genre = 'SCI-FI';
            }
            genre = genre.toLowerCase();
            if (index === book.genres.length - 1) {
              genres = genres + genre;
            } else {
              genres = genres + genre + ', ';
            }
          });
          book.writers.forEach((writer, index) => {
            if (index === book.writers.length - 1) {
              writers = writers + writer.name + ' ' + writer.surname;
            } else {
              writers = writers + writer.name + ' ' + writer.surname + ', ';
            }
          });
          forCatalog.push(
            new BookCatalogData(
              book.id,
              book.name,
              book.yearReleased,
              book.recap,
              book.inStock,
              book.price,
              genres,
              writers
            )
          );
        });
        this.booksCatalog = forCatalog;
        this.getPictures();
        this.spinnerService.hide();
      },
      error: (err) => {
        this.spinnerService.hide();
        if (err.status === 403) {
          const dialogRef = this.dialog.open(RefreshTokenComponent, {});
          dialogRef.afterClosed().subscribe((result) => {
            if (result === 'refreshSuccess') {
              this.getAllBooks();
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

  getPictures(): void {
    let booksWithPhotos: BookCatalogData[] = [];
    this.booksCatalog.forEach(book => {
      this.photoService.getByName(book.name).subscribe({
        next: (result) => {
          book.photo = 'data:image/png;base64,' + result.name;
          booksWithPhotos.push(book);
        },
        error: (err) => {
          this.snackBar.open(err.error, 'Ok', { duration: 3000 });
        }
      })
      this.booksCatalog = booksWithPhotos;
    })
  }

  viewDetails(bookId: number) {
    let book!: BookCatalogData;
    this.booksCatalog.forEach((element) => {
      if (element.id === bookId) {
        book = element;
      }
    });
    const dialogRef = this.dialog.open(DetailedBookComponent, {
      width: '30%',
      data: book,
    });
  }
}
