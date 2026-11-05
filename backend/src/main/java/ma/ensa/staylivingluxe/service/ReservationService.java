package ma.ensa.staylivingluxe.service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import ma.ensa.staylivingluxe.dto.ReservationBloqueeDto;
import ma.ensa.staylivingluxe.model.*;
import ma.ensa.staylivingluxe.repository.AppartementRepo;
import ma.ensa.staylivingluxe.repository.ClientRepo;
import ma.ensa.staylivingluxe.repository.ReservationRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepo reservationRepo;
    private final AppartementRepo appartementRepo;
    private final ClientRepo clientRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private static final int BLOCAGE_HEURES = 24;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public ReservationService(ReservationRepo reservationRepo,
                              AppartementRepo appartementRepo,
                              ClientRepo clientRepo,
                              SimpMessagingTemplate messagingTemplate) {
        this.reservationRepo = reservationRepo;
        this.appartementRepo = appartementRepo;
        this.clientRepo = clientRepo;
        this.messagingTemplate = messagingTemplate;
    }

    private void envoyerApresCommit(String destination, Object payload) {
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override public void afterCommit() {
                messagingTemplate.convertAndSend(destination, payload);
            }
        });
    }

    @Transactional
    public Reservation creerDemandeReservation(long appartementId, long clientId,
                                               LocalDate dateDebut, LocalDate dateFin) {
        if (dateDebut == null || dateFin == null || !dateDebut.isBefore(dateFin)) {
            throw new IllegalArgumentException("La date de départ doit être postérieure à la date d'arrivée.");
        }
        if (dateDebut.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La date d'arrivée ne peut pas être dans le passé.");
        }

        Appartement appartement = appartementRepo.findByIdForUpdate(appartementId)
                .orElseThrow(() -> new RuntimeException("Appartement introuvable"));
        if (appartement.getStatut() == StatutAppartement.INDISPONIBLE) {
            throw new IllegalStateException("Cet appartement est indisponible.");
        }
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        if (reservationRepo.countActiveReservationsByClientAndAppartement(appartementId, clientId) > 0) {
            throw new IllegalStateException("Vous avez déjà une réservation en cours pour cet appartement.");
        }
        if (reservationRepo.countOverlapping(appartementId, dateDebut, dateFin, 0) > 0) {
            throw new IllegalStateException("Les dates sélectionnées ne sont plus disponibles.");
        }

        long nuits = ChronoUnit.DAYS.between(dateDebut, dateFin);
        Reservation r = new Reservation();
        r.setAppartement(appartement);
        r.setClient(client);
        r.setDateDebut(dateDebut);
        r.setDateFin(dateFin);
        r.setDateCreation(LocalDateTime.now());
        r.setDateExpirationBlocage(LocalDateTime.now().plusHours(BLOCAGE_HEURES));
        r.setPrixTotal(nuits * appartement.getPrixParNuit());
        r.setStatut(StatutReservation.EN_ATTENTE);
        r.setStatutPaiement(StatutPaiement.EN_ATTENTE);
        r.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        Reservation saved = reservationRepo.save(r);

        Map<String, Object> notif = new HashMap<>();
        notif.put("message", "Nouvelle demande de réservation #" + saved.getNumeroReservation());
        notif.put("reservationId", saved.getId());
        envoyerApresCommit("/topic/admin-notifications", notif);
        return saved;
    }

    @Transactional
    public Reservation confirmerReservation(long reservationId) {
        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        if (r.getStatut() != StatutReservation.EN_ATTENTE) {
            throw new IllegalStateException("Seule une demande en attente peut être confirmée.");
        }
        appartementRepo.findByIdForUpdate(r.getAppartement().getId());
        if (reservationRepo.countOverlapping(r.getAppartement().getId(),
                r.getDateDebut(), r.getDateFin(), r.getId()) > 0) {
            throw new IllegalStateException("Ces dates sont déjà prises par une autre réservation.");
        }
        r.setStatut(StatutReservation.CONFIRMEE);
        Reservation saved = reservationRepo.save(r);

        Map<String, Object> notif = new HashMap<>();
        notif.put("message", "Votre réservation " + saved.getNumeroReservation()
                + " a été confirmée ! Veuillez procéder au paiement.");
        notif.put("status", "CONFIRMEE");
        notif.put("reservationId", saved.getId());
        envoyerApresCommit("/topic/client-notifications/" + saved.getClient().getId(), notif);
        return saved;
    }

    @Transactional
    public Reservation refuserReservation(long reservationId) {
        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        if (r.getStatut() != StatutReservation.EN_ATTENTE) {
            throw new IllegalStateException("Seule une demande en attente peut être refusée.");
        }
        r.setStatut(StatutReservation.REFUSEE);
        r.setDateExpirationBlocage(null);
        Reservation saved = reservationRepo.save(r);

        Map<String, Object> notif = new HashMap<>();
        notif.put("message", "Votre demande pour la réservation " + saved.getNumeroReservation() + " a été refusée.");
        notif.put("status", "REFUSEE");
        notif.put("reservationId", saved.getId());
        envoyerApresCommit("/topic/client-notifications/" + saved.getClient().getId(), notif);
        return saved;
    }

    @Transactional
    public Reservation annulerReservation(long reservationId, long utilisateurId, boolean estAdmin) {
        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

        if (!estAdmin && r.getClient().getId() != utilisateurId) {
            throw new AccessDeniedException("Vous ne pouvez pas annuler cette réservation.");
        }

        if (r.getStatut() != StatutReservation.EN_ATTENTE
                && r.getStatut() != StatutReservation.CONFIRMEE) {
            throw new IllegalStateException("Cette réservation ne peut plus être annulée.");
        }

        if (!estAdmin && !LocalDate.now().isBefore(r.getDateDebut())) {
            throw new IllegalStateException("Le séjour a déjà commencé, annulation impossible.");
        }

        boolean dejaPaye = r.getStatutPaiement() == StatutPaiement.PAYE;

        r.setStatut(StatutReservation.ANNULEE);
        r.setDateExpirationBlocage(null);
        Reservation saved = reservationRepo.save(r);

        Map<String, Object> notifAdmin = new HashMap<>();
        notifAdmin.put("message", "Réservation #" + saved.getNumeroReservation() + " annulée"
                + (dejaPaye ? " (déjà payée : remboursement à traiter)." : "."));
        notifAdmin.put("reservationId", saved.getId());
        notifAdmin.put("status", "ANNULEE");
        envoyerApresCommit("/topic/admin-notifications", notifAdmin);

        Map<String, Object> notifClient = new HashMap<>();
        notifClient.put("message", "La réservation " + saved.getNumeroReservation() + " a été annulée.");
        notifClient.put("status", "ANNULEE");
        notifClient.put("reservationId", saved.getId());
        envoyerApresCommit("/topic/client-notifications/" + saved.getClient().getId(), notifClient);

        return saved;
    }

    @Transactional
    public Reservation changerStatut(long id, StatutReservation statut) {
        return switch (statut) {
            case CONFIRMEE -> confirmerReservation(id);
            case REFUSEE -> refuserReservation(id);
            default -> {
                Reservation r = reservationRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
                r.setStatut(statut);
                yield reservationRepo.save(r);
            }
        };
    }

    public List<ReservationBloqueeDto> getReservationsBloquantes(long appartementId) {
        return reservationRepo.findReservationsBloquantes(appartementId).stream()
                .map(r -> new ReservationBloqueeDto(r.getDateDebut(), r.getDateFin()))
                .toList();
    }

    public List<Reservation> getByClient(long clientId) { return reservationRepo.findByClientId(clientId); }
    public List<Reservation> getAll() { return reservationRepo.findAll(); }

    public Map<String, String> creerStripePaymentIntent(long reservationId) throws Exception {
        Stripe.apiKey = stripeSecretKey;
        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        if (r.getStatut() != StatutReservation.CONFIRMEE) {
            throw new IllegalStateException("La réservation doit d'abord être confirmée par l'administrateur.");
        }
        PaymentIntent intent = PaymentIntent.create(PaymentIntentCreateParams.builder()
                .setAmount((long) (r.getPrixTotal() * 100))
                .setCurrency("mad")
                .putMetadata("reservationId", String.valueOf(r.getId()))
                .build());
        return Map.of("clientSecret", intent.getClientSecret(), "paymentIntentId", intent.getId());
    }

    @Transactional
    public void validerPaiementReussi(long reservationId, String paymentIntentId) throws Exception {
        Stripe.apiKey = stripeSecretKey;
        PaymentIntent pi = PaymentIntent.retrieve(paymentIntentId);
        if (!"succeeded".equals(pi.getStatus())
                || !String.valueOf(reservationId).equals(pi.getMetadata().get("reservationId"))) {
            throw new IllegalStateException("Paiement non validé par Stripe.");
        }
        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        r.setStatutPaiement(StatutPaiement.PAYE);
        reservationRepo.save(r);

        Map<String, Object> notif = new HashMap<>();
        notif.put("message", "Paiement reçu pour la réservation #" + r.getNumeroReservation());
        notif.put("reservationId", r.getId());
        envoyerApresCommit("/topic/admin-notifications", notif);
        envoyerApresCommit("/topic/client-notifications/" + r.getClient().getId(), notif);
    }


    @Transactional
    public Reservation modifierDates(long reservationId, long utilisateurId,
                                     LocalDate dateDebut, LocalDate dateFin) {
        if (dateDebut == null || dateFin == null || !dateDebut.isBefore(dateFin)) {
            throw new IllegalArgumentException("La date de départ doit être postérieure à la date d'arrivée.");
        }
        if (dateDebut.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La date d'arrivée ne peut pas être dans le passé.");
        }

        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

        if (r.getClient().getId() != utilisateurId) {
            throw new AccessDeniedException("Vous ne pouvez pas modifier cette réservation.");
        }
        if (r.getStatut() != StatutReservation.EN_ATTENTE
                && r.getStatut() != StatutReservation.CONFIRMEE) {
            throw new IllegalStateException("Cette réservation ne peut plus être modifiée.");
        }
        if (r.getStatutPaiement() == StatutPaiement.PAYE) {
            throw new IllegalStateException("Réservation déjà payée : contactez l'administration pour modifier les dates.");
        }
        if (!LocalDate.now().isBefore(r.getDateDebut())) {
            throw new IllegalStateException("Le séjour a déjà commencé, modification impossible.");
        }

        Appartement appartement = appartementRepo.findByIdForUpdate(r.getAppartement().getId())
                .orElseThrow(() -> new RuntimeException("Appartement introuvable"));

        if (reservationRepo.countOverlapping(appartement.getId(), dateDebut, dateFin, r.getId()) > 0) {
            throw new IllegalStateException("Les dates sélectionnées ne sont pas disponibles.");
        }

        long nuits = ChronoUnit.DAYS.between(dateDebut, dateFin);
        r.setDateDebut(dateDebut);
        r.setDateFin(dateFin);
        r.setPrixTotal(nuits * appartement.getPrixParNuit());
        r.setStatut(StatutReservation.EN_ATTENTE);
        r.setDateExpirationBlocage(LocalDateTime.now().plusHours(BLOCAGE_HEURES));
        Reservation saved = reservationRepo.save(r);

        Map<String, Object> notif = new HashMap<>();
        notif.put("message", "Dates modifiées pour la réservation #" + saved.getNumeroReservation()
                + " : nouvelle validation requise.");
        notif.put("reservationId", saved.getId());
        envoyerApresCommit("/topic/admin-notifications", notif);
        return saved;
    }
}