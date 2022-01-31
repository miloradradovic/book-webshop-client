import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartForOrderPlacing } from '../model/cart.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseRoute = environment.gatewayUrl + '/order-server/api';

  constructor(
    private http: HttpClient
  ) { }


  create(cartForOrder: CartForOrderPlacing): Observable<any> {
    return this.http.post(this.baseRoute + '/orders/create', cartForOrder, {headers: this.headers, responseType: 'json'});
  }

}
