import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppartementById } from "../../services/AppartementService/AppartementService";
import './DetailsAppartement.css';
import Reservation from '../../components/Reservation/Reservation';
import AuthModal from '../../components/AuthModal/AuthModal';
import { BedDouble, Bath, Users } from 'lucide-react';

const DetailsAppartement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadAppartement = async () => {
      try {
        setLoading(true);
        const appart = await getAppartementById(id);
        setApartment(appart);
      } catch (error) {
        console.error("Erreur chargement appartement :", error);
        setApartment(null);
      } finally {
        setLoading(false);
      }
    };

    loadAppartement();
  }, [id]);

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    setUser(null);
  };

  const processBooking = async (reservationData, activeUser) => {
    try {
      const currentUserData =
        activeUser ||
        user ||
        JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');

      const params = new URLSearchParams({
        appartementId: apartment?.id || id,
        clientId: currentUserData.id,
        dateDebut: reservationData.arrivalDate,
        dateFin: reservationData.departureDate
      });

      const response = await fetch(`http://localhost:8085/api/reservations?${params.toString()}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearSession();
          setPendingReservation(reservationData);
          setIsAuthOpen(true);
          return;
        }

        const errorText = await response.text();
        let message = "Erreur lors de la réservation";

        try {
          message = JSON.parse(errorText).message || message;
        } catch {
          if (errorText) message = errorText;
        }

        if (response.status === 409) {
          setRefreshKey((k) => k + 1); 
        }

        throw new Error(message);
      }

      alert("Demande envoyée. Vous serez notifié dès la réponse de l'administrateur.");
      navigate('/client');
    } catch (error) {
      console.error("Erreur réservation :", error);
      alert(error.message);
    }
  };

  const handleNeedAuth = (reservationData) => {
    setPendingReservation(reservationData);
    setIsAuthOpen(true);
  };

  const handleReserveDirect = (reservationData, activeUser) => {
    processBooking(reservationData, activeUser);
  };

  const handleLoginSuccess = (userData) => {
    let loggedUser = userData;
    if (!loggedUser) {
      try {
        loggedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      } catch {
        loggedUser = null;
      }
    }

    setUser(loggedUser);
    setIsAuthOpen(false);

    
    if (pendingReservation?.arrivalDate && pendingReservation?.departureDate) {
      processBooking(pendingReservation, loggedUser);
    }
    setPendingReservation(null);
  };

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Chargement...</div>;
  }

  if (!apartment) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Appartement introuvable</h2>
        <button
          onClick={() => navigate('/logements')}
          style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Retour aux logements
        </button>
      </div>
    );
  }

  const allImages = [
    ...(apartment.imgPrincipalUrl ? [`http://localhost:8085/uploads/${apartment.imgPrincipalUrl}`] : []),
    ...(apartment.images || []).map(img => `http://localhost:8085/uploads/${img.imgUrl}`)
  ];

  if (allImages.length === 0) {
    allImages.push('/placeholder.jpg'); 
  }

  return (
    <div className="details-appartement-page">
      <div className="appartement-container">
        <header className="annonce-header">
          <div className="header-left">
            <h1>{apartment.titre || apartment.title || apartment.name}</h1>
            {(apartment.adresse || apartment.location) && (
              <p className="location-text">📍 {apartment.adresse || apartment.location}</p>
            )}
          </div>
          
        </header>

        <div className="gallery-grid">
          <div className="main-photo" onClick={() => { setCurrentIndex(0); setShowModal(true); }}>
            <img src={allImages[0]} alt={apartment.titre || "Photo principale"} />
          </div>
          <div className="sub-photos-grid">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="grid-item"
                onClick={() => { setCurrentIndex(index < allImages.length ? index : 0); setShowModal(true); }}
              >
                <img src={allImages[index] || allImages[0]} alt={`Aperçu ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
f
        <div className="content-layout">
          <main className="details-section">
            <div className="features-bar">
              <h2>{apartment.titre || apartment.name}</h2>
              <div className="specs">
                <span><BedDouble size={16} /> {apartment.nbreDeLit || 2} lits | </span>
                <span><Bath size={16} /> {apartment.nbreSalleDeBain || 1} sdb | </span>
                <span><Users size={16} /> {apartment.capacite || 4} pers.  | </span>
                <span>{apartment.prixParNuit || apartment.prixParNuit} DH / nuit</span>
              </div>
            </div>

            <section className="description">
              <h3>Description</h3>
              <p>{apartment.description || "Découvrez cet appartement d'exception proposé par Stay Living Luxe."}</p>
            </section>
          </main>

          <aside className="contact-sidebar">
            <Reservation
              key={refreshKey}
              user={user}
              apartment={apartment}
              onNeedAuth={handleNeedAuth}
              onReserve={handleReserveDirect}
            />
          </aside>
        </div>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
};

export default DetailsAppartement;
