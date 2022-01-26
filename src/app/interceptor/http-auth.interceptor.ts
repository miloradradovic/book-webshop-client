import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let user = sessionStorage.getItem('user');
    if (user) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + JSON.parse(user).token
        }
      });
    }
    return next.handle(request);
  }
}