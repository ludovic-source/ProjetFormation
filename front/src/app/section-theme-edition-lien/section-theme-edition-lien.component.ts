import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';
import { EditionService } from '../services/edition.service';
import { Thematique } from '../models/Thematique';
import { Lien } from '../models/Lien';

@Component({
  selector: 'app-section-theme-edition-lien',
  templateUrl: './section-theme-edition-lien.component.html',
  styleUrls: ['./section-theme-edition-lien.component.css']
})
export class SectionThemeEditionLienComponent implements OnInit {

  //isModeEdition: boolean;
  //isModeEditionSubscription : Subscription;
  indicateursEdition: any;
  indicateursEditionSubscription: Subscription;

  typeModification: string;

  allThematiques: any[];
  allThematiquesSubscription: Subscription;

  idThematiqueNiveau1: any;
  idThematiqueNiveau2: any;
  thematiquesNiveau2: any[];
  thematiquesNiveau3: any[];

  liens: any[];
  liensSubscription: Subscription;

  constructor(private themeService: ThemeService,
              private lienService: LienService,
              private editionService: EditionService,
              private router: Router) { }

  ngOnInit(): void {
      this.indicateursEditionSubscription = this.editionService.indicateursEditionSubject.subscribe(
                        (indicateursEdition: any) => {
                                              this.indicateursEdition = indicateursEdition;
                                                    });
      this.editionService.emitIndicateursEditionSubject();
      this.allThematiquesSubscription = this.themeService.allThematiquesSubject.subscribe(
                        (allThematiques: any[]) => {
                                              this.allThematiques = allThematiques;
                                           });
      this.themeService.emitAllThematiquesSubject();
      this.liensSubscription = this.lienService.liensSubject.subscribe(
                       (liens: any[]) => {
                                            this.liens = liens;
                                         });
      this.lienService.emitLiensSubject();
  }

  setTypeModification(typeModification: string) {
    this.indicateursEdition.typeModification = typeModification;
    this.editionService.emitIndicateursEditionSubject();
    this.recupererThematiqueNiveau1();
  }

  recupererThematiqueNiveau1() {
      this.allThematiques = this.themeService.getAllThematiques();
  }

  setThematiqueNiveau1(theme: any) {
      console.log('setThematiqueNiveau1 : ' + theme.id);
      this.idThematiqueNiveau1 = theme.id;
      this.thematiquesNiveau2 = [];
      this.thematiquesNiveau3 = [];
      for (let thematique of this.allThematiques) {
          if (thematique.idParent == theme.id) {
              console.log('setThematiqueNiveau1 - sous-theme : ' + thematique.nom);
              this.thematiquesNiveau2.push(thematique);
          }
      }
      this.getLiens(theme);
  }

  setThematiqueNiveau2(sousTheme: any) {
      if (sousTheme != undefined) {
          this.idThematiqueNiveau2 = sousTheme.id;
          this.thematiquesNiveau3 = [];
          for (let thematique of this.allThematiques) {
              if (thematique.idParent == sousTheme.id) {
                  this.thematiquesNiveau3.push(thematique);
              }
          }
          this.getLiens(sousTheme);
      }

  }

  createLien(form: NgForm) {
      console.log(form.value);
      const lien = new Lien;
      lien.nom = form.value['nom'];
      lien.description = form.value['description'];
      lien.url = form.value['url'];
      lien.mode_affichage = form.value['mode_affichage'];
      if (form.value['sous_sous_theme'] != undefined) {
          lien.thematique = form.value['sous_sous_theme'];
      }
      if (form.value['sous_theme'] == undefined) {
          lien.thematique = form.value['sous_theme'];
      }
      if (form.value['sous_theme'] == undefined && form.value['sous_sous_theme'] == undefined) {
          lien.thematique = form.value['theme'];
      }
      console.log('lien.thematique.nom : ' + lien.thematique.nom);

      var lienCreate: any;
      lienCreate = this.lienService.createLien(lien);
      this.editionService.revenirDebutFormulaire();
  }

  getLiens(thematique: any): any {
      this.liens = this.lienService.getLiens(thematique.id);
  }

  publierLien(form: NgForm) {
      var lien = new Lien;
      lien = form.value['lien'];
      this.lienService.publierLien(lien);
  }

}
