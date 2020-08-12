import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';

@Component({
  selector: 'app-section-theme-edition',
  templateUrl: './section-theme-edition.component.html',
  styleUrls: ['./section-theme-edition.component.css']
})
export class SectionThemeEditionComponent implements OnInit {

  thematiqueNiveau1: any;
  thematiqueNiveau2: any;
  thematiquesNiveau2: any[];
  thematiquesNiveau3: any[];

  typeObjet: string;
  typeModification: string;

  allThematiques: any[];
  allThematiquesSubscription: Subscription;

  constructor(private themeService: ThemeService,
              private lienService: LienService) { }

  ngOnInit(): void {
      this.allThematiquesSubscription = this.themeService.allThematiquesSubject.subscribe(
                        (allThematiques: any[]) => {
                                              this.allThematiques = allThematiques;
                                           });
      this.themeService.emitAllThematiquesSubject();
  }

  ngOnChanges() {

  }

  setTypeModification(typeModification: string) {
    this.typeModification = typeModification;
    if (this.typeObjet == 'thematique') {
        this.recupererThematiqueNiveau1();
    }

  }

  setTypeObjet(objet: string) {
    this.typeObjet = objet;
  }

  recupererThematiqueNiveau1() {
      this.allThematiques = this.themeService.getAllThematiques();
  }

  setThematiqueNiveau1(thematique: any) {
      console.log('coucou');
      this.thematiqueNiveau1 = thematique;
      this.thematiquesNiveau2 = this.themeService.getThemesNiveau2(thematique.id);
  }

}
