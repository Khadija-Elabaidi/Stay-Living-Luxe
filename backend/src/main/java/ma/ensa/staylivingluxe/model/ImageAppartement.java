package ma.ensa.staylivingluxe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ImageAppartement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String imgUrl;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;
}
