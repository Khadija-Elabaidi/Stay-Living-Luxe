package ma.ensa.staylivingluxe.service;

import lombok.RequiredArgsConstructor;
import ma.ensa.staylivingluxe.model.Utilisateur;
import ma.ensa.staylivingluxe.repository.UtilisateurRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepo utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    public Utilisateur creerUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepo.save(utilisateur);
    }

    @Transactional(readOnly = true)
    public Utilisateur getByEmail(String email) {
        return utilisateurRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }

    @Transactional
    public Utilisateur updateProfil(String currentEmail, Utilisateur data) {
        Utilisateur user = getByEmail(currentEmail);

        if (isBlank(data.getNom()) || isBlank(data.getPrenom()) || isBlank(data.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le nom, le prénom et l'email sont obligatoires.");
        }

        String newEmail = data.getEmail().trim();
        if (!newEmail.equalsIgnoreCase(user.getEmail())
                && utilisateurRepo.existsByEmail(newEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cet email est déjà utilisé par un autre compte.");
        }

        user.setNom(data.getNom().trim());
        user.setPrenom(data.getPrenom().trim());
        user.setEmail(newEmail);
        user.setTelephone(data.getTelephone() == null ? null : data.getTelephone().trim());

        return utilisateurRepo.save(user);
    }

    @Transactional
    public void changerMotDePasse(String email, String ancien, String nouveau) {
        Utilisateur user = getByEmail(email);

        if (isBlank(ancien) || isBlank(nouveau)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tous les champs sont obligatoires.");
        }
        if (!passwordEncoder.matches(ancien, user.getMotPass())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'ancien mot de passe est incorrect.");
        }
        if (nouveau.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le nouveau mot de passe doit contenir au moins 6 caractères.");
        }

        user.setMotPass(passwordEncoder.encode(nouveau));
        utilisateurRepo.save(user);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}