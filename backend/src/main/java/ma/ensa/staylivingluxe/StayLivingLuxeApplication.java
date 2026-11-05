package ma.ensa.staylivingluxe;

import ma.ensa.staylivingluxe.service.AppartementService;
import ma.ensa.staylivingluxe.service.ClientService;
import ma.ensa.staylivingluxe.service.ReservationService;
import ma.ensa.staylivingluxe.service.UtilisateurService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StayLivingLuxeApplication implements CommandLineRunner {

    private final AppartementService appartementService;
    private final UtilisateurService  utilisateurService;
    private final ReservationService  reservationService;
    private final ClientService clientService;

    public StayLivingLuxeApplication(AppartementService appartementService,
                                     UtilisateurService utilisateurService,
                                     ReservationService reservationService,
                                     ClientService clientService) {
        this.appartementService = appartementService;
        this.utilisateurService = utilisateurService;
        this.reservationService = reservationService;
        this.clientService = clientService;
    }

    public static void main(String[] args) {
        SpringApplication.run(StayLivingLuxeApplication.class, args);
    }

    @Override
    public void run(String... args) {

    }
}


