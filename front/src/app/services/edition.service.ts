import { Subject } from 'rxjs/Subject';
import { BehaviorSubject, Observable } from 'rxjs';

export class EditionService {

    indicateursEditionSubject = new Subject<any>();
    private indicateursEdition = {
                        lieuEdition: 0,
                        typeObjet: '',
                        isModeEdition: false,
                        isEdition: false,
                        typeModification: '',
                        niveauThematiqueCreate: 0,
                        niveauThematiqueUpdate: 0,
                        niveauThematiqueDelete: 0,
                        indicateurUpdate: false,
                        indicateurModifierThemeParent: false
    };

    //isModeEditionSubject = new Subject<boolean>();
    //private isModeEdition: boolean;

    emitIndicateursEditionSubject() {
        this.indicateursEditionSubject.next(this.indicateursEdition);
    }

    activerModeEdition() {
        this.indicateursEdition.isModeEdition = true;
        console.log('activation mode edition');
        this.emitIndicateursEditionSubject();
    }

    desactiverModeEdition() {
        this.indicateursEdition.isModeEdition = false;
        console.log('désactivation mode edition');
        this.revenirDebutFormulaire();
        this.emitIndicateursEditionSubject();
    }

  revenirDebutFormulaire() {
      this.indicateursEdition.typeObjet = '';
      this.indicateursEdition.isEdition = false;
      this.indicateursEdition.typeModification = '';
      //this.indicateursEdition.niveauThematiqueCreate = 0;
      //this.indicateursEdition.niveauThematiqueUpdate = 0;
      this.indicateursEdition.indicateurUpdate = false;
      this.indicateursEdition.indicateurModifierThemeParent = false;
      this.emitIndicateursEditionSubject();
  }

  setLieuEdition(lieu: number) {
      this.indicateursEdition.lieuEdition = lieu;
      // lieu = 4 uniquement création de liens possibles
      if (lieu == 1) {
          this.indicateursEdition.niveauThematiqueCreate = 1;
          this.indicateursEdition.niveauThematiqueUpdate = 1;
          this.indicateursEdition.niveauThematiqueDelete = 1;
      }
      if (lieu == 2) {
          this.indicateursEdition.niveauThematiqueCreate = 2;
          this.indicateursEdition.niveauThematiqueUpdate = 2;
          this.indicateursEdition.niveauThematiqueDelete = 2;
      }
      if (lieu == 3) {
          this.indicateursEdition.niveauThematiqueCreate = 3;
          this.indicateursEdition.niveauThematiqueUpdate = 3;
          this.indicateursEdition.niveauThematiqueDelete = 3;
      }
      this.emitIndicateursEditionSubject();
  }

}
