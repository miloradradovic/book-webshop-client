import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Book } from 'src/app/model/book.model';
import { CatalogService } from 'src/app/services/catalog.service';
import { AddBookComponent } from '../add-book/add-book.component';
import { EditBookComponent } from '../edit-book/edit-book.component';

@Component({
  selector: 'app-books-dashboard',
  templateUrl: './books-dashboard.component.html',
  styleUrls: ['./books-dashboard.component.css'],
})
export class BooksDashboardComponent implements OnInit {
  dataSource = new MatTableDataSource();
  books: Book[] = [];
  columnsToDisplay: string[] = [
    'Name',
    'Released in',
    'Price (RSD)',
    'Recap',
    'In stock',
    'Genres',
    'Written by',
    'Edit',
    'Delete',
  ];
  columnsToIterate: string[] = [
    'name',
    'yearReleased',
    'price',
    'recap',
    'inStock',
    'genresString',
    'writersString',
  ];

  constructor(
    private catalogService: CatalogService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks() {
    this.catalogService.getAllBooks().subscribe({
      next: (result) => {
        let bookList: Book[] = result;
        bookList.forEach((book) => {
          let genres = '';
          let writers = '';
          book.genres.forEach((genre, index) => {
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
          if (book.recap.length > 100) {
            book.recap = book.recap.substring(0, 100);
          }
          book.writersString = writers;
          book.genresString = genres;
        });
        this.books = bookList;
        this.dataSource.data = this.books;
      },
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', { duration: 2000 });
      },
    });
  }

  add() {
    const dialogRef = this.dialog.open(AddBookComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllBooks();
      }
    });
  }

  edit(bookId: number) {
    let book!: Book;

    this.books.forEach((element) => {
      if (element.id === bookId) {
        book = element;
      }
    });

    const dialogRef = this.dialog.open(EditBookComponent, {
      width: '30%',
      data: book,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllBooks();
      }
    });
  }

  delete(bookId: number) {
    this.catalogService.deleteBook(bookId).subscribe({
      next: (result) => {
        this.snackBar.open('Book was successfully deleted!', 'Ok', {
          duration: 2000,
        });
        this.getAllBooks();
      },
      error: (err) => {
        this.snackBar.open(err.error, 'Ok', { duration: 2000 });
      },
    });
  }
}
