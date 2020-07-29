import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-section-article-connexion',
  templateUrl: './section-article-connexion.component.html',
  styleUrls: ['./section-article-connexion.component.css']
})
export class SectionArticleConnexionComponent implements OnInit, OnDestroy {

  user: any;
  userSubscription: Subscription;
  themes : any[];
  themesSubscription : Subscription;

  constructor(private authService: AuthService, private themeService: ThemeService, private router: Router) { }

  ngOnInit(): void {
     this.userSubscription = this.authService.userSubject.subscribe(this.user);
     this.authService.emitUserSubject();
     this.themesSubscription = this.themeService.themesSubject.subscribe(
                      (themes: any[]) => {
                                           this.themes = themes;
                                         });
     this.themeService.emitThemesSubject();
  }

  onSignInForm(form: NgForm) {
      const username = form.value['username'];
      const password = form.value['password'];
      this.authService.login(username, password);
      //this.preparationMenuNav();
   }

   onSignOut() {
      this.authService.signOut();
   }

   ngOnDestroy() {
      this.userSubscription.unsubscribe();
   }

   getIsAuth() {
      return this.authService.getIsAuth();
   }

   preparationMenuNav() {
      this.themeService.getThemes(0);
      this.themeService.emitThemesSubject();
   }

}
