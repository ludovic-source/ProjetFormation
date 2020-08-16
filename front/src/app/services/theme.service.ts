import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject, Observable } from 'rxjs';
import { Thematique } from '../models/Thematique';

@Injectable()
export class ThemeService {

  idThemeEnCours : number;

  allThematiquesSubject = new Subject<any[]>();
  private allThematiques: any[];

  themesSubject = new Subject<any[]>();
  private themes: any[];

  themesNiveau2Subject = new Subject<any[]>();
  private themesNiveau2: any[];

  themesNiveau3Subject = new Subject<any[]>();
  private themesNiveau3: any[];

  /*
  themesTest = [
            { id: 1,
              nom: 'sportives',
              description: 'voitures sportives',
              niveau: 1,
              idParent: 0,
              imagePath: 'ferrari.jpeg'
            },
            { id: 2,
              nom: 'compactes',
              description: 'voitures compactes',
              niveau: 1,
              idParent: 0,
              imagePath: 'mercedes.webp'
            },
            { id: 3,
              nom: 'berlines',
              description: 'voitures berlines',
              niveau: 1,
              idParent: 0,
              imagePath: 'aucune image'
            },
            { id: 4,
              nom: 'familiales',
              description: 'modèles de familiales',
              niveau: 1,
              idParent: 0,
              imagePath: 'aucune image'
            },
            { id: 5,
              nom: 'SUV',
              description: 'modèles de SUV',
              niveau: 1,
              idParent: 0,
              imagePath: 'lamborghini.webp'
            },
            { id: 6,
              nom: 'camionnettes',
              description: 'modèles de camionnettes',
              niveau: 1,
              idParent: 0,
              imagePath: 'aucune image'
            }
  ]; */

  constructor(private httpClient: HttpClient) {
  }

  emitThemesSubject() {
       this.themesSubject.next(this.themes);
  }

  emitThemesNiveau2Subject() {
      this.themesNiveau2Subject.next(this.themesNiveau2);
  }

  emitThemesNiveau3Subject() {
      this.themesNiveau3Subject.next(this.themesNiveau3);
  }

  emitAllThematiquesSubject() {
      this.allThematiquesSubject.next(this.allThematiques);
  }

  getImageTheme(id: number) {
    return this.themes[id-1].imagePath;
  }

  initThemeNiveau3Subject() {
      this.themesNiveau3.splice(0);
      this.emitThemesNiveau3Subject();
  }

  getThemes(idParent: number) {
    let options = {
               withCredentials: true
    };
    this.httpClient
              .get<any>('http://localhost:9095/portailci/thematique/findenfants/' + idParent, options)
              .subscribe(
                (response) => {
                  this.themes = response;
                  console.log('récupération thèmes OK');
                  this.emitThemesSubject();
                },
                (error) => {
                  console.log('Erreur ! : ' + error);
                }
              );
  }

  getThemesNiveau2(idParent: number) : any[]{
      let options = {
                 withCredentials: true
      };
      this.httpClient
                .get<any>('http://localhost:9095/portailci/thematique/findenfants/' + idParent, options)
                .subscribe(
                  (response) => {
                    this.themesNiveau2 = response;
                    this.emitThemesNiveau2Subject();
                  },
                  (error) => {
                    console.log('Erreur ! : ' + error);
                  }
                );
      return this.themesNiveau2;
  }

  getThemesNiveau3(idParent: number) : any[]{
       let options = {
                   withCredentials: true
       };
       this.httpClient
                  .get<any>('http://localhost:9095/portailci/thematique/findenfants/' + idParent, options)
                  .subscribe(
                    (response) => {
                      this.themesNiveau3 = response;
                      this.emitThemesNiveau3Subject();
                    },
                    (error) => {
                      console.log('Erreur ! : ' + error);
                    }
                  );
       return this.themesNiveau3;
   }

  getAllThematiques(): any[] {

       let options = {
                   withCredentials: true
       };

       // récupérer les thématiques de niveau 1 (thème)
       this.httpClient
            .get<any>('http://localhost:9095/portailci/thematique/findenfants/' + 0, options)
            .subscribe(
                (response) => {
                     this.allThematiques = response;
                     for (let thematique of response) {
                        this.getThematiquesNiveau2(thematique.id);
                     }
                     this.emitAllThematiquesSubject();
                },
                (error) => {
                     console.log('Erreur ! : ' + error);
                }
            );
       return this.allThematiques;
  }

  getThematiquesNiveau2(idParent: number) {
      let options = {
                   withCredentials: true
      };
      // récupérer les thématiques de niveau 2 (sous-thèmes)
      this.httpClient
           .get<any>('http://localhost:9095/portailci/thematique/findenfants/' + idParent, options)
           .subscribe(
               (response) => {
                    for (let thematique of response) {
                       this.allThematiques.push(thematique);
                       this.getThematiquesNiveau3(thematique.id);
                    }
               },
               (error) => {
                    console.log('Erreur ! : ' + error);
               }
           );
  }

  getThematiquesNiveau3(idParent: number) {
      let options = {
                   withCredentials: true
      };
      // récupérer les thématiques de niveau 3 (sous sous-thèmes)
      this.httpClient
           .get<any>('http://localhost:9095/portailci/thematique/findenfants/' + idParent, options)
           .subscribe(
               (response) => {
                    for (let thematique of response) {
                       this.allThematiques.push(thematique);
                    }
               },
               (error) => {
                    console.log('Erreur ! : ' + error);
               }
           );
  }

  createThematique(thematique: Thematique): any {
      let options = {
                   withCredentials: true
      };
      // Créer une thematique
      this.httpClient
           .post<any>('http://localhost:9095/portailci/thematique/create', thematique, options)
           .subscribe(
               (response) => {
                    console.log('création thematique OK');
                    alert('thématique ' + response.nom + ' créée');
                    if (response.niveau == 1) {
                        this.themes.push(response);
                        this.emitThemesSubject();
                    }
                    return response;
               },
               (error) => {
                    alert('thématique non créée');
                    console.log('Erreur ! : ' + error);
               }
           );
  }

  deleteThematique(thematique: Thematique) {
      var idThematique = thematique.id;
      console.log('id thématique à supprimer: ' + idThematique);
      let options = {
                   withCredentials: true
      };
      // Supprimer une thematique
      this.httpClient
           .delete('http://localhost:9095/portailci/thematique/delete/' + idThematique, options)
           .subscribe(
               () => {
                    console.log('suppression thematique OK');
                    alert('thématique ' + thematique.nom + ' supprimée');
                    // supprimer la thématique qsi niveau 1 dans la liste en cours
                    if (thematique.niveau == 1) {
                        var index = 0;
                        var indexRecherche: number;
                        for (let theme of this.themes) {
                            if (theme.id == idThematique) {
                                indexRecherche = index;
                            }
                            index = index + 1;
                        }
                        this.themes.splice(indexRecherche, 1);
                        this.emitThemesSubject();
                    }
               },
               (error) => {
                    alert('thématique non supprimée');
                    console.log('Erreur ! : ' + error);
               }
           );
  }

  updateThematique(thematique: Thematique): any {
      let options = {
                   withCredentials: true
      };
      // Créer une thematique
      this.httpClient
           .put<any>('http://localhost:9095/portailci/thematique/update', thematique, options)
           .subscribe(
               (response) => {
                    console.log('update thematique OK');
                    alert('thématique ' + response.nom + ' modifiée');
                    if (response.niveau == 1) {
                        var index = 0;
                        for (let theme of this.themes) {
                             if (theme.id == response.id) {
                                  this.themes[index] = response;
                             }
                             index = index + 1;
                        }
                        this.emitThemesSubject();
                    }
                    if (response.niveau == 2) {
                        var index = 0;
                        for (let theme of this.themesNiveau2) {
                             if (theme.id == response.id) {
                                  this.themesNiveau2[index] = response;
                             }
                             index = index + 1;
                        }
                        this.emitThemesNiveau2Subject();
                    }
                    if (response.niveau == 3) {
                        var index = 0;
                        for (let theme of this.themesNiveau3) {
                             if (theme.id == response.id) {
                                  this.themesNiveau3[index] = response;
                             }
                             index = index + 1;
                        }
                        this.emitThemesNiveau3Subject();
                    }

                    return response;
               },
               (error) => {
                    alert('thématique non modifiée');
                    console.log('Erreur ! : ' + error);
               }
           );
  }

}
