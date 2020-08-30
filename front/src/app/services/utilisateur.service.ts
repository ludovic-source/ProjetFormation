import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Utilisateur } from '../models/Utilisateur';

@Injectable()
export class UtilisateurService {

    allUtilisateursSubject = new Subject<any[]>();
    private allUtilisateurs: any[];

    private collaborateursBDDF = [
            { UID: '100100',
              nom: 'Harden',
              prenom: 'James',
              UOAffectation: 'Houston Rockets'
            },
            { UID: 'A00100',
              nom: 'James',
              prenom: 'Lebron',
              UOAffectation: 'Los Angeles Lakers'
            },
            { UID: 'B00100',
              nom: 'Antetokoumpo',
              prenom: 'Gianis',
              UOAffectation: 'Milwaukee Bucks'
            },
            { UID: 'C00100',
              nom: 'Durant',
              prenom: 'Kevin',
              UOAffectation: 'Brooklyn Nets'
            },
            { UID: 'D00100',
              nom: 'Williamson',
              prenom: 'Zion',
              UOAffectation: 'New Orleans Pelicans'
            },
            { UID: 'E00100',
              nom: 'Davis',
              prenom: 'Antony',
              UOAffectation: 'Los Angeles Lakers'
            }];

    constructor(private httpClient: HttpClient) {
    }

    emitAllUtilisateursSubject() {
       this.allUtilisateursSubject.next(this.allUtilisateurs);
    }

    getAllCollaborateurs(): any[] {
        return this.collaborateursBDDF;
    }

    getAllUtilisateurs() {
        let options = {
               withCredentials: true
        };
        this.httpClient
              .get<any>('http://localhost:9095/portailci/utilisateurs/get', options)
              .subscribe(
                (response) => {
                  this.allUtilisateurs = response;
                  console.log('récupération de tous les utilisateurs OK');
                  this.emitAllUtilisateursSubject();
                },
                (error) => {
                  console.log('Erreur ! : ' + error);
                }
        );
     }

    createUtilisateur(utilisateur: Utilisateur): any {
        console.log('uid : ' + utilisateur.UID);
        let options = {
                   withCredentials: true
        };
        this.httpClient
           .post<any>('http://localhost:9095/portailci/utilisateurs/create', utilisateur, options)
           .subscribe(
               (response) => {
                    console.log('création utilisateur OK');
                    alert('utilisateur ' + utilisateur.nom + ' créé');
                    this.allUtilisateurs.push(response);
                    this.emitAllUtilisateursSubject();
                    return response;
               },
               (error) => {
                    alert('utilisateur non créé');
                    console.log('Erreur ! : ' + error);
               }
        );
    }

    updateUtilisateur(utilisateur: Utilisateur): any {
        let options = {
                   withCredentials: true
        };
        this.httpClient
           .put<any>('http://localhost:9095/portailci/utilisateurs/update', utilisateur, options)
           .subscribe(
               (response) => {
                    console.log('mise à jour utilisateur OK');
                    alert('utilisateur ' + utilisateur.nom + ' mis à jour');
                    var index = 0;
                    for (let utilisateur of this.allUtilisateurs) {
                        if (utilisateur.id == response.id) {
                            this.allUtilisateurs[index] = response;
                        }
                        index = index + 1;
                    }
                    this.emitAllUtilisateursSubject();
                    return response;
               },
               (error) => {
                    alert('utilisateur non mis à jour');
                    console.log('Erreur ! : ' + error);
               }
        );
    }

    deleteUtilisateur(utilisateur: Utilisateur): any {
        let options = {
                   withCredentials: true
        };
        this.httpClient
           .delete('http://localhost:9095/portailci/utilisateurs/delete/' + utilisateur.id, options)
           .subscribe(
               (response) => {
                    console.log('suppression utilisateur OK');
                    alert('utilisateur ' + utilisateur.nom + ' supprimé');
                    var index = 0;
                    var indexRecherche: number;
                    for (let utilisateurCourant of this.allUtilisateurs) {
                        if (utilisateurCourant.id == utilisateur.id) {
                            indexRecherche = index;
                        }
                        index = index + 1;
                    }
                    this.allUtilisateurs.splice(indexRecherche, 1);
                    this.emitAllUtilisateursSubject();
               },
               (error) => {
                    if (error == 'OK') {
                        console.log('suppression utilisateur OK');
                        alert('utilisateur ' + utilisateur.nom + ' supprimé');
                        var index = 0;
                        var indexRecherche: number;
                        for (let utilisateurCourant of this.allUtilisateurs) {
                            if (utilisateurCourant.id == utilisateur.id) {
                                indexRecherche = index;
                            }
                            index = index + 1;
                        }
                        this.allUtilisateurs.splice(indexRecherche, 1);
                        this.emitAllUtilisateursSubject();
                    } else {
                        alert('utilisateur non supprimé');
                        console.log('Erreur ! : ' + error);
                    }
               }
        );
    }


}
