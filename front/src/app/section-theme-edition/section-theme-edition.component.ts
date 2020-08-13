import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';
import { Thematique } from '../models/Thematique';

@Component({
  selector: 'app-section-theme-edition',
  templateUrl: './section-theme-edition.component.html',
  styleUrls: ['./section-theme-edition.component.css']
})
export class SectionThemeEditionComponent implements OnInit {

  idThematiqueNiveau1: any;
  idThematiqueNiveau2: any;
  //thematiquesNiveau1: any[];
  thematiquesNiveau2: any[];
  thematiquesNiveau3: any[];

  typeObjet: string;
  typeModification: string;
  niveauThematiqueCreate: number;

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
      //this.thematiquesNiveau1 = [];
      this.allThematiques = this.themeService.getAllThematiques();
  }

  setThematiqueNiveau1(idThematique: number) {
      console.log('setThematiqueNiveau1 : ' + idThematique);
      this.idThematiqueNiveau1 = idThematique;
      this.thematiquesNiveau2 = [];
      for (let thematique of this.allThematiques) {
          if (thematique.idParent == idThematique) {
              console.log('setThematiqueNiveau1 - sous-theme : ' + thematique.nom);
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

  setNiveauThematiqueCreate(niveau: number) {
      this.niveauThematiqueCreate = niveau;
  }

  createThematique(form: NgForm) {
      console.log(form.value);
      const thematique = new Thematique;
      //thematique.setNom(form.value['nom']);
      thematique.nom = form.value['nom'];
      //thematique.setDescription(form.value['description']);
      thematique.description = form.value['description'];
      //thematique.setNiveau(form.value['niveau_thematique_create']);
      thematique.niveau = form.value['niveau_thematique_create'];
      if (form.value['niveau_thematique_create'] == 1) {
          //thematique.setIdParent(0);
          thematique.idParent = 0;
          // reste à traiter les images pour les thèmes
      }
      if (form.value['niveau_thematique_create'] == 2) {
          //thematique.setIdParent(form.value['theme.id']);
          thematique.idParent = form.value['theme.id'];
      }
      if (form.value['niveau_thematique_create'] == 3) {
          //thematique.setIdParent(form.value['sous_theme.id']);
          thematique.idParent = form.value['sous_theme.id'];
      }
      this.themeService.createThematique(thematique);

  }

}
