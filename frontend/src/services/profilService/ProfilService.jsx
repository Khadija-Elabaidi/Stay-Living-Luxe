import axios from "axios";

const API_BASE_URL = "/api/profil";

const authHeaders = () => {
  const token = localStorage.getItem("token"); 
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProfil = async () => {
  const res = await axios.get(API_BASE_URL, { headers: authHeaders() });
  return res.data;
};

export const updateProfil = async (data) => {
  const res = await axios.put(API_BASE_URL, data, { headers: authHeaders() });
  return res.data;
};

export const changePassword = async (ancienMotPass, nouveauMotPass) => {
  const res = await axios.put(
    `${API_BASE_URL}/password`,
    { ancienMotPass, nouveauMotPass },
    { headers: authHeaders() }
  );
  return res.data;
};