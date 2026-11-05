package ma.ensa.staylivingluxe.repository;


import jakarta.persistence.LockModeType;
import ma.ensa.staylivingluxe.model.Appartement;
import ma.ensa.staylivingluxe.model.StatutAppartement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppartementRepo extends JpaRepository<Appartement, Long>, JpaSpecificationExecutor<Appartement> {

    Appartement findAppartementById(long appartementId);

    List<Appartement> findByStatut(StatutAppartement statut);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appartement a WHERE a.id = :id")
    Optional<Appartement> findByIdForUpdate(@Param("id") long id);

}