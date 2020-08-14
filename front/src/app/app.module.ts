import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SectionArticleConnexionComponent } from './section-article-connexion/section-article-connexion.component';
import { SectionComponent } from './section/section.component';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { ThemeService } from './services/theme.service';
import { LienService } from './services/lien.service';
import { EditionService } from './services/edition.service';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { SectionThemeArbreComponent } from './section-theme-arbre/section-theme-arbre.component';
import { SectionThemeEditionComponent } from './section-theme-edition/section-theme-edition.component';

const appRoutes: Routes = [
  { path: 'connexion', component: SectionArticleConnexionComponent },
  { path: 'theme/:id', canActivate: [AuthGuard], component: SectionComponent },
  { path: 'edition', canActivate: [AuthGuard], component: SectionThemeEditionComponent },
  { path: '', component: SectionArticleConnexionComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SectionArticleConnexionComponent,
    SectionComponent,
    SectionThemeArbreComponent,
    SectionThemeEditionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard,
    AuthService,
    ThemeService,
    LienService,
    EditionService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
