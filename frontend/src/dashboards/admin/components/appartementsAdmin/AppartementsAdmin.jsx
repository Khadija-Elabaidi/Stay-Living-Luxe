import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Building, 
  CheckCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  Clock, 
  XCircle 
} from 'lucide-react';

import { 
  getAllAppartements, 
  deleteAppartement, 
  updateStatut,
  updateAppartement 
} from '../../../../services/appartementService/AppartementService';

import UpdateAppartement from "../../pages/updateAppartement/UpdateAppartement";
import AddAppartement from '../../pages/addAppartement/AddAppartement';
import './AppartementsAdmin.css';

export default function AppartementsAdmin() {
  const [appartements, setAppartements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [selectedAppartement, setSelectedAppartement] = useState(null); 
  const fetchAppartements = async () => {
    try {
      setLoading(true);
      const response = await getAllAppartements();
      setAppartements(response.data || response || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des logements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppartements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet appartement ?')) {
      try {
        await deleteAppartement(id);
        setAppartements((prev) => prev.filter((apt) => apt.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Impossible de supprimer cet appartement.');
      }
    }
  };

  const handleStatutChange = async (id, newStatut) => {
    setUpdatingId(id);
    try {
      await updateStatut(id, newStatut);
      setAppartements((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, statut: newStatut } : apt))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors du changement de statut.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditClick = (apt) => {
    setSelectedAppartement(apt);
    setIsEditModalOpen(true);
  };

  const filteredAppartements = useMemo(() => {
    return appartements.filter(
      (apt) =>
        apt.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appartements, searchTerm]);

  const totalAppartements = appartements.length;
  const appartementsDisponibles = useMemo(
    () => appartements.filter((apt) => apt.statut === 'DISPONIBLE').length,
    [appartements]
  );

  return (
    <div className="admin-dashboard-container">
      <div className="welcome-bar">
        <div>
          <h1 className="welcome-title">Gestion des Appartements</h1>
          <p className="welcome-subtitle">Aperçu et administration de vos biens immobiliers</p>
        </div>
        <div className="top-actions">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un logement..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-gold" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Ajouter un logement
          </button>
        </div>
      </div>

      <div className="stats-grid-two">
        <div className="stat-card">
          <div className="stat-icon-wrapper dark-bg">
            <Building size={24} />
          </div>
          <div>
            <div className="stat-label">Total des Logements</div>
            <div className="stat-value">{totalAppartements}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper gold-bg">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-label">Logements Disponibles</div>
            <div className="stat-value">
              {appartementsDisponibles} <span className="stat-sub">/ {totalAppartements}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Liste des logements</h2>
            <p className="panel-desc">Gérez l'ensemble des appartements répertoriés.</p>
          </div>

          {loading ? (
            <div className="loading-state">Chargement des logements...</div>
          ) : (
            <div className="table-responsive">
              <table className="appartements-table">
                <thead>
                  <tr>
                    <th>Logement</th>
                    <th>Prix / Nuit</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppartements.length > 0 ? (
                    filteredAppartements.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <div className="appartement-cell">
                            <img 
                              src={`http://localhost:8085/uploads/${apt.imgPrincipalUrl}`} 
                              alt={apt.titre} 
                              className="apt-thumb"
                            />
                            <div>
                              <div className="apt-title">{apt.titre}</div>
                              <div className="apt-sub">{apt.adresse}</div>
                            </div>
                          </div>
                        </td>
                        <td className="price-cell">{apt.prixParNuit} DH</td>
                        <td>
                          <span className={`status-pill ${apt.statut?.toLowerCase()}`}>
                            {apt.statut}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <Link to={`/admin/appartement/${apt.id}`}>
                            <button className="action-btn view-btn" title="Voir les détails">
                              <Eye size={16} />
                            </button>
                          </Link>
                          
                          <button 
                            className="action-btn edit-btn" 
                            title="Modifier"
                            onClick={() => handleEditClick(apt)}
                          >
                            <Edit size={16} />
                          </button>

                          <button 
                            className="action-btn delete-btn" 
                            title="Supprimer"
                            onClick={() => handleDelete(apt.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-table-cell">
                        Aucun logement trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Changer la Disponibilité</h2>
            <p className="panel-desc">Mise à jour rapide de l'état des logements.</p>
          </div>

          <div className="availability-list">
            {appartements.map((apt) => (
              <div key={apt.id} className="availability-item">
                <div className="apt-info-compact">
                  <span className="apt-name">{apt.titre}</span>
                  <span className={`current-badge ${apt.statut?.toLowerCase()}`}>
                    {apt.statut}
                  </span>
                </div>
                <div className="status-toggle-buttons">
                  <button 
                    disabled={updatingId === apt.id}
                    className={`status-btn ${apt.statut === 'DISPONIBLE' ? 'active-disp' : ''}`}
                    onClick={() => handleStatutChange(apt.id, 'DISPONIBLE')}
                  >
                    <Check size={14} /> Dispo
                  </button>
                  <button 
                    disabled={updatingId === apt.id}
                    className={`status-btn ${apt.statut === 'RESERVE' ? 'active-res' : ''}`}
                    onClick={() => handleStatutChange(apt.id, 'RESERVE')}
                  >
                    <Clock size={14} /> Réservé
                  </button>
                  <button 
                    disabled={updatingId === apt.id}
                    className={`status-btn ${apt.statut === 'INDISPONIBLE' ? 'active-indispo' : ''}`}
                    onClick={() => handleStatutChange(apt.id, 'INDISPONIBLE')}
                  >
                    <XCircle size={14} /> Indispo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddAppartement 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAppartementAdded={fetchAppartements}
      />

      <UpdateAppartement 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        appartement={selectedAppartement}
        onAppartementUpdated={fetchAppartements}
      />
    </div>
  );
}