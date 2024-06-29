export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://nomad-lang.onrender.com"
    : "http://localhost:4000";
