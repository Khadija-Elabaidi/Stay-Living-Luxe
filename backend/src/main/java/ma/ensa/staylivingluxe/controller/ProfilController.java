package ma.ensa.staylivingluxe.controller;

import lombok.RequiredArgsConstructor;
import ma.ensa.staylivingluxe.model.Utilisateur;
import ma.ensa.staylivingluxe.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
public class ProfilController {

    private final UtilisateurService utilisateurService;

    @GetMapping
    public ResponseEntity<Utilisateur> getProfil(Authentication auth) {
        return ResponseEntity.ok(utilisateurService.getByEmail(auth.getName()));
    }

    @PutMapping
    public ResponseEntity<Utilisateur> updateProfil(Authentication auth,
                                                    @RequestBody Utilisateur data) {
        return ResponseEntity.ok(utilisateurService.updateProfil(auth.getName(), data));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changerMotDePasse(
            Authentication auth, @RequestBody Map<String, String> body) {
        utilisateurService.changerMotDePasse(
                auth.getName(), body.get("ancienMotPass"), body.get("nouveauMotPass"));
        return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès."));
    }
}