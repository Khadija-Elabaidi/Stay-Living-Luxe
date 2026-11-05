package ma.ensa.staylivingluxe.service;

import lombok.RequiredArgsConstructor;
import ma.ensa.staylivingluxe.model.Appartement;
import ma.ensa.staylivingluxe.model.ImageAppartement;
import ma.ensa.staylivingluxe.model.StatutAppartement;
import ma.ensa.staylivingluxe.repository.AppartementRepo;
import ma.ensa.staylivingluxe.repository.AppartementSpecs;
import ma.ensa.staylivingluxe.repository.ImageAppartementRepo;
import ma.ensa.staylivingluxe.repository.ReservationRepo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppartementService {

    private final AppartementRepo appartementRepo;
    private final ReservationRepo reservationRepo;
    private final ImageAppartementRepo imageAppartementRepository;
    private final Path uploadPath = Paths.get("uploads");

    public Appartement addAppartement(
            Appartement appartement,
            MultipartFile imgPrincipal,
            List<MultipartFile> images
    ) throws IOException {

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        if (appartement.getStatut() == null) {
            appartement.setStatut(StatutAppartement.DISPONIBLE);
        }


        appartement.setImgPrincipalUrl(
                saveImage(imgPrincipal)
        );



        List<ImageAppartement> liste = new ArrayList<>();

        for (MultipartFile file : images) {

            ImageAppartement image = new ImageAppartement();

            image.setImgUrl(
                    saveImage(file)
            );

            image.setAppartement(appartement);

            liste.add(image);
        }

        appartement.setImages(liste);

        return appartementRepo.save(appartement);
    }

    private String saveImage(MultipartFile file) throws IOException {

        System.out.println("Nom : " + file.getOriginalFilename());
        System.out.println("Taille : " + file.getSize());

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path destination = uploadPath.resolve(fileName);

        System.out.println("Destination : " + destination.toAbsolutePath());

        Files.copy(
                file.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING
        );

        System.out.println("Image enregistrée avec succès");

        return fileName;
    }





    public Optional<Appartement> getAppartementById(long id) {
        return appartementRepo.findById(id);
    }

    public List<Appartement> findAllAppartement() {
        return appartementRepo.findAll();
    }

    public Appartement updateAppartement(long id,
                                         Appartement appartement,
                                         MultipartFile imgPrincipalUrl,
                                         List<MultipartFile> images) throws IOException {

        Appartement existingAppartement = appartementRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appartement non trouvé avec l'id : " + id));

        existingAppartement.setTitre(appartement.getTitre());
        existingAppartement.setDescription(appartement.getDescription());
        existingAppartement.setAdresse(appartement.getAdresse());
        existingAppartement.setPrixParNuit(appartement.getPrixParNuit());
        existingAppartement.setCapacite(appartement.getCapacite());
        existingAppartement.setNbreDeLit(appartement.getNbreDeLit());
        existingAppartement.setNbreSalleDeBain(appartement.getNbreSalleDeBain());

        if (appartement.getStatut() != null) {
            existingAppartement.setStatut(appartement.getStatut());
        }

        if (imgPrincipalUrl != null && !imgPrincipalUrl.isEmpty()) {
            String mainFileName = saveImage(imgPrincipalUrl);
            existingAppartement.setImgPrincipalUrl(mainFileName);
        }

        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    String fileName = saveImage(file);

                    ImageAppartement newImage = new ImageAppartement();
                    newImage.setImgUrl(fileName);
                    newImage.setAppartement(existingAppartement);

                    existingAppartement.getImages().add(newImage);
                }
            }
        }

        return appartementRepo.save(existingAppartement);
    }


    public void deleteImageById(long id) {
        ImageAppartement image = imageAppartementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image non trouvée avec l'ID: " + id));

        String uploadDir = "uploads/";
        Path filePath = Paths.get(uploadDir + image.getImgUrl());
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Impossible de supprimer le fichier physique: " + e.getMessage());
        }

        imageAppartementRepository.delete(image);
    }

    public Appartement updateStatut(long id, String statutStr) {
        if (statutStr == null || statutStr.isBlank()) {
            throw new IllegalArgumentException("Le statut est obligatoire");
        }
        StatutAppartement newStatut = StatutAppartement.valueOf(statutStr.toUpperCase());
        Appartement appartement = appartementRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appartement non trouvé"));
        appartement.setStatut(newStatut);
        return appartementRepo.save(appartement);
    }


    public void deleteAppartement(long id) {
        if (!appartementRepo.existsById(id)) {
            throw new RuntimeException("Appartement non trouvé ");
        }
        appartementRepo.deleteById(id);
    }



    public boolean estDisponible(long appartementId, LocalDate dateDebut, LocalDate dateFin) {
        if (dateDebut == null || dateFin == null || !dateDebut.isBefore(dateFin)) {
            throw new IllegalArgumentException("Période invalide : dateDebut doit être avant dateFin");
        }
        Appartement a = appartementRepo.findById(appartementId)
                .orElseThrow(() -> new RuntimeException("Appartement non trouvé"));
        if (a.getStatut() == StatutAppartement.INDISPONIBLE) return false;
        return reservationRepo.countOverlapping(appartementId, dateDebut, dateFin, 0) == 0;
    }



    public List<Appartement> findAppartementsDisponibles(LocalDate dateDebut, LocalDate dateFin) {
        return appartementRepo.findAll().stream()
                .filter(a -> estDisponible(a.getId(), dateDebut, dateFin))
                .toList();
    }

    public List<Appartement> rechercher(String q, Integer litsMin, Integer litsMax,
                                        Long prixMin, Long prixMax, Integer capacite,
                                        StatutAppartement statut,
                                        LocalDate dateDebut, LocalDate dateFin,
                                        String tri) {

        Specification<Appartement> spec = Specification
                .where(AppartementSpecs.motCle(q))
                .and(AppartementSpecs.litsEntre(litsMin, litsMax))
                .and(AppartementSpecs.prixEntre(prixMin, prixMax))
                .and(AppartementSpecs.capaciteMin(capacite))
                .and(AppartementSpecs.statut(statut));

        Sort sort = switch (tri == null ? "" : tri) {
            case "prix_asc"  -> Sort.by("prixParNuit").ascending();
            case "prix_desc" -> Sort.by("prixParNuit").descending();
            case "capacite"  -> Sort.by("capacite").descending();
            default          -> Sort.by("id").descending();
        };

        List<Appartement> resultat = appartementRepo.findAll(spec, sort);

        if (dateDebut != null && dateFin != null) {
            resultat = resultat.stream()
                    .filter(a -> estDisponible(a.getId(), dateDebut, dateFin))
                    .toList();
        }
        return resultat;
    }
}