package ma.ensa.staylivingluxe.service;

import ma.ensa.staylivingluxe.model.Client;
import ma.ensa.staylivingluxe.model.Role;
import ma.ensa.staylivingluxe.model.Utilisateur;
import ma.ensa.staylivingluxe.repository.UtilisateurRepo;
import ma.ensa.staylivingluxe.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UtilisateurRepo utilisateurRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Client inscrireClient(Client client) {
        if (utilisateurRepo.existsByEmail(client.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }
        client.setMotPass(passwordEncoder.encode(client.getMotPass()));
        client.setRole(Role.CLIENT);
        return utilisateurRepo.save(client);
    }



    public Map<String, Object> connecter(Utilisateur userParams) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userParams.getEmail(), userParams.getMotPass())
        );

        Utilisateur user = utilisateurRepo.findByEmail(userParams.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String token = jwtUtils.generateToken(user);

        user.setMotPass(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("utilisateur", user);

        return response;
    }
}