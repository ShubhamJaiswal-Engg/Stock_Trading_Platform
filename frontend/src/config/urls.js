// Centralized URL config for the CRA frontend app.
// Note: CRA only exposes env vars prefixed with REACT_APP_.

const RENDER_FRONTEND_URL = "https://stockx-frontend-l2vo.onrender.com";
const RENDER_DASHBOARD_URL = "https://stockx-dashboard.onrender.com";
const RENDER_BACKEND_URL = "https://stockx-hzep.onrender.com";

const isBrowser = typeof window !== "undefined";
const isRenderHost = isBrowser && window.location.hostname.endsWith(".onrender.com");

const isLocalhostUrl = (value) =>
  typeof value === "string" && /^(https?:\/\/)?localhost(:\d+)?\/?$/i.test(value.trim());

const pickUrl = (envValue, fallbackValue) => {
  if (!envValue) return fallbackValue;
  if (isRenderHost && isLocalhostUrl(envValue)) return fallbackValue;
  return envValue;
};

export const FRONTEND_URL = pickUrl(
  process.env.REACT_APP_FRONTEND_URL,
  isRenderHost ? RENDER_FRONTEND_URL : "http://localhost:3000"
);

export const DASHBOARD_URL = pickUrl(
  process.env.REACT_APP_DASHBOARD_URL,
  isRenderHost ? RENDER_DASHBOARD_URL : "http://localhost:3001"
);

export const BACKEND_URL = pickUrl(
  process.env.REACT_APP_BACKEND_URL,
  isRenderHost ? RENDER_BACKEND_URL : "http://localhost:3002"
);

export const AUTH_STATUS_KEY = process.env.REACT_APP_AUTH_STATUS_KEY;

export function buildUrl(path, baseUrl) {
  return new URL(path, baseUrl).toString();
}
