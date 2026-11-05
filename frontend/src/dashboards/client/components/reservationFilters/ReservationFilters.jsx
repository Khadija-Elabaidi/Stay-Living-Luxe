import { Search } from 'lucide-react'; 

const ReservationFilters = () => {
  return (
    <div style={styles.container}>
      <div style={styles.filterGroup}>
        <label htmlFor="statut" style={styles.label}>Statut</label>
        <select id="statut" style={styles.select}>
          <option>All, Active, Upcoming, Completed, Cancelled</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Upcoming</option>
        </select>
      </div>
      
      <div style={styles.filterGroup}>
        <label htmlFor="periode" style={styles.label}>Période</label>
        <div style={styles.datePicker}>
          <input type="text" id="periode" value="01/01/2024 - 31/12/2024" style={styles.dateInput} readOnly />
        </div>
      </div>

      <div style={styles.filterGroup}>
        <label htmlFor="propriete" style={styles.label}>Propriété</label>
        <select id="propriete" style={styles.select}>
          <option>All or specific cities</option>
          <option>Bordeaux</option>
          <option>Paris</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label htmlFor="search" style={styles.label}>&nbsp;</label> 
        <div style={styles.searchBar}>
          <Search size={20} color="#888" style={styles.searchIcon} />
          <input type="text" id="search" placeholder="Rechercher une réservation..." style={styles.searchInput} />
        </div>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: '200px',
    flex: '1 1 200px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  datePicker: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  dateInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    color: '#555',
  },
  searchBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
  },
  searchInput: {
    padding: '10px 10px 10px 40px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
  }
};

export default ReservationFilters;