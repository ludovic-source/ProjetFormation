import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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

  //messageReponseFormulaire: string;

  constructor(private themeService: ThemeService,
              private lienService: LienService,
              private router: Router) { }

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
      thematique.nom = form.value['nom'];
      thematique.description = form.value['description'];
      thematique.niveau = form.value['niveau_thematique_create'];
      if (form.value['niveau_thematique_create'] == 1) {
          thematique.idParent = 0;
          // reste à traiter les images pour les thèmes
      }
      if (form.value['niveau_thematique_create'] == 2) {
          thematique.idParent = form.value['theme'];
      }
      if (form.value['niveau_thematique_create'] == 3) {
          thematique.idParent = form.value['sous_theme'];
      }
      thematique.imagePath = '';
      var thematiqueCreate: any;
      thematiqueCreate = this.themeService.createThematique(thematique);
      this.revenirDebutFormulaire();
  }

  revenirDebutFormulaire() {
      this.typeObjet = '';
      this.typeModification = '';
      this.niveauThematiqueCreate = 0;
  }

  deleteThematique(form: NgForm) {
      console.log(form.value);
      var thematique = new Thematique;
      thematique = form.value['thematiqueDelete'];
      if (confirm('Souhaitez-vous supprimer la thématique ' + thematique.nom + ' ?')) {
          this.themeService.deleteThematique(thematique);
      } else {
          console.log('confirmation de suppression thématique négative');
          this.revenirDebutFormulaire();
      }
  }

}
