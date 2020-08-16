import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.signOut();
                location.reload(true);
                alert("UID ou mot de passe incorrect");
            }
            if (err.status === 500) {
                console.log("err : " + err);
                alert("erreur 500 : quel message exploiter ?");
                console.log(err.error.message);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
