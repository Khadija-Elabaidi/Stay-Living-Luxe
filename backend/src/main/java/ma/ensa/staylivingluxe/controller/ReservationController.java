package ma.ensa.staylivingluxe.controller;

import ma.ensa.staylivingluxe.dto.ReservationBloqueeDto;
import ma.ensa.staylivingluxe.model.Reservation;
import ma.ensa.staylivingluxe.model.StatutReservation;
import ma.ensa.staylivingluxe.model.Utilisateur;
import ma.ensa.staylivingluxe.service.ReservationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    public ReservationController(ReservationService s) { this.reservationService = s; }

    @PostMapping
    public ResponseEntity<Reservation> demanderReservation(
            @RequestParam long appartementId,
            @RequestParam long clientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            Authentication auth) {
        Utilisateur u = (Utilisateur) auth.getPrincipal();
        if (u.getId() != clientId) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(reservationService.creerDemandeReservation(appartementId, clientId, dateDebut, dateFin));
    }

    @GetMapping
    public List<Reservation> all() { return reservationService.getAll(); }

    @GetMapping("/client/{clientId}")
    public List<Reservation> byClient(@PathVariable long clientId) { return reservationService.getByClient(clientId); }

    @GetMapping("/bloquantes/{appartementId}")
    public List<ReservationBloqueeDto> bloquantes(@PathVariable long appartementId) {
        return reservationService.getReservationsBloquantes(appartementId);
    }

    @PutMapping("/{id}/confirmer")
    public Reservation confirmer(@PathVariable long id) { return reservationService.confirmerReservation(id); }

    @PutMapping("/{id}/refuser")
    public Reservation refuser(@PathVariable long id) { return reservationService.refuserReservation(id); }

    @PutMapping("/{id}/annuler")
    public Reservation annuler(@PathVariable long id, Authentication auth) throws AccessDeniedException {
        Utilisateur u = (Utilisateur) auth.getPrincipal();
        boolean estAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return reservationService.annulerReservation(id, u.getId(), estAdmin);
    }

    @PatchMapping("/{id}/statut")
    public Reservation statut(@PathVariable long id, @RequestParam StatutReservation statut) {
        return reservationService.changerStatut(id, statut);
    }

    @PostMapping("/{id}/create-payment-intent")
    public Map<String, String> createPaymentIntent(@PathVariable long id) throws Exception {
        return reservationService.creerStripePaymentIntent(id);
    }

    @PostMapping("/{id}/confirm-payment")
    public ResponseEntity<Void> confirmPayment(@PathVariable long id,
                                               @RequestParam String paymentIntentId) throws Exception {
        reservationService.validerPaiementReussi(id, paymentIntentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mes-reservations")
    public List<Reservation> mesReservations(Authentication auth) {
        Utilisateur u = (Utilisateur) auth.getPrincipal();
        return reservationService.getByClient(u.getId());
    }

    @PutMapping("/{id}/modifier-dates")
    public Reservation modifierDates(
            @PathVariable long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            Authentication auth) {
        Utilisateur u = (Utilisateur) auth.getPrincipal();
        return reservationService.modifierDates(id, u.getId(), dateDebut, dateFin);
    }
}