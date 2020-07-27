import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
/*
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public restProvider: RestProvider) { }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (this.restProvider.getToken() != null) {
      const clonedRequest = request.clone({
        headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
      });
    }
  }

}*/
