package ma.ensa.staylivingluxe.repository;

import ma.ensa.staylivingluxe.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepo extends JpaRepository<Client,Long> {

}
