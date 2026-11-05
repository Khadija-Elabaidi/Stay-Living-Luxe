import axios from "axios";

const API_BASE_URL = "/api/admin/clients";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllClients = async () => {
  const response = await axios.get(API_BASE_URL, { headers: authHeaders() });
  return response.data;
};

export const deleteClient = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, { headers: authHeaders() });
};