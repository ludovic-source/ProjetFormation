import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';
import { Thematique } from '../models/Thematique';

@Component({
  selector: 'app-section-theme-edition-thematique',
  templateUrl: './section-theme-edition-thematique.component.html',
  styleUrls: ['./section-theme-edition-thematique.component.css']
})

export class SectionThemeEditionThematiqueComponent implements OnInit {

  @Input() typeObjet: string;

  idThematiqueNiveau1: any;
  idThematiqueNiveau2: any;
  //thematiquesNiveau1: any[];
  thematiquesNiveau2: any[];
  thematiquesNiveau3: any[];

  typeModification: string;
  niveauThematiqueCreate: number;
  indicateurUpdate: boolean;
  indicateurModifierThemeParent: boolean;

  allThematiques: any[];
  allThematiquesSubscription: Subscription;

  thematiqueUpdate: any;
  thematiqueUpdateN1: any;
  thematiqueUpdateN2: any;

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
      this.indicateurUpdate = false;
      this.indicateurModifierThemeParent = false;
  }

  deleteThematique(form: NgForm) {
      console.log(form.value);
      var thematique = new Thematique;
      thematique = form.value['thematiqueDelete'];
      if (confirm('Souhaitez-vous supprimer la thématique ' + thematique.nom + ' ?')) {
          this.themeService.deleteThematique(thematique);
      } else {
          console.log('confirmation de suppression thématique négative');
      }
      this.revenirDebutFormulaire();
  }

  setUpdateThematique(thematique) {
      this.thematiqueUpdate = thematique;
      this.indicateurUpdate = true;
      if (this.thematiqueUpdate.niveau == 2) {
          for (let theme of this.allThematiques) {
              if (theme.id == this.thematiqueUpdate.idParent) {
                  this.thematiqueUpdateN1 = theme;
              }
          }
      }
      if (this.thematiqueUpdate.niveau == 3) {
          for (let theme of this.allThematiques) {
              if (theme.id == this.thematiqueUpdate.idParent) {
                  this.thematiqueUpdateN2 = theme;
              }
          }
          for (let theme of this.allThematiques) {
              if (theme.id == this.thematiqueUpdateN2.idParent) {
                  this.thematiqueUpdateN1 = theme;
              }
          }
      }
  }

  updateThematique(form: NgForm) {
      console.log(form.value);
      const thematique = new Thematique;
      thematique.id = this.thematiqueUpdate.id;
      thematique.nom = form.value['nom'];
      thematique.description = form.value['description'];
      thematique.niveau = this.thematiqueUpdate.niveau;

      // ATTENTION : si changement de niveau d'une thématique, il faut monter d'un cran les enfants
      // -----> IMPACT DU BACK
      // POUR LE MOMENT L'APPLICATION INTERDIT LE CHANGEMENT DE NIVEAU D'UNE THEMATIQUE

      if (this.indicateurModifierThemeParent == true && thematique.niveau == 2) {
          thematique.idParent = form.value['theme_parent'];
      }
      if (this.indicateurModifierThemeParent == true && thematique.niveau == 3) {
          thematique.idParent = form.value['sous_theme_parent'];
      }

      //reste à faire la modification de l'image + la modification du thème/sous-thème parent

      if (this.thematiqueUpdate.imagePath == null) {
          thematique.imagePath = '';
      } else {
          thematique.imagePath = this.thematiqueUpdate.imagePath;
      }



      var thematiqueUpdate: any;
      thematiqueUpdate = this.themeService.updateThematique(thematique);
      this.revenirDebutFormulaire();




  }

  setModifierThemeParent(valeur: boolean) {
      this.indicateurModifierThemeParent = valeur;
  }

}
