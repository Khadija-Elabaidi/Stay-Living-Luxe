package ma.ensa.staylivingluxe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void envoyerNotificationAdmin(
            long clientId, String nomClient, String prenomClient, String emailClient,
            long appartementId, String titreAppartement, double prixParNuit,
            String numeroReservation, String dateDebut, String dateFin, double prixTotal) {

        String safeNom = nomClient != null ? nomClient : "";
        String safePrenom = prenomClient != null ? prenomClient : "";
        String safeEmail = emailClient != null ? emailClient : "Non renseigné";
        String safeTitre = titreAppartement != null ? titreAppartement : "Appartement #" + appartementId;

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("khadijaelabaidi21@gmail.com");
        mail.setSubject("Nouvelle réservation effectuée - " + numeroReservation);

        String corpsEmail = String.format(
                "Une nouvelle réservation a été enregistrée !\n\n" +
                        "--- INFORMATIONS CLIENT ---\n" +
                        "Nom: %s %s\n" +
                        "Email: %s\n\n" +
                        "--- INFORMATIONS APPARTEMENT ---\n" +

                        "Titre: %s\n" +
                        "Prix par nuit: %.2f DH\n\n" +
                        "--- DÉTAILS RÉSERVATION ---\n" +
                        "Numéro: %s\n" +
                        "Date d'arrivée: %s\n" +
                        "Date de départ: %s\n" +
                        "Montant total: %.2f DH\n",

                safeNom,
                safePrenom,
                safeEmail,
                safeTitre,
                prixParNuit,
                numeroReservation,
                dateDebut,
                dateFin,
                prixTotal
        );

        mail.setText(corpsEmail);
        mailSender.send(mail);
    }
}