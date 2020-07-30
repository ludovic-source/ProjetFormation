package com.example.portailci.exposition.lien;

import com.example.portailci.application.lien.IManagementLien;
import com.example.portailci.domain.lien.LienEntity;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/portailci/lien")
@PreAuthorize("hasAuthority('Consultation')")
public class ControllerLien {

    @Autowired
    IManagementLien managementLien;

    private static final Log logger = LogFactory.getLog(ControllerLien.class);

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('Création')")
    public LienEntity create(@RequestBody LienEntity lien) {
        if (lien != null) {
            return managementLien.createLien(lien);
        }
        else {
            logger.error("couche exposition - controllerLien --> create : le lien n'est pas renseigné");
            throw (new ControllerLienException("couche exposition - controllerLien --> create : le lien n'est pas renseigné"));
        }
    }

    @PostMapping("/modifier")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('Modification')")
    public LienEntity modifier(@RequestBody LienEntity lien) {
        if (lien != null) {
            return managementLien.prePublierLien(lien);
        }
        else {
            logger.error("couche exposition - controllerLien --> modifier : le lien n'est pas renseigné");
            throw (new ControllerLienException("couche exposition - controllerLien --> modifier : le lien n'est pas renseigné"));
        }
    }

    @PostMapping("/publier")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('Modification')")
    public LienEntity publier(@RequestBody LienEntity lien) {
        if (lien != null) {
            return managementLien.publierLien(lien);
        }
        else {
            logger.error("couche exposition - controllerLien --> publier : le lien n'est pas renseigné");
            throw (new ControllerLienException("couche exposition - controllerLien --> publier : le lien n'est pas renseigné"));
        }
    }

    @PostMapping("/depublier")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('Suppression')")
    public LienEntity depublier(@RequestBody LienEntity lien) {
        if (lien != null) {
            return managementLien.depublierLien(lien);
        }
        else {
            logger.error("couche exposition - controllerLien --> dépublier : le lien n'est pas renseigné");
            throw (new ControllerLienException("couche exposition - controllerLien --> dépublier : le lien n'est pas renseigné"));
        }
    }

    @GetMapping("/find/id/{id}")
    public LienEntity findByIdLien(@PathVariable("id") Integer idLien) {
        if (idLien != 0) {
            return managementLien.findById(idLien);
        }
        else {
            logger.error("couche exposition - controllerLien --> findById : l'identifiant du lien n'est pas rneseigné");
            throw (new ControllerLienException("couche exposition - controllerLien --> findById : l'identifiant du lien n'est pas rneseigné"));
        }
    }

    // API REST qui renvoie tous les liens, sauf les liens dépubliés
    @GetMapping("/find/thematique/{id}")
    public List<LienEntity> findAllByThematique(@PathVariable("id") Long idThematique) {
        if (!idThematique.equals(0L)) {
            return managementLien.getLiensByIdThematique(idThematique);
        }
        else {
            logger.error("couche exposition - controllerLien --> findAllByIdThematique : l'id thematique n'est pas renseigné");
            throw (new ControllerLienException("couche exposition - controllerLien --> findAllByIdThematique : l'id thematique n'est pas renseigné"));
        }
    }

    // API REST qui renvoie tous les liens dépubliés
    @GetMapping("/find/depublies")
    public List<LienEntity> getAllLiensDepublies() {
        return managementLien.getAllLiensDepublies();
    }
}
