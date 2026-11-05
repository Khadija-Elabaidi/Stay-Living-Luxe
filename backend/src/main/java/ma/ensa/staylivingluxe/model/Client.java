package ma.ensa.staylivingluxe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@PrimaryKeyJoinColumn(name = "utilisateur_id")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Client extends Utilisateur {

    @JsonIgnore
    @OneToMany(mappedBy = "client", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    @JsonProperty("nombreReservations")
    public int getNombreReservations() {
        return reservations == null ? 0 : reservations.size();
    }
}