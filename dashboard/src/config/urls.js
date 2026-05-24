// Centralized URL config for the CRA dashboard app.
// CRA only exposes env vars prefixed with REACT_APP_.

export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";

export function buildUrl(path, baseUrl) {
  return new URL(path, baseUrl).toString();
}
