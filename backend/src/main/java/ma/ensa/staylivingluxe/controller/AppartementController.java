package ma.ensa.staylivingluxe.controller;

import lombok.RequiredArgsConstructor;
import ma.ensa.staylivingluxe.model.Appartement;
import ma.ensa.staylivingluxe.model.StatutAppartement;
import ma.ensa.staylivingluxe.service.AppartementService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;


import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appartements")
@RequiredArgsConstructor
public class AppartementController {

    private final AppartementService appartementService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Appartement> create(

            @RequestParam("imgPrincipalUrl") MultipartFile imgPrincipalUrl,
            @RequestParam("images") List<MultipartFile> images,

            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam("adresse") String adresse,
            @RequestParam("prixParNuit") Long prixParNuit,
            @RequestParam(value = "statut", required = false) StatutAppartement statut,
            @RequestParam("capacite") Integer capacite,
            @RequestParam("nbreDeLit") Integer nbreDeLit,
            @RequestParam("nbreSalleDeBain") Integer nbreSalleDeBain

    ) throws IOException {

        Appartement appartement = new Appartement();

        appartement.setTitre(titre);
        appartement.setDescription(description);
        appartement.setAdresse(adresse);
        appartement.setPrixParNuit(prixParNuit);
        appartement.setStatut(statut);
        appartement.setCapacite(capacite);
        appartement.setNbreDeLit(nbreDeLit);
        appartement.setNbreSalleDeBain(nbreSalleDeBain);

        return ResponseEntity.ok(
                appartementService.addAppartement(
                        appartement,
                        imgPrincipalUrl,
                        images
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Appartement>> getAll() {
        return ResponseEntity.ok(appartementService.findAllAppartement());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appartement> getById(@PathVariable long id) {
        return appartementService.getAppartementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Appartement> update(
            @PathVariable long id,
            @RequestPart("appartement") Appartement appartement,
            @RequestPart(value = "imgPrincipalUrl", required = false) MultipartFile imgPrincipalUrl,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {

        Appartement updatedAppartement = appartementService.updateAppartement(id, appartement, imgPrincipalUrl, images);
        return ResponseEntity.ok(updatedAppartement);
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Appartement> updateStatut(
            @PathVariable long id,
            @RequestBody Map<String, String> body) {

        String statutStr = body.get("statut");

        if (statutStr == null) {
            return ResponseEntity.badRequest().build();
        }

        Appartement updated = appartementService.updateStatut(id, statutStr);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        appartementService.deleteAppartement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/disponibilite")
    public ResponseEntity<Boolean> checkDisponibilite(
            @PathVariable long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(appartementService.estDisponible(id, dateDebut, dateFin));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Appartement>> getDisponibles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(appartementService.findAppartementsDisponibles(dateDebut, dateFin));
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteGalleryImage(@PathVariable long imageId) {
        appartementService.deleteImageById(imageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Appartement> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer litsMin,
            @RequestParam(required = false) Integer litsMax,
            @RequestParam(required = false) Long prixMin,
            @RequestParam(required = false) Long prixMax,
            @RequestParam(required = false) Integer capacite,
            @RequestParam(required = false) StatutAppartement statut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) String tri) {
        return appartementService.rechercher(q, litsMin, litsMax, prixMin, prixMax,
                capacite, statut, dateDebut, dateFin, tri);
    }
}
