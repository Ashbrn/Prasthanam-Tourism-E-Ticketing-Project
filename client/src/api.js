import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export async function getAllTrips() {
  const res = await axios.get(`${API_BASE_URL}/all`);
  return res.data;
}

export async function deleteTrip(id) {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
}

export async function generateTrip(city, days, language, originCity) {
  const res = await axios.post(`${API_BASE_URL}/generate`, { city, days, language, originCity });
  return res.data;
}

export async function saveTrip(tripData) {
  const res = await axios.post(`${API_BASE_URL}/save`, tripData);
  return res.data;
}

export async function startTrip(tripId) {
  const res = await axios.post(`${API_BASE_URL}/${tripId}/start`);
  return res.data;
}
