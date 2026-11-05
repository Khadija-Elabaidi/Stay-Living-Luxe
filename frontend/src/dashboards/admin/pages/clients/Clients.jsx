import { useEffect, useState } from "react";
import {
  getAllClients,
  deleteClient,
} from "../../../../services/clientService/ClientService";
import "./Clients.css";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchClients = async () => {
    try {
      setLoading(true);
      setClients(await getAllClients());
      setError("");
    } catch (e) {
      setError("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!clientToDelete) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !deleting) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clientToDelete, deleting]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const openModal = (client) => {
    setDeleteError("");
    setClientToDelete(client);
  };

  const closeModal = () => {
    setClientToDelete(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      setDeleting(true);
      setDeleteError("");
      await deleteClient(clientToDelete.id);

      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      setSuccess(
        `${clientToDelete.prenom} ${clientToDelete.nom} a été supprimé avec succès.`
      );
      closeModal();
    } catch (e) {
      const status = e.response?.status;
      const data = e.response?.data;
      const message =
        (typeof data === "string" ? data : data?.message || data?.error) ||
        "Une erreur est survenue lors de la suppression.";

      console.error("DELETE error:", status, data);

      if (status === 404) {
        closeModal();
        fetchClients();
        setSuccess("");
        setError("Client introuvable, la liste a été actualisée.");
        setTimeout(() => setError(""), 3000);
      } else {
        setDeleteError(message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const filtered = clients.filter((c) =>
    `${c.nom} ${c.prenom} ${c.email} ${c.telephone ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h2>Historique des clients</h2>
        <input
          type="text"
          placeholder="Rechercher (nom, email, téléphone)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {success && <div className="clients-success">{success}</div>}
      {loading && <p>Chargement...</p>}
      {error && <p className="clients-error">{error}</p>}

      {!loading && !error && (
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Réservations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Aucun client trouvé
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.nom}</td>
                  <td>{c.prenom}</td>
                  <td>{c.email}</td>
                  <td>{c.telephone || "-"}</td>
                  <td>{c.nombreReservations}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => openModal(c)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {clientToDelete && (
        <div
          className="modal-overlay"
          onClick={() => !deleting && closeModal()}
        >
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">!</div>
            <h3 id="modal-title">Supprimer ce client ?</h3>

            <p className="modal-text">
              Vous êtes sur le point de supprimer{" "}
              <strong>
                {clientToDelete.prenom} {clientToDelete.nom}
              </strong>{" "}
              ({clientToDelete.email}).
            </p>

            {clientToDelete.nombreReservations > 0 && (
              <p className="modal-warning">
                Ses {clientToDelete.nombreReservations} réservation(s) seront
                aussi supprimées définitivement.
              </p>
            )}

            

            {deleteError && <p className="modal-error">{deleteError}</p>}

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={closeModal}
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                className="btn-confirm"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}