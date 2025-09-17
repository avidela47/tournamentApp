// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const fetchJSON = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  if (!res.ok) throw new Error(`Error ${res.status} en ${endpoint}`);
  return res.json();
};
