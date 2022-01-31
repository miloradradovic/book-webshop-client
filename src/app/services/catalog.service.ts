import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseRoute = environment.gatewayUrl + '/catalog-server/api';

  constructor(
    private http: HttpClient
  ) { }

  getAllBooks(): Observable<any> {
    return this.http.get(this.baseRoute + '/books', {headers: this.headers, responseType: 'json'});
  }
}
