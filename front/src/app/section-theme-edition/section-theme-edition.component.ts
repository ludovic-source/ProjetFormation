import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';

@Component({
  selector: 'app-section-theme-edition',
  templateUrl: './section-theme-edition.component.html',
  styleUrls: ['./section-theme-edition.component.css']
})
export class SectionThemeEditionComponent implements OnInit {

  idThematiqueNiveau1: any;
  idThematiqueNiveau2: any;
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

  setThematiqueNiveau1(idThematique: number) {
      this.idThematiqueNiveau1 = idThematique;
      this.thematiquesNiveau2 = [];
      for (let thematique of this.allThematiques) {
          if (thematique.idParent == idThematique) {
              this.thematiquesNiveau2.push(thematique);
          }
      }
  }

  setThematiqueNiveau2(idThematique: number) {
      this.idThematiqueNiveau2 = idThematique;
      this.thematiquesNiveau3 = [];
      for (let thematique of this.allThematiques) {
          if (thematique.idParent == idThematique) {
              this.thematiquesNiveau3.push(thematique);
          }
      }
  }

  onSubmit(form: NgForm) {
      console.log(form.value);
  }

}
