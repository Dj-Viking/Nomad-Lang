export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://nomad-lang.herokuapp.com"
    : "http://localhost:4000";
