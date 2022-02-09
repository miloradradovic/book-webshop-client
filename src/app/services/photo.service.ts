import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private baseRoute = environment.photoServiceUrl + '/api/photos';

  constructor(private http: HttpClient) { }

  upload(file: File, bookName: string): Observable<any> {
    const data: FormData = new FormData();
    data.append('file', file, bookName + '.' + file.type.split('/')[1]);
    return this.http.post(this.baseRoute + '/upload', data)
  }

  getByName(bookName: string): Observable<any> {
    return this.http.get(this.baseRoute + '/' + bookName, {
      headers: this.headers
    });
  }

  delete(bookName: string): Observable<any> {
    return this.http.delete(this.baseRoute + '/' + bookName, {
      headers: this.headers
    });
  }
}
