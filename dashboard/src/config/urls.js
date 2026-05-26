// Centralized URL config for the CRA dashboard app.
// CRA only exposes env vars prefixed with REACT_APP_.

export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function buildUrl(path, baseUrl) {
  return new URL(path, baseUrl).toString();
}
