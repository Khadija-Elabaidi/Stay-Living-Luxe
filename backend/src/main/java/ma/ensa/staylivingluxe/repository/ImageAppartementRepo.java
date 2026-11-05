package ma.ensa.staylivingluxe.repository;

import ma.ensa.staylivingluxe.model.ImageAppartement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageAppartementRepo extends JpaRepository<ImageAppartement, Long> {
}
