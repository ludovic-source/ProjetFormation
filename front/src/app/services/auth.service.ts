import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/User';

@Injectable()
export class AuthService {

  userSubject = new Subject<any>();

  userAuthentified = new User();

  private user =
                  { isAuth : false,
                    username : "",
                    profil : ""
                  }
                 ;

  constructor(private httpClient: HttpClient, private router: Router) {

  }

  emitUserSubject() {
      this.userSubject.next(this.user);
    }

  signIn() {
    this.user.isAuth = true;
    this.emitUserSubject();
  }

  signOut() {
    this.user.isAuth = false;
    this.emitUserSubject();
    sessionStorage.clear();
  }

  getIsAuth() {
    return this.user.isAuth;
  }

  getUsername() {
    return this.user.username;
  }

  // version Angular 6
  login(username, password) {
       let body = new URLSearchParams();
       body.set('username', username);
       body.set('password', password);
       let url = 'http://localhost:9095/login';
       let options = {
           headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
       };
       console.log("user : " + username);
       this.httpClient.post<boolean>(url, body.toString(), options)
             .subscribe(isValid => {
               console.log("retour de l'appel = " + isValid)
               if (isValid) {
                   sessionStorage.setItem(
                     'token',
                     btoa(username + ':' + password)
                   );
                   this.user.isAuth = true;
                   this.user.username = username;
                   this.getProfil(username);
                   this.emitUserSubject();
                   this.router.navigate(['']);
               }
       });

  }

  getProfil(username) {
     this.httpClient
          .get<any>('http://localhost:9095/portailci/utilisateurs/getByUID/' + this.user.username)
          .subscribe(
            (response) => {
              this.user.profil = response.profil.nom;
              console.log('profil : ' + this.user.profil);
              this.emitUserSubject();
            },
            (error) => {
              console.log('Erreur ! : ' + error);
            }
     );
  }

}
