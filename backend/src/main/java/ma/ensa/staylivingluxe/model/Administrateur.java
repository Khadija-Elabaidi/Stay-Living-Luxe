package ma.ensa.staylivingluxe.model;


import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;

@PrimaryKeyJoinColumn(name = "utilisateur_id")

@Entity
public class Administrateur extends Utilisateur{

}
