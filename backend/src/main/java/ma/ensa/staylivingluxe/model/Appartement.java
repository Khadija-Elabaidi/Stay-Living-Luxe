package ma.ensa.staylivingluxe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class Appartement {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    private String titre;
    private String description;
    private String adresse;
    private long prixParNuit;
    private String imgPrincipalUrl;

    @Enumerated(EnumType.STRING)
    private StatutAppartement statut;
    private int capacite;
    private int nbreDeLit;
    private int nbreSalleDeBain;



    @JsonIgnore
    @OneToMany(mappedBy = "appartement", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "appartement",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ImageAppartement> images = new ArrayList<>();
}
