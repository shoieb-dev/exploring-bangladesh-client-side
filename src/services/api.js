const normalizeBaseUrl = (url) => (url || "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");

// Single source of truth for the backend URL.
// Set VITE_API_URL in .env (local + Firebase hosting env):
//   VITE_API_URL=https://tourism-website-server-site.vercel.app
const serverUrl = "https://tourism-website-server-site.vercel.app";
const localUrl = "http://localhost:5000";
const envUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_URL : "";
export const API_BASE_URL = normalizeBaseUrl(envUrl) || serverUrl;

// Leave localUrl available for local dev override:
// export const API_BASE_URL = normalizeBaseUrl(envUrl) || localUrl;

// export const API_ENDPOINTS = {
//     houses: `${API_BASE_URL}/houses`,
//     reviews: `${API_BASE_URL}/reviews`,
//     users: `${API_BASE_URL}/users`,
//     bookings: `${API_BASE_URL}/bookings`,
//     myApartments: `${API_BASE_URL}/myApartments`,
// };

export const packagesAPI = `${API_BASE_URL}/packages`;
export const bookingsAPI = `${API_BASE_URL}/bookings`;
export const myPackagesAPI = `${API_BASE_URL}/myPackages`;
export const usersAPI = `${API_BASE_URL}/api/users`;
export const usersFromBookingsAPI = `${API_BASE_URL}/api/users/from-bookings`;
export const userRoleAPI = (email) => `${API_BASE_URL}/api/users/me?email=${encodeURIComponent(email)}`;
