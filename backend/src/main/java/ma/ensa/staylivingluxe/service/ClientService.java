package ma.ensa.staylivingluxe.service;

import lombok.RequiredArgsConstructor;
import ma.ensa.staylivingluxe.model.Client;
import ma.ensa.staylivingluxe.repository.ClientRepo;
import ma.ensa.staylivingluxe.repository.ReservationRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepo clientRepo;
    private final ReservationRepo reservationRepo;

    public Client createClient(Client client) {
        return clientRepo.save(client);
    }

    @Transactional(readOnly = true)
    public List<Client> getAllClients() {
        return clientRepo.findAll();
    }

    @Transactional
    public void deleteClient(Long id) {
        Client client = clientRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Client introuvable avec l'id " + id));

        clientRepo.delete(client);
    }
}