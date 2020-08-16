import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ThemeService } from '../services/theme.service';
import { LienService } from '../services/lien.service';
import { Thematique } from '../models/Thematique';

@Component({
  selector: 'app-section-theme-edition-lien',
  templateUrl: './section-theme-edition-lien.component.html',
  styleUrls: ['./section-theme-edition-lien.component.css']
})
export class SectionThemeEditionLienComponent implements OnInit {

  @Input() typeObjet: string;

  typeModification: string;

  allThematiques: any[];
  allThematiquesSubscription: Subscription;

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

}
