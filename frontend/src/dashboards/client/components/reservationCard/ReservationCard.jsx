// src/dashboards/client/components/ReservationCard.jsx
import React from 'react';
// Importez vos icônes préférées
import { MapPin, CalendarDays, Key, Users, CheckCircle, Clock3 } from 'lucide-react';

const StatutBadge = ({ statut }) => {
  const isCompleted = statut.toLowerCase() === 'completed';
  return (
    <div style={{ ...styles.badge, ... (isCompleted ? styles.badgeCompleted : styles.badgeActive) }}>
      {isCompleted ? <CheckCircle size={16} /> : <Clock3 size={16} />}
      {statut}
    </div>
  );
};

const ReservationCard = ({ res }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h3 style={styles.title}>{res.title}</h3>
          <div style={styles.location}>
            <MapPin size={16} color="#666" />
            <span>{res.location}</span>
          </div>
        </div>
        <StatutBadge statut={res.statut} />
      </div>

      <div style={styles.content}>
        <div style={styles.mainInfo}>
          <div style={styles.iconInfo}>
            <CalendarDays size={18} color="#666" />
            <span>{res.dates}</span>
          </div>
          <div style={styles.iconInfo}>
            <Key size={18} color="#666" />
            <span>{res.details}</span>
          </div>
          <div style={styles.iconInfo}>
            <Users size={18} color="#666" />
            <span>{res.voyageurs} Voyageurs</span>
          </div>
        </div>
        <img src={res.imageUrl} alt={res.title} style={styles.image} />
      </div>

      <div style={styles.footer}>
        {res.statut.toLowerCase() === 'completed' ? (
          <>
            <button style={{ ...styles.btn, ...styles.btnPrimary }}>Détails du Séjour</button>
            <button style={{ ...styles.btn, ...styles.btnSecondary }}>Laisser un Avis</button>
          </>
        ) : (
          <>
            <button style={{ ...styles.btn, ...styles.btnPrimary }}>Modifier Dates</button>
            <button style={{ ...styles.btn, ...styles.btnPrimaryRed }}>Annuler la Réservation</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    padding: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#222',
    margin: 0,
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#666',
    fontSize: '14px',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
  },
  mainInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexGrow: 1,
  },
  iconInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#555',
    fontSize: '14px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  badgeCompleted: {
    backgroundColor: '#E6F9F3',
    color: '#158C73',
  },
  badgeActive: {
    backgroundColor: '#FFF8E6',
    color: '#D19A1E',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '10px',
    marginTop: '10px',
  },
  btn: {
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    border: 'none',
    transition: 'background 0.2s',
  },
  btnPrimary: {
    backgroundColor: '#3867D6',
    color: '#fff',
    fontWeight: 'bold',
  },
  btnPrimaryRed: {
    backgroundColor: '#DC3545',
    color: '#fff',
    fontWeight: 'bold',
  },
  btnSecondary: {
    backgroundColor: '#F3F4F6',
    color: '#555',
  },
};

export default ReservationCard;