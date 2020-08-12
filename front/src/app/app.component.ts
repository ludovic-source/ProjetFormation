import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { EditionService } from './services/edition.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  isModeEdition: boolean;
  isModeEditionSubscription : Subscription;
  isModeParametrage = false;

  title = 'portailci';
  user: any;
  userSubscription : Subscription;
  themes : any[];
  themesSubscription : Subscription;

  constructor(private authService: AuthService,
              private editionService: EditionService,
              private themeService: ThemeService,
              private router: Router) { }

  ngOnInit() {
     this.isModeEditionSubscription = this.editionService.isModeEditionSubject.subscribe(
                (isModeEdition: boolean) => {
                                  this.isModeEdition = isModeEdition;
                               });
     this.editionService.emitIsModeEditionSubject();
     this.userSubscription = this.authService.userSubject.subscribe(
                (user: any) => {
                                  this.user = user;
                               });
     this.authService.emitUserSubject();
     this.themesSubscription = this.themeService.themesSubject.subscribe(
                (themes: any[]) => {
                                      this.themes = themes;
                                   });
     this.themeService.emitThemesSubject();
  }

   ngOnDestroy() {
      this.themesSubscription.unsubscribe();
      this.userSubscription.unsubscribe();
   }

   getIsAuth() {
      return this.authService.getIsAuth();
   }

   getUsername() {
      return this.authService.getUsername()
   }

   onSignOut() {
      this.authService.signOut();
   }

   getProfil() {
      return this.authService.getProfilUser();
   }

   activerModeEdition() {
      this.isModeParametrage = false;
      this.editionService.activerModeEdition();
   }

   desactiverModeEdition() {
      this.editionService.desactiverModeEdition();
   }
   activerModeParametrage() {
      this.isModeParametrage = true;
      this.editionService.desactiverModeEdition();
   }

   desactiverModeParametrage() {
      this.isModeParametrage = false;
   }


}
