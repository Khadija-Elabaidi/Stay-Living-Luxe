import axios from 'axios';

const API_URL = '/api/reservations';

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const effectuerReservation = async (appartementId, clientId, dateDebut, dateFin) => {
  const response = await axios.post(
    API_URL, 
    null, 
    {
      params: { appartementId, clientId, dateDebut, dateFin },
      headers: getAuthHeader()
    }
  );
  return response.data;
};

export const getReservationsByClient = async (clientId) => {
  const response = await axios.get(`${API_URL}/client/${clientId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAllReservations = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateReservationStatut = async (id, statut) => {
  const response = await axios.patch(
    `${API_URL}/${id}/statut`,
    null,
    {
      params: { statut },
      headers: getAuthHeader()
    }
  );
  return response.data;
};


export const getReservationsBloquantes = async (appartementId) => {
  const response = await axios.get(`${API_URL}/bloquantes/${appartementId}`);
  return response.data;
};

export const confirmerReservation = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/confirmer`, null, { headers: getAuthHeader() });
  return response.data;
};

export const annulerReservation = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/annuler`, null, { headers: getAuthHeader() });
  return response.data;
};

export const refuserReservation = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/refuser`, null, { headers: getAuthHeader() });
  return response.data;
};

export const createPaymentIntent = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/create-payment-intent`, null, { headers: getAuthHeader() });
  return response.data; 
};

export const confirmPayment = async (id, paymentIntentId) => {
  await axios.post(`${API_URL}/${id}/confirm-payment`, null, {
    params: { paymentIntentId },
    headers: getAuthHeader(),
  });
};


export const getMesReservations = async () => {
  const response = await axios.get(`${API_URL}/mes-reservations`, { headers: getAuthHeader() });
  return response.data;
};

export const modifierDatesReservation = async (id, dateDebut, dateFin) => {
  const response = await axios.put(`${API_URL}/${id}/modifier-dates`, null, {
    params: { dateDebut, dateFin },
    headers: getAuthHeader(),
  });
  return response.data;
};