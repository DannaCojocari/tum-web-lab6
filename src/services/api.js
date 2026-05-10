const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── Auth ─────────────────────────────────────────────────────
export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, { headers: headers() });
  return res.json();
};

// ── Destinations ─────────────────────────────────────────────
export const getDestinations = async (limit = 10, offset = 0) => {
  const res = await fetch(
    `${BASE_URL}/destinations?limit=${limit}&offset=${offset}`,
    { headers: headers() }
  );
  return res.json();
};

export const getDestination = async (id) => {
  const res = await fetch(`${BASE_URL}/destinations/${id}`, {
    headers: headers(),
  });
  return res.json();
};

export const createDestination = async (data) => {
  const res = await fetch(`${BASE_URL}/destinations`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateDestination = async (id, data) => {
  const res = await fetch(`${BASE_URL}/destinations/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteDestination = async (id) => {
  await fetch(`${BASE_URL}/destinations/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
};

// ── Itineraries ───────────────────────────────────────────────
export const getItineraries = async (destinationId) => {
  const res = await fetch(
    `${BASE_URL}/itineraries?destinationId=${destinationId}`,
    { headers: headers() }
  );
  return res.json();
};

export const createItinerary = async (data) => {
  const res = await fetch(`${BASE_URL}/itineraries`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteItinerary = async (id) => {
  await fetch(`${BASE_URL}/itineraries/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
};

// ── Activities ────────────────────────────────────────────────
export const createActivity = async (data) => {
  const res = await fetch(`${BASE_URL}/activities`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateActivity = async (id, data) => {
  const res = await fetch(`${BASE_URL}/activities/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteActivity = async (id) => {
  await fetch(`${BASE_URL}/activities/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
};