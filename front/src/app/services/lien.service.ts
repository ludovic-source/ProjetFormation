import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LienService {

    liensNiveau1Subject = new Subject<any[]>();
    private liensNiveau1: any[];

    liensSubject = new Subject<any[]>();
    private liens: any[];

    constructor(private httpClient: HttpClient) {
    }

    emitLiensNiveau1Subject() {
        this.liensNiveau1Subject.next(this.liensNiveau1);
    }

    emitLiensSubject() {
        this.liensSubject.next(this.liens);
    }

    getLiensNiveau1(idThematique: number) : any[] {
        let options = {
                   withCredentials: true
             };
             this.httpClient
                  .get<any>('http://localhost:9095/portailci/lien/find/thematique/' + idThematique, options)
                  .subscribe(
                    (response) => {
                      this.liensNiveau1 = response;
                      console.log('récupération liens niveau 1 OK');
                      console.log('nbre liens rattachés niveau 1: ' + this.liensNiveau1.length);
                      this.emitLiensNiveau1Subject();

                    },
                    (error) => {
                      console.log('Erreur ! : ' + error);
                    }
             );
        return this.liensNiveau1;
    }

    getLiens(idThematique: number) : any[] {
        let options = {
                   withCredentials: true
             };
             this.httpClient
                  .get<any>('http://localhost:9095/portailci/lien/find/thematique/' + idThematique, options)
                  .subscribe(
                    (response) => {
                      this.liens = response;
                      console.log('récupération liens enfant OK');
                      console.log('nbre liens enfants : ' + this.liens.length);
                      this.emitLiensSubject();
                    },
                    (error) => {
                      console.log('Erreur ! : ' + error);
                    }
             );
        return this.liens;
    }
}
