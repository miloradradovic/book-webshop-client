import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book, BookCatalogData } from 'src/app/model/book.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { DetailedBookComponent } from '../detailed-book/detailed-book.component';

@Component({
  selector: 'app-catalog-dashboard',
  templateUrl: './catalog-dashboard.component.html',
  styleUrls: ['./catalog-dashboard.component.css']
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
    private spinnerService: NgxSpinnerService
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
        console.log(this.fetchedBooks);
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
          })
          forCatalog.push(new BookCatalogData(book.id, book.name, book.yearReleased, book.recap, book.inStock, book.price, genres, writers));
        });
        this.booksCatalog = forCatalog;
        this.spinnerService.hide();
      },
      error: (err) => {
        this.spinnerService.hide();
        if (err.error.status === 403) {
          this.snackBar.open('Your session has expired. Please log in again!', 'Ok', {duration: 2000});
          this.authService.logOut();
          this.router.navigate(['/']);
        } else {
          this.snackBar.open(err.error, 'Ok', {duration: 2000});
        }
      }
    });
  }

  viewDetails(bookId: number) {
    let book!: BookCatalogData;
    this.booksCatalog.forEach((element) => {
      if (element.id === bookId) {
        book = element;
      }
    })
    const dialogRef = this.dialog.open(DetailedBookComponent, {
      width: '50%',
      height: '50%',
      data: book,
    });
  }

}
