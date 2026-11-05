import { useEffect, useState } from 'react';
import {
  getAllReservations,
  updateReservationStatut,
  annulerReservation
} from "../../../../services/reservationService/ReservationService";
import './AdminReservations.css';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); 
  const [processing, setProcessing] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    chargerReservations();
  }, []);

  const chargerReservations = async () => {
    try {
      const data = await getAllReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const majStatutLocal = (id, statut) =>
    setReservations(prev => prev.map(res => res.id === id ? { ...res, statut } : res));

  const handleConfirmer = async (id) => {
    try {
      await updateReservationStatut(id, 'CONFIRMEE');
      majStatutLocal(id, 'CONFIRMEE');
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la confirmation");
    }
  };

  const ouvrirModal = (type, id) => {
    setErreur('');
    setModal({ type, id });
  };

  const fermerModal = () => {
    if (processing) return;
    setModal(null);
    setErreur('');
  };

  // Action confirmée dans la modale
  const executerAction = async () => {
    if (!modal) return;
    setProcessing(true);
    setErreur('');
    try {
      if (modal.type === 'ANNULER') {
        const maj = await annulerReservation(modal.id);
        majStatutLocal(modal.id, maj.statut);
      } else {
        await updateReservationStatut(modal.id, 'REFUSEE');
        majStatutLocal(modal.id, 'REFUSEE');
      }
      setModal(null);
    } catch (err) {
      setErreur(err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setProcessing(false);
    }
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'CONFIRMEE':
        return <span className="badge badge-success">Confirmée</span>;
      case 'REFUSEE':
        return <span className="badge badge-danger">Refusée</span>;
      case 'ANNULEE':
        return <span className="badge badge-secondary">Annulée</span>;
      default:
        return <span className="badge badge-warning">🔄 En attente</span>;
    }
  };

  const modalTextes = {
    ANNULER: {
      titre: "Annuler la réservation",
      message: "Voulez-vous vraiment annuler cette réservation ? Les dates seront libérées.",
      bouton: "Oui, annuler",
    },
    REFUSER: {
      titre: "Refuser la demande",
      message: "Voulez-vous vraiment refuser cette demande de réservation ?",
      bouton: "Oui, refuser",
    },
  };

  if (loading) return <div className="loading-state">Chargement des réservations...</div>;

  return (
    <div className="admin-reservations-container">
      <h2>Gestion des Réservations</h2>

      <div className="table-card">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Appartement</th>
              <th>Nom Client</th>
              <th>Date d'arrivée</th>
              <th>Date de départ</th>
              <th>Prix Total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Aucune réservation trouvée.
                </td>
              </tr>
            ) : (
              reservations.map((res) => (
                <tr key={res.id}>
                  <td>
                    <strong>
                      {res.appartement?.titre || res.appartement?.nom || `Appartement #${res.appartement?.id}`}
                    </strong>
                  </td>
                  <td>
                    {res.client
                      ? `${res.client.nom || ''} ${res.client.prenom || ''}`.trim() || res.client.email
                      : 'Client Inconnu'}
                  </td>
                  <td>{res.dateDebut}</td>
                  <td>{res.dateFin}</td>
                  <td className="price-cell">{res.prixTotal} DH</td>
                  <td>{getStatutBadge(res.statut)}</td>
                  <td>
                    {res.statut === 'EN_ATTENTE' && (
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-accept"
                          title="Accepter"
                          onClick={() => handleConfirmer(res.id)}
                        >
                          ✓
                        </button>
                        <button
                          className="btn-action btn-reject"
                          title="Refuser"
                          onClick={() => ouvrirModal('REFUSER', res.id)}
                        >
                          ✕
                        </button>
                        <button
                          className="btn-action btn-cancel"
                          title="Annuler"
                          onClick={() => ouvrirModal('ANNULER', res.id)}
                        >
                          🚫
                        </button>
                      </div>
                    )}

                    {res.statut === 'CONFIRMEE' && (
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-cancel"
                          title="Annuler"
                          onClick={() => ouvrirModal('ANNULER', res.id)}
                        >
                          🚫
                        </button>
                      </div>
                    )}

                    {(res.statut === 'REFUSEE' || res.statut === 'ANNULEE') && (
                      <span className="text-muted">Aucune action</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={fermerModal}>
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modalTextes[modal.type].titre}</h3>
            <p>{modalTextes[modal.type].message}</p>

            {erreur && <p className="modal-error">{erreur}</p>}

            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={fermerModal} disabled={processing}>
                Retour
              </button>
              <button className="modal-btn modal-btn-danger" onClick={executerAction} disabled={processing}>
                {processing ? "Traitement..." : modalTextes[modal.type].bouton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;