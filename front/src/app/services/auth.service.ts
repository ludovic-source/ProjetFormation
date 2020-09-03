import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class AuthService {

  userSubject = new Subject<any>();

  private user =
                  { isAuth : false,
                    username : "",
                    profil : ""
                  }
                 ;

  themes : any[];
  themesSubscription : Subscription;

  constructor(private httpClient: HttpClient, private themeService: ThemeService, private router: Router) {

  }

  emitUserSubject() {
      this.userSubject.next(this.user);
    }

  signIn() {
    this.user.isAuth = true;
    this.emitUserSubject();
  }

  signOut() {
    this.logout();
    //this.user.isAuth = false;
    this.user = { isAuth : false, username : "", profil : ""};
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
           headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
           withCredentials: true
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
                   this.preparationMenuNav();
                   this.router.navigate(['']);
               }
       });

  }

  logout() {
       let body = new URLSearchParams();
       body.set('username', this.user.username);
       let url = 'http://localhost:9095/logout';
       let options = {
           headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
           withCredentials: true
       };
       this.httpClient.post<boolean>(url, body.toString(), options)
             .subscribe(isValid => {
                   this.router.navigate(['']);
               }
              );
  }

  getProfil(username) {
     let options = {
           withCredentials: true
     };
     this.httpClient
          .get<any>('http://localhost:9095/portailci/utilisateurs/getByUID/' + this.user.username, options)
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

  getProfilUser() {
      return this.user.profil;
  }

  // permet de récupérer les thèmes pour les afficher dans le menu - cette opération ne peut se faire que quand
  //       l'utilisateur est authentitifié.
  // Au départ je voulais le faire dans SectionArticleConnexionComponent.ts, mais la fonction await ne permet pas une
  //       bonne gestion de la synchronisation pour les cas où le mot de passe a été erronée. L'utilisateur est
  //       obligé de resaisir son mot de passe.
  preparationMenuNav() {
      this.themeService.getThemes(0);
      this.themesSubscription = this.themeService.themesSubject.subscribe(
                      (themes: any[]) => {
                                            this.themes = themes;
                                         });
      this.themeService.emitThemesSubject();
  }

}
