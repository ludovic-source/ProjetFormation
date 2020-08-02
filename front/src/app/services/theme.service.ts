import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ThemeService {

  idThemeEnCours : number;

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
                      //for (let theme of response) {
                      //   this.themesNiveau3.push(theme);
                      //   this.emitThemesNiveau3Subject();
                      //}
                    },
                    (error) => {
                      console.log('Erreur ! : ' + error);
                    }
                  );
       return this.themesNiveau3;
   }

}
