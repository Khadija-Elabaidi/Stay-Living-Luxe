// src/dashboards/client/components/HistoricalTable.jsx
import React from 'react';

const HistoricalTable = ({ data }) => {
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.tableHeaderCell}>Statut</th>
            <th style={styles.tableHeaderCell}>Name</th>
            <th style={styles.tableHeaderCell}>Propriété</th>
            <th style={styles.tableHeaderCell}>Arrivée</th>
            <th style={styles.tableHeaderCell}>Départ</th>
            <th style={styles.tableHeaderCell}>Hôte</th>
            <th style={styles.tableHeaderCell}>Séjour</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={styles.tableRow}>
              <td style={styles.tableCell}>{item.statut}</td>
              <td style={styles.tableCell}>{item.name}</td>
              <td style={styles.tableCell}>{item.propriete}</td>
              <td style={styles.tableCell}>{item.arrivee}</td>
              <td style={styles.tableCell}>{item.depart}</td>
              <td style={styles.tableCell}>{item.hote}</td>
              <td style={styles.tableCell}>{item.sejour}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    padding: '10px',
    overflowX: 'auto', // Pour le responsive
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px', // Éviter l'écrasement
  },
  tableHeaderRow: {
    borderBottom: '2px solid #EEE',
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '15px 10px',
    color: '#666',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottom: '1px solid #F0F0F0',
  },
  tableCell: {
    padding: '15px 10px',
    fontSize: '14px',
    color: '#333',
  },
};

export default HistoricalTable;