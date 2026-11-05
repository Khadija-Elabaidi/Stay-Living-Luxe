import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CalendarPicker from './CalendarPicker';
import './Reservation.css';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('user');
};

const getValidToken = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  if (!token) return null;

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearSession();
      return null;
    }
    return token;
  } catch {
    clearSession();
    return null;
  }
};

const Reservation = ({
  user = null,
  apartment = null,
  onNeedAuth,
  onReserve
}) => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const savedReservation = location.state?.reservationData;


  const [arrivalDate, setArrivalDate] = useState(savedReservation?.arrivalDate || '');
  const [departureDate, setDepartureDate] = useState(savedReservation?.departureDate || '');

  const [adults, setAdults] = useState(savedReservation?.adults || 1);
  const [children, setChildren] = useState(savedReservation?.children || 0);

  const [showArrivalCalendar, setShowArrivalCalendar] = useState(false);
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const [blockedReservations, setBlockedReservations] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);

  const dropdownRef = useRef(null);
  const reservationCardRef = useRef(null);


  const today = formatDate(new Date());
  const totalGuests = adults + children;
  const guestsText = `${totalGuests} voyageur${totalGuests > 1 ? 's' : ''}`;
  const apartmentUnavailable = apartment?.statut === 'INDISPONIBLE';
  const capacityReached = !!apartment?.capacite && totalGuests >= apartment.capacite;

 
  useEffect(() => {
    if (!apartment?.id) return;

    const controller = new AbortController();

    const loadBlockedReservations = async () => {
      try {
        setLoadingDates(true);
        const response = await fetch(
          `http://localhost:8085/api/reservations/bloquantes/${apartment.id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer les disponibilités.");
        }

        const reservations = await response.json();
        setBlockedReservations(Array.isArray(reservations) ? reservations : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Erreur chargement disponibilités :", error);
          setBlockedReservations([]);
        }
      } finally {
        setLoadingDates(false);
      }
    };

    loadBlockedReservations();

    return () => controller.abort();
  }, [apartment?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reservationCardRef.current &&
        !reservationCardRef.current.contains(event.target)
      ) {
        setShowArrivalCalendar(false);
        setShowDepartureCalendar(false);
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 
  const isDateBlocked = useCallback((dateString) => {
    return blockedReservations.some((reservation) => {
      const debut = reservation.dateDebut || reservation.date_debut;
      const fin = reservation.dateFin || reservation.date_fin;

      if (!debut || !fin) return false;

      return dateString >= debut && dateString < fin;
    });
  }, [blockedReservations]);

  const periodContainsBlockedDate = useCallback((startDate, endDate) => {
    const current = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    while (current < end) {
      if (isDateBlocked(formatDate(current))) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  }, [isDateBlocked]);

  const handleArrivalSelect = (date) => {
    if (date < today) {
      alert("La date d'arrivée ne peut pas être dans le passé.");
      return;
    }
    if (isDateBlocked(date)) {
      alert("Cette date n'est pas disponible.");
      return;
    }

    setArrivalDate(date);

    if (departureDate && (date >= departureDate || periodContainsBlockedDate(date, departureDate))) {
      setDepartureDate('');
    }

    setShowArrivalCalendar(false);
    setShowDepartureCalendar(true);
  };

  const handleDepartureSelect = (date) => {
    if (!arrivalDate) {
      alert("Veuillez d'abord sélectionner une date d'arrivée.");
      return;
    }

    if (date <= arrivalDate) {
      alert("La date de départ doit être postérieure à la date d'arrivée.");
      return;
    }

    if (periodContainsBlockedDate(arrivalDate, date)) {
      alert("La période sélectionnée contient des dates déjà réservées.");
      return;
    }

    setDepartureDate(date);
    setShowDepartureCalendar(false);
  };


  const getCancellationDateFormatted = () => {
    if (!arrivalDate) return '';
    const date = new Date(arrivalDate + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    });
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Sélectionner';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


  const handleReservation = () => {
    const reservationData = {
      arrivalDate,
      departureDate,
      adults,
      children,
      totalGuests,
      apartmentId: apartment?.id
    };

    const validToken = getValidToken();
    if (!validToken) {
      if (onNeedAuth) {
        onNeedAuth(reservationData); 
      } else {
        navigate('/login');
      }
      return;
    }

    if (!arrivalDate || !departureDate) {
      alert("Veuillez sélectionner les dates d'arrivée et de départ.");
      return;
    }

    if (arrivalDate >= departureDate) {
      alert("La date de départ doit être postérieure à la date d'arrivée.");
      return;
    }

    if (arrivalDate < today) {
      alert("La date d'arrivée ne peut pas être dans le passé.");
      return;
    }

    if (apartment?.capacite && totalGuests > apartment.capacite) {
      alert(`Capacité maximale : ${apartment.capacite} voyageurs.`);
      return;
    }

    if (periodContainsBlockedDate(arrivalDate, departureDate)) {
      alert("Les dates sélectionnées ne sont plus disponibles.");
      return;
    }

    let activeUser = user;
    if (!activeUser) {
      try {
        activeUser = JSON.parse(
          localStorage.getItem('currentUser') ||
          localStorage.getItem('user') ||
          'null'
        );
      } catch {
        activeUser = null;
      }
    }

    if (onReserve) {
      onReserve(reservationData, activeUser);
    } else {
      navigate('/client');
    }
  };

 
  return (
    <div className="reservation-card" ref={reservationCardRef}>
      <div className="reservation-inputs">
        <div className="date-grid">
          <div className="date-item arrival">
            <div
              className="date-display"
              onClick={() => {
                if (apartmentUnavailable) return;
                setShowArrivalCalendar((prev) => !prev);
                setShowDepartureCalendar(false);
                setShowGuestsDropdown(false);
              }}
            >
              <label>ARRIVÉE</label>
              <div className="selected-date">
                {formatDateForDisplay(arrivalDate)}
              </div>
            </div>

            {showArrivalCalendar && (
              <div
                className="calendar-dropdown arrival-calendar"
                onClick={(e) => e.stopPropagation()}
              >
                {loadingDates ? (
                  <div className="calendar-loading">
                    Chargement des disponibilités...
                  </div>
                ) : (
                  <CalendarPicker
                    mode="arrival"
                    selectedDate={arrivalDate}
                    onSelect={handleArrivalSelect}
                    blockedReservations={blockedReservations}
                    minDate={today}
                    apartmentUnavailable={apartmentUnavailable}
                  />
                )}
              </div>
            )}
          </div>

          <div className="date-item departure">
            <div
              className="date-display"
              onClick={() => {
                if (apartmentUnavailable) return;
                setShowDepartureCalendar((prev) => !prev);
                setShowArrivalCalendar(false);
                setShowGuestsDropdown(false);
              }}
            >
              <label>DÉPART</label>
              <div className="selected-date">
                {formatDateForDisplay(departureDate)}
              </div>
            </div>

            {showDepartureCalendar && (
              <div
                className="calendar-dropdown departure-calendar"
                onClick={(e) => e.stopPropagation()}
              >
                {loadingDates ? (
                  <div className="calendar-loading">
                    Chargement des disponibilités...
                  </div>
                ) : (
                  <CalendarPicker
                    mode="departure"
                    selectedDate={departureDate}
                    arrivalDate={arrivalDate}
                    onSelect={handleDepartureSelect}
                    blockedReservations={blockedReservations}
                    minDate={arrivalDate || today}
                    apartmentUnavailable={apartmentUnavailable}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="guests-selector-container" ref={dropdownRef}>
          <div
            className="guests-selector"
            onClick={() => {
              setShowGuestsDropdown((prev) => !prev);
              setShowArrivalCalendar(false);
              setShowDepartureCalendar(false);
            }}
          >
            <div className="guests-info">
              <label>VOYAGEURS</label>
              <div className="guests-value">{guestsText}</div>
            </div>
            <span className={`chevron ${showGuestsDropdown ? 'open' : ''}`}>
              ▼
            </span>
          </div>

          {showGuestsDropdown && (
            <div
              className="guests-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="guest-type-row">
                <div className="guest-type-info">
                  <span className="type-title">Adultes</span>
                  <span className="type-subtitle">13 ans et plus</span>
                </div>
                <div className="counter-controls">
                  <button
                    type="button"
                    className="btn-counter"
                    disabled={adults <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (adults > 1) setAdults(adults - 1);
                    }}
                  >
                    −
                  </button>
                  <span className="count-value">{adults}</span>
                  <button
                    type="button"
                    className="btn-counter"
                    disabled={capacityReached}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdults(adults + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="guest-type-row">
                <div className="guest-type-info">
                  <span className="type-title">Enfants</span>
                  <span className="type-subtitle">De 2 à 12 ans</span>
                </div>
                <div className="counter-controls">
                  <button
                    type="button"
                    className="btn-counter"
                    disabled={children <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (children > 0) setChildren(children - 1);
                    }}
                  >
                    −
                  </button>
                  <span className="count-value">{children}</span>
                  <button
                    type="button"
                    className="btn-counter"
                    disabled={capacityReached}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChildren(children + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {apartmentUnavailable && (
        <div className="reservation-error-message">
          Cet appartement est actuellement indisponible.
        </div>
      )}

      {!apartmentUnavailable && arrivalDate && (
        <div className="cancellation-info">
          0 € aujourd'hui · Annulation gratuite avant le{' '}
          {getCancellationDateFormatted()}
        </div>
      )}

      <button
        className="btn-reserve"
        type="button"
        disabled={apartmentUnavailable}
        onClick={handleReservation}
      >
        Réserver
      </button>

      <p className="no-charge-text">
        Aucun montant ne vous sera débité pour le moment
      </p>
    </div>
  );
};

export default Reservation;
