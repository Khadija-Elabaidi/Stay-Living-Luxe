package ma.ensa.staylivingluxe.controller;

import ma.ensa.staylivingluxe.model.Client;
import ma.ensa.staylivingluxe.model.Utilisateur;
import ma.ensa.staylivingluxe.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Client> register(@RequestBody Client client) {
        return ResponseEntity.ok(authService.inscrireClient(client));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Utilisateur utilisateur) {
        return ResponseEntity.ok(authService.connecter(utilisateur));
    }
}