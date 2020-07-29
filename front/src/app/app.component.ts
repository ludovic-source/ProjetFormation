import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'portailci';
  user: any;
  userSubscription : Subscription;
  themes : any[];
  themesSubscription : Subscription;

  constructor(private authService: AuthService, private themeService: ThemeService, private router: Router) { }

  ngOnInit() {
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

}
