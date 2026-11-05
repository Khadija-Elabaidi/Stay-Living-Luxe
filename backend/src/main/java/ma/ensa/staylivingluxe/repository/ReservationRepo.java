package ma.ensa.staylivingluxe.repository;

import ma.ensa.staylivingluxe.model.Client;
import ma.ensa.staylivingluxe.model.Reservation;
import ma.ensa.staylivingluxe.model.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Long>, JpaSpecificationExecutor<Reservation> {

    Reservation findByNumeroReservation(String numeroReservation);

    List<Reservation> findByClientId(long clientId);

    List<Reservation> findByStatut(StatutReservation statut);

    @Query("SELECT r FROM Reservation r WHERE r.appartement.id = :appartementId")
    List<Reservation> findByAppartementId(@Param("appartementId") long appartementId);

    @Query("""
    SELECT COUNT(r) FROM Reservation r
    WHERE r.appartement.id = :appartementId AND r.client.id = :clientId
    AND r.dateFin > CURRENT_DATE
    AND (
        r.statut = ma.ensa.staylivingluxe.model.StatutReservation.CONFIRMEE
        OR (r.statut = ma.ensa.staylivingluxe.model.StatutReservation.EN_ATTENTE
            AND r.dateExpirationBlocage > CURRENT_TIMESTAMP)
    )
""")
    long countActiveReservationsByClientAndAppartement(@Param("appartementId") long appartementId,
                                                       @Param("clientId") long clientId);


    @Query("""
    SELECT COUNT(r) FROM Reservation r
    WHERE r.appartement.id = :appartementId
    AND r.id <> :excludeId
    AND (
        r.statut IN (ma.ensa.staylivingluxe.model.StatutReservation.CONFIRMEE,
                     ma.ensa.staylivingluxe.model.StatutReservation.EN_COURS)
        OR (r.statut = ma.ensa.staylivingluxe.model.StatutReservation.EN_ATTENTE
            AND r.dateExpirationBlocage > CURRENT_TIMESTAMP)
    )
    AND r.dateDebut < :dateFin AND r.dateFin > :dateDebut
""")
    long countOverlapping(@Param("appartementId") long appartementId,
                          @Param("dateDebut") LocalDate dateDebut,
                          @Param("dateFin") LocalDate dateFin,
                          @Param("excludeId") long excludeId);

    @Query("""
        SELECT r FROM Reservation r 
        WHERE r.appartement.id = :appartementId 
        AND (
            r.statut = ma.ensa.staylivingluxe.model.StatutReservation.CONFIRMEE 
            OR (r.statut = ma.ensa.staylivingluxe.model.StatutReservation.EN_ATTENTE AND r.dateExpirationBlocage > CURRENT_TIMESTAMP)
        )
    """)
    List<Reservation> findReservationsBloquantes(@Param("appartementId") long appartementId);

    boolean existsByClient(Client client);

}