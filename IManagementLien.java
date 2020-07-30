package com.example.portailci.application.lien;

import com.example.portailci.domain.lien.LienEntity;
import com.example.portailci.domain.thematique.ThematiqueEntity;

import java.util.List;
import java.util.Optional;

public interface IManagementLien {

    // Je pars de l'idée qu'une modification de lien implique une publication restreinte

    LienEntity createLien(LienEntity lien);       // on ne peut créer un lien que si la thématique est déjà créée

    LienEntity prePublierLien(LienEntity lien);   // pour chaque création et modification de lien

    LienEntity publierLien(LienEntity lien);

    LienEntity depublierLien(LienEntity lien);

    LienEntity findById(Integer id);

    List<LienEntity> getLiensByIdThematique(Long idThematique);

    List<LienEntity> getAllLiensDepublies();

}