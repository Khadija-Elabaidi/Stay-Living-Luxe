package ma.ensa.staylivingluxe.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private LocalDateTime dateCreation;
    private LocalDateTime dateExpirationBlocage;

    private double prixTotal;

    @Enumerated(EnumType.STRING)
    private StatutReservation statut;

    @Enumerated(EnumType.STRING)
    private StatutPaiement statutPaiement;

    @Column(unique = true)
    private String numeroReservation;

    @ManyToOne
    @JsonIgnoreProperties({"reservations", "hibernateInitializer", "handler"})
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}