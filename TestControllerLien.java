package com.example.portailci.exposition.lien;

import com.example.portailci.application.lien.IManagementLien;
import com.example.portailci.domain.lien.LienEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@EnableWebMvc
public class TestControllerLien {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    // ajouté après pour les find
    @MockBean
    private IManagementLien managementLien;

    private LienEntity lien = new LienEntity();

    // KO
    @Test
    @WithMockUser(authorities = {"Consultation","Création"})
    public void tester_create_lien_reussi() throws Exception {

        initLien();
        when(managementLien.createLien(lien)).thenReturn(lien);

        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/create")
                .content(objectMapper.writeValueAsString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").exists());
/*
        String result = mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/create")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(lien)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString()
        ;
        System.out.println("object mapper : " + result);
        LienEntity resultLien = objectMapper.readValue(result, LienEntity.class);
        System.out.println("object mapper resultLien: " + resultLien);
        assertThat(resultLien.getId()).isEqualTo(lien.getId());
*/
    }

    // OK
    @Test
    public void tester_createLien_access_denied() throws Exception {
        initLien();
        when(managementLien.createLien(lien)).thenReturn(lien);

        mockMvc.perform(MockMvcRequestBuilders
                .post("/portailci/lien/create")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // OK
    @Test
    @WithMockUser(authorities = {"Consultation","Création"})
    public void tester_create_lien_parametre_vide() throws Exception {

        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/create")
                .content(asJsonString(null))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // KO
    @Test
    @WithMockUser(authorities = {"Modification"})
    public void tester_modifier_lien_reussi() throws Exception {

        initLien();
        when(managementLien.prePublierLien(lien)).thenReturn(lien);
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/modifier")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nom").value("lien de test"))
                .andExpect(content().string(containsString("lien de test")));
    }

    // OK
    @Test
    public void tester_modifier_lien_access_denied() throws Exception {

        initLien();
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/modifier")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // OK
    @Test
    public void tester_modifier_lien_parametre_vide() throws Exception {
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/modifier")
                .content(asJsonString(null))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // KO
    @Test
    @WithMockUser(authorities = {"Modification"})
    public void tester_publier_lien_reussi() throws Exception {

        initLien();
        when(managementLien.publierLien(lien)).thenReturn(lien);
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/publier")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nom").value("lien de test"))
                .andExpect(content().string(containsString("lien de test")));
    }

    // OK
    @Test
    public void tester_publier_lien_access_denied() throws Exception {

        initLien();
        when(managementLien.publierLien(lien)).thenReturn(lien);
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/publier")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // OK
    @Test
    public void tester_publier_lien_parametre_vide() throws Exception {
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/publier")
                .content(asJsonString(null))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // KO
    @Test
    @WithMockUser(authorities = {"Suppression"})
    public void tester_depublier_lien_reussi() throws Exception {

        initLien();
        when(managementLien.depublierLien(lien)).thenReturn(lien);
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/depublier")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nom").value("lien de test"))
                .andExpect(content().string(containsString("lien de test")));
    }

    // OK
    @Test
    public void tester_depublier_lien_access_denied() throws Exception {

        initLien();
        when(managementLien.depublierLien(lien)).thenReturn(lien);
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/depublier")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // OK
    @Test
    @WithMockUser(authorities = {"Modification"})
    public void tester_depublier_lien_access_denied_avec_droit_modification() throws Exception {

        initLien();
        when(managementLien.depublierLien(lien)).thenReturn(lien);
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/depublier")
                .content(asJsonString(lien))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // OK
    @Test
    public void tester_depublier_lien_parametre_vide() throws Exception {
        mockMvc.perform( MockMvcRequestBuilders
                .post("/portailci/lien/depublier")
                .content(asJsonString(null))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // OK
    @Test
    @WithMockUser(authorities = {"Consultation"})
    public void tester_findByIdLien_reussi() throws Exception {

        initLien();
        when(managementLien.findById(1)).thenReturn(lien);

       this.mockMvc.perform(MockMvcRequestBuilders
               .get("/portailci/lien/find/id/{id}", 1))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").exists())
               .andExpect(jsonPath("$.nom").value("lien de test"))
               .andExpect(content().string(containsString("lien de test")))
               .andReturn();
    }

    // OK
    @Test
    public void tester_findByIdLien_access_denied() throws Exception {
        mockMvc.perform( MockMvcRequestBuilders
                .get("/portailci/lien/find/id/{id}", 0)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // OK
    @Test
    @WithMockUser(authorities = {"Consultation"})
    public void findAllByThematique_reussi() throws Exception {

        initLien();
        List<LienEntity> liens = new ArrayList<>();
        liens.add(lien);
        when(managementLien.getLiensByIdThematique((long) 1)).thenReturn(liens);
        mockMvc.perform( MockMvcRequestBuilders
                .get("/portailci/lien/find/thematique/{id}", 1)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].nom").value("lien de test"))
                .andExpect(content().string(containsString("lien de test")));
    }

    // OK
    @Test
    public void findAllByThematique_access_denied() throws Exception {
        initLien();
        List<LienEntity> liens = new ArrayList<>();
        liens.add(lien);
        when(managementLien.getLiensByIdThematique((long) 1)).thenReturn(liens);
        mockMvc.perform( MockMvcRequestBuilders
                .get("/portailci/lien/find/thematique/{id}", 1)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // OK
    @Test
    @WithMockUser(authorities = {"Consultation"})
    public void tester_getAllLiensDepublies_reussi() throws Exception {

        initLien();
        List<LienEntity> resultLiens = new ArrayList<>();
        resultLiens.add(lien);
        when(managementLien.getAllLiensDepublies()).thenReturn(resultLiens);

        mockMvc.perform( MockMvcRequestBuilders
                .get("/portailci/lien/find/depublies")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].nom").value("lien de test"))
                .andExpect(content().string(containsString("lien de test")));
    }

    // OK
    @Test
    public void tester_getAllLiensDepublies_access_denied() throws Exception {

        initLien();
        List<LienEntity> resultLiens = new ArrayList<>();
        resultLiens.add(lien);
        when(managementLien.getAllLiensDepublies()).thenReturn(resultLiens);

        mockMvc.perform( MockMvcRequestBuilders
                .get("/portailci/lien/find/depublies")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void initLien() {
        lien.setId(1);
        lien.setNom("lien de test");
        lien.setDescription("utilisé uniquement pour les tests");
        lien.setMode_affichage(true);
        lien.setUrl("http://coucou/tests");
    }

}
