package com.example.portailci.application.lien;

import com.example.portailci.domain.lien.IRepositoryLien;
import com.example.portailci.domain.lien.LienEntity;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ManagementLienImpl implements IManagementLien {

    @Autowired
    IRepositoryLien repositoryLien;

    private static final Log logger = LogFactory.getLog(ManagementLienImpl.class);

    // La création d'un lien implique implicitement un passage au statut "publié restreint"
    @Override
    public LienEntity createLien(LienEntity lien) {
        // pas besoin de controler que la thematique existe bien dans la table car Jpa le fait pour nous
        // Exemple d'exception levée automatiquement :
        //      javax.persistence.EntityNotFoundException: Unable to find com.example.portailci.domain.thematique.ThematiqueEntity with id 28
        controleDonneesLien(lien);
        LocalDateTime currentTime = LocalDateTime.now();
        lien.setDate_publication_restreinte(currentTime);
        lien.setStatut("publié restreint");
        logger.info("Couche Application - ManagementLien --> create lien");
        logger.debug("create lien : " + lien.getNom() + " --- URL = " + lien.getUrl());
        return repositoryLien.save(lien);
    }

    // pour chaque modification de lien on pré publie d'abord
    @Override
    public LienEntity prePublierLien(LienEntity lien) {
        controleDonneesLien(lien);
        // Get the current date and time - format 2018-01-19T09:29:44.150862600
        LienEntity lienTrouve = repositoryLien.findById(lien.getId());
        if (lienTrouve != null) {
            LocalDateTime currentTime = LocalDateTime.now();
            lien.setDate_publication_restreinte(currentTime);
            lien.setStatut("publié restreint");
            lien.setDate_publication(null);
            lien.setDate_depublication(null);
            logger.info("Couche Application - ManagementLien --> modifier lien");
            logger.debug("modifier lien : " + lien.getNom() + " --- URL = " + lien.getDate_publication_restreinte());
            return repositoryLien.save(lien);
        } else {
            logger.error("pré publication impossible : le lien n'existe pas");
            throw (new ManagementLienException("pré publication impossible : le lien n'existe pas"));
        }
    }

    @Override
    public LienEntity publierLien(LienEntity lien) {
        controleDonneesLien(lien);
        // Get the current date and time - format 2018-01-19T09:29:44.150862600
        LienEntity lienTrouve = repositoryLien.findById(lien.getId());
        if (lienTrouve != null) {
            LocalDateTime currentTime = LocalDateTime.now();
            lienTrouve.setDate_publication(currentTime);
            lienTrouve.setStatut("publié");
            logger.info("Couche Application - ManagementLien --> publier lien");
            logger.debug("publier lien : " + lienTrouve.getNom() + " --- URL = " + lienTrouve.getDate_publication());
            return repositoryLien.save(lienTrouve);
        } else {
            logger.error("publication impossible : le lien n'existe pas");
            throw (new ManagementLienException("publication impossible : le lien n'existe pas"));
        }
    }

    @Override
    public LienEntity depublierLien(LienEntity lien) {
        controleDonneesLien(lien);
        // Get the current date and time - format 2018-01-19T09:29:44.150862600
        LienEntity lienTrouve = repositoryLien.findById(lien.getId());
        if (lienTrouve != null) {
            LocalDateTime currentTime = LocalDateTime.now();
            lienTrouve.setDate_depublication(currentTime);
            lienTrouve.setStatut("dépublié");
            logger.error("Couche Application - ManagementLien --> depublier lien");
            logger.debug("depublier lien : " + lienTrouve.getNom() + " --- URL = " + lienTrouve.getDate_depublication());
            return repositoryLien.save(lienTrouve);
        }
        else {
            logger.info("dépublication impossible : le lien n'existe pas");
            throw (new ManagementLienException("dépublication impossible : le lien n'existe pas"));
        }
    }

    @Override
    public LienEntity findById(Integer id) {
       LienEntity lien = repositoryLien.findById(id);
       if (lien != null) {
           logger.info("Couche Application - ManagementLien --> rechercher lien via id");
           logger.debug("rechercher lien via id : " + lien.getId() + " --- nom = " + lien.getNom());
       }
       else {
           logger.info("Couche Application - ManagementLien --> rechercher lien via id " + id + " : non trouvé");
       }
       return lien;
    }

    // methode qui renvoie tous les liens, sauf les liens dépubliés
    @Override
    public List<LienEntity> getLiensByIdThematique(Long idThematique) {
        List<LienEntity> listeLiens = repositoryLien.getLiensByIdThematique(idThematique);
        if (listeLiens != null && listeLiens.size() != 0) {
            logger.info("Couche Application - ManagementLien --> rechercher liens via thématique");
            logger.debug("rechercher lien via thematique, id = : " + idThematique);
        }
        else {
            logger.info("Couche Application - ManagementLien --> rechercher lien via thematique, id = " + idThematique + " : non trouvé");
        }
        return listeLiens;
    }

    // Méthode qui renvoie tous les liens dépubliés
    @Override
    public List<LienEntity> getAllLiensDepublies() {
        List<LienEntity> listeLiens = repositoryLien.findByStatut("dépublié");
        if (listeLiens == null || listeLiens.size() == 0) {
            logger.info("rechercher liens dépubliés : aucun lien dépublié trouvé" );
        }
        else {
            logger.info("Couche Application - ManagementLien --> rechercher liens dépubliés : " + listeLiens.size()
                        + " liens trouvés");
        }
        return listeLiens;
    }

    private void controleDonneesLien(LienEntity lien) {
        if (lien.getNom() == null) {
            logger.error("le champ suivant du lien n'est pas renseigné : nom");
            throw (new ManagementLienException("les champs du lien ne sont pas correctement renseignés"));
        }
        if (lien.getUrl() == null) {
            logger.error("le champ suivant du lien n'est pas renseigné : url");
            throw (new ManagementLienException("les champs du lien ne sont pas correctement renseignés"));
        }
        if (lien.getDescription() == null) {
            logger.error("le champ suivant du lien n'est pas renseigné : description");
            throw (new ManagementLienException("les champs du lien ne sont pas correctement renseignés"));
        }
        if (lien.getMode_affichage() == null) {
            logger.error("le champ suivant du lien n'est pas renseigné : mode affichage");
            throw (new ManagementLienException("les champs du lien ne sont pas correctement renseignés"));
        }
        if (lien.getThematique() == null) {
            logger.error("demande impossible : la thématique n'est pas renseignée");
            throw (new ManagementLienException("demande impossible : la thématique n'est pas renseignée"));
        }
    }

}
