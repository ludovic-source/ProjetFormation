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

  indicateursEdition: any;
  indicateursEditionSubscription: Subscription;
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
     this.indicateursEditionSubscription = this.editionService.indicateursEditionSubject.subscribe(
                        (indicateursEdition: any) => {
                                              this.indicateursEdition = indicateursEdition;
                                                    });
     this.editionService.emitIndicateursEditionSubject();
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
      this.isModeParametrage = false;
      this.editionService.revenirDebutFormulaire();
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

   getIsModeParametrage(): boolean {
      return this.isModeParametrage;
   }

   activerModeParametrage() {
      this.isModeParametrage = true;
      this.editionService.desactiverModeEdition();
   }

   desactiverModeParametrage() {
      this.isModeParametrage = false;
      this.router.navigate(['theme']);
   }

   editerThematique(lieuEdition: number) {
      this.editionService.setLieuEditionThematique(lieuEdition);
   }

   editerLien(lieuEdition: number) {
      this.editionService.revenirDebutFormulaire();
      this.editionService.setLieuEditionLien(lieuEdition);
   }

   getImage(theme) {
      //return theme.imagePath;
      // ci-dessous, juste pour les tests en attendant la mise en place de l'upload d'image
      if (theme.id == 1) {
          return 'icons8_f1_car_24px.png';
      }
      if (theme.id == 2) {
          return 'icons8_golf_cart_24px.png';
      }
      if (theme.id == 3) {
          return 'icons8_people_in_car_side_view_24px.png';
      }
      if (theme.id == 4) {
          return 'icons8_food_truck_24px.png';
      }
      if (theme.id == 5) {
          return 'icons8_tractor_24px.png';
      }
      if (theme.id == 36) {
          return 'icons8_rocket_24px.png';
      }
   }

}
