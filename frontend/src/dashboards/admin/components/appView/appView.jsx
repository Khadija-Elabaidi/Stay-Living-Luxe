import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllAppartements } from "../../../../services/appartementService/AppartementService";
import './appView.css';
import { BedDouble, Bath, Users } from 'lucide-react';

const AppView = () =>  {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('user') || 'null');
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadAppartement = async () => {
      try {
        const appartements = await getAllAppartements();
        const appart = appartements.find(a => a.id == id);
        setApartment(appart);
      } catch (error) {
        console.error("Erreur chargement appartement :", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppartement();
  }, [id]);

const processBooking = async (reservationData, activeUser) => {
    try {
      const currentUserData = activeUser || user || JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');

      const params = new URLSearchParams({
        appartementId: apartment?.id || id,
        clientId: currentUserData.id,
        dateDebut: reservationData.arrivalDate, 
        dateFin: reservationData.departureDate    
      });

      const response = await fetch(`/api/reservations?${params.toString()}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la réservation sur le serveur");
      }

      navigate('/client');
    } catch (error) {
      console.error("Erreur réservation :", error);
      alert("Une erreur est survenue lors de votre réservation. Veuillez réessayer.");
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
    const loggedUser = userData || JSON.parse(localStorage.getItem('currentUser') || 'null');
    setUser(loggedUser);
    setIsAuthOpen(false);

    if (pendingReservation) {
      processBooking(pendingReservation, loggedUser);
      setPendingReservation(null);
    } else {
      navigate('/client');
    }
  };

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Chargement...</div>;
  }

  if (!apartment) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Appartement introuvable</h2>
        <button onClick={() => navigate('/logements')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
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
    allImages.push('https://via.placeholder.com/800x600?text=Pas+d%27image');
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
          <div className="header-right">
            {(apartment.prixParNuit || apartment.prix) && (
              <div className="price">
                {/* <span>{apartment.prixParNuit || apartment.prix} DH / nuit</span> */}
              </div>
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

        <div className="content-layout">
          <main className="details-section">
            <div className="features-bar">
              <h2>{apartment.titre || apartment.name}</h2>
              <div className="specs">
                <span><BedDouble size={16} /> {apartment.nbreDeLit || 2} lits | </span>
                <span><Bath size={16} /> {apartment.nbreSalleDeBain || 1} sdb | </span>
                <span><Users size={16} /> {apartment.capacite || 4} pers.</span>
              </div>
            </div>

            <section className="description">
              <h3>Description</h3>
              <p>{apartment.description || "Découvrez cet appartement d'exception proposé par Stay Living Luxe."}</p>
            </section>
          </main>

          
        </div>

        
      </div>
    </div>
  );
};

export default AppView;