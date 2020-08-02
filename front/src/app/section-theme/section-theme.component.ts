import { Component, OnInit, OnChanges, Input} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';

@Component({
  selector: 'app-section-theme',
  templateUrl: './section-theme.component.html',
  styleUrls: ['./section-theme.component.css']
})
export class SectionThemeComponent implements OnInit {

  @Input() idTheme: number;

  themesNiveau2: any[];
  themesNiveau2Subscription : Subscription;

  themesNiveau3: any[];
  themesNiveau3Subscription : Subscription;

  liensNiveau1: any[];
  liensNiveau1Subscription: Subscription;

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
  }

  ngOnChanges(): void {
      this.initThemeNiveau3();
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
      this.liensNiveau1 = await this.recuperationLiensNiveau1();
      for (let theme of this.themesNiveau2) {
          this.themesNiveau3 = await this.recuperationThematiquesNiveau3(theme.id);
      }
  }

  initThemeNiveau3() {
      if (this.themesNiveau3 === undefined) {
           console.log('liste theme niveau 3 déjà vide');
      } else {
           this.themeService.initThemeNiveau3Subject();
      }
  }

  recuperationThematiquesNiveau2() {
      console.log('section-theme / idTheme : ' + this.idTheme);
      return Promise.resolve(this.themeService.getThemesNiveau2(this.idTheme));
  }

  recuperationThematiquesNiveau3(idThemeNiveau2: number) {
      console.log('section-theme / idTheme : ' + idThemeNiveau2);
      return Promise.resolve(this.themeService.getThemesNiveau3(idThemeNiveau2));
  }

  recuperationLiensNiveau1() {
      return Promise.resolve(this.lienService.getLiensNiveau1(this.idTheme));
  }

}
