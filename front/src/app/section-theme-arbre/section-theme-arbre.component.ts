import { Component, OnInit, OnChanges, Input} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';

@Component({
  selector: 'app-section-theme-arbre',
  templateUrl: './section-theme-arbre.component.html',
  styleUrls: ['./section-theme-arbre.component.css']
})
export class SectionThemeArbreComponent implements OnInit {
@Input() idTheme: number;

  themesNiveau2: any[];
  themesNiveau2Subscription : Subscription;

  themesNiveau3: any[];
  themesNiveau3Subscription : Subscription;

  liensNiveau1: any[];
  liensNiveau1Subscription: Subscription;

  liens: any[];
  liensSubscription: Subscription;

  constructor(private authService: AuthService,
              private themeService: ThemeService,
              private lienService: LienService) { }

  ngOnInit(): void {
      this.themesNiveau2Subscription = this.themeService.themesNiveau2Subject.subscribe(
                      (themes: any[]) => {
                                            this.themesNiveau2 = themes;
                                         });
      this.themeService.emitThemesNiveau2Subject();
      this.themesNiveau3Subscription = this.themeService.themesNiveau3Subject.subscribe(
                      (themes: any[]) => {
                                            this.themesNiveau3 = themes;
                                         });
      this.themeService.emitThemesNiveau3Subject();
      this.liensNiveau1Subscription = this.lienService.liensNiveau1Subject.subscribe(
                      (liens: any[]) => {
                                            this.liensNiveau1 = liens;
                                         });
      this.lienService.emitLiensNiveau1Subject();
      this.liensSubscription = this.lienService.liensSubject.subscribe(
                       (liens: any[]) => {
                                            this.liens = liens;
                                         });
      this.lienService.emitLiensSubject();
  }

  ngOnChanges(): void {
      this.constructionArbre().then(() => console.log('résolution promise OK'));
  }

  getIsAuth() {
      return this.authService.getIsAuth();
  }

  getIdTheme() {
      return this.idTheme;
  }

  getImage() {
      return this.themeService.getImageTheme(this.idTheme);
  }

  async constructionArbre() {
      console.log('section-theme / idTheme : ' + this.idTheme);
      this.themesNiveau2 = await this.recuperationThematiquesNiveau2();
      // récupération des liens directements rattachés au thème niveau 1
      this.liensNiveau1 = await this.recuperationLiensNiveau1();
  }

  recuperationThematiquesNiveau2() {
      console.log('section-theme / idTheme : ' + this.idTheme);
      return Promise.resolve(this.themeService.getThemesNiveau2(this.idTheme));
  }

  getThemesNiveau3EtLiens(idThemeNiveau2: number) {
      console.log('section-theme / idTheme : ' + idThemeNiveau2);
      this.themesNiveau3 = this.themeService.getThemesNiveau3(idThemeNiveau2);
      this.liens = this.lienService.getLiens(idThemeNiveau2);
  }

  recuperationLiensNiveau1() {
      return Promise.resolve(this.lienService.getLiensNiveau1(this.idTheme));
  }

  getLiens(idTheme: number) {
      console.log('getLiens avec idTheme =  ' + idTheme);
      this.liens = this.lienService.getLiens(idTheme);
  }

}
