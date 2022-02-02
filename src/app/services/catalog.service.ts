import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book, ModifyBook } from '../model/book.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private baseRoute = environment.gatewayUrl + '/catalog-server/api';

  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<any> {
    return this.http.get(this.baseRoute + '/books', {
      headers: this.headers,
      responseType: 'json',
    });
  }

  createBook(bookData: ModifyBook) {
    return this.http.post(this.baseRoute + '/books/create', bookData, {
      headers: this.headers,
      responseType: 'json',
    });
  }

  editBook(book: ModifyBook): Observable<any> {
    return this.http.put(this.baseRoute + '/books/edit/' + book.id, book, {
      headers: this.headers,
      responseType: 'json',
    });
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(this.baseRoute + '/books/' + bookId, {
      headers: this.headers,
      responseType: 'json',
    });
  }

  getAllWriters(): Observable<any> {
    return this.http.get(this.baseRoute + '/writers', {
      headers: this.headers,
      responseType: 'json',
    });
  }
}
