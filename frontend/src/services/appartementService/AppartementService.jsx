import axios from 'axios';

const API_BASE_URL = "/api/appartements";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const getAllAppartements = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};



export const addAppartement = async (formData) => {
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  console.log("Token :", localStorage.getItem("token"));
  const response = await axios.post(API_BASE_URL, formData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};


export const deleteAppartement = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const updateStatut = async (id, statut) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/statut`, { statut }, getAuthHeaders());
  return response.data;
};

export const getAppartementById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const updateAppartement = async (id, formData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, formData, getAuthHeaders());
  return response.data;
};

export const deleteImageAppartement = async (imageId) => {
  return await axios.delete(`${API_BASE_URL}/images/${imageId}`, getAuthHeaders());
};


export const searchAppartements = async (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) params.append(k, v);
  });
  const res = await fetch(`http://localhost:8085/api/appartements/search?${params}`);
  if (!res.ok) throw new Error('Erreur de recherche');
  return res.json();
};