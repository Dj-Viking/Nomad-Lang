/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
window.process ? null : window.process = {
  env: process?.env?.NODE_ENV || "production" 
} as any;

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://nomad-lang.onrender.com"
    : "http://localhost:4000";
