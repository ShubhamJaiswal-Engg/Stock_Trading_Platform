// Centralized URL config for the CRA frontend app.
// Note: CRA only exposes env vars prefixed with REACT_APP_.

export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
export const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL;
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const AUTH_STATUS_KEY = process.env.REACT_APP_AUTH_STATUS_KEY;

export function buildUrl(path, baseUrl) {
  return new URL(path, baseUrl).toString();
}
