import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SectionArticleConnexionComponent } from './section-article-connexion/section-article-connexion.component';
import { SectionThemeComponent } from './section-theme/section-theme.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { ThemeService } from './services/theme.service';
import { ErrorInterceptor } from './interceptor/error.interceptor';
//import {TokenInterceptor} from './interceptor/token.interceptor';

const appRoutes: Routes = [
  { path: 'connexion', component: SectionArticleConnexionComponent },
  { path: 'theme/:id', canActivate: [AuthGuard], component: SectionThemeComponent },
  { path: '', component: SectionArticleConnexionComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SectionArticleConnexionComponent,
    SectionThemeComponent
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
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
//    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
