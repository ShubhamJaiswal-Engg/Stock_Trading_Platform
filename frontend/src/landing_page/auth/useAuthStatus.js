import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, AUTH_STATUS_KEY } from "../../config/urls.js";


/**
 * Lightweight auth status hook.
 *
 * - Uses sessionStorage as an instant UI hint to prevent flicker.
 * - Verifies via GET /me only when storage hint says "authed".
 */

const FALLBACK_AUTH_STATUS_KEY = "authStatus";
let inFlightAuthCheck = null;

export default function useAuthStatus() {
  const storageKey = AUTH_STATUS_KEY || FALLBACK_AUTH_STATUS_KEY;

  const [authStatus, setAuthStatus] = useState(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (stored === "authed") return "checking";
    return stored || "guest";
  });

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        if (!BACKEND_URL) throw new Error("Missing BACKEND_URL");

        if (!inFlightAuthCheck) {
          inFlightAuthCheck = axios.get(`${BACKEND_URL}/me`, {
            withCredentials: true,
          });
        }

        const { data } = await inFlightAuthCheck;
        if (!data?.success) throw new Error("Not authenticated");
        if (!isMounted) return;
        setAuthStatus("authed");
        sessionStorage.setItem(storageKey, "authed");
      } catch (e) {
        if (!isMounted) return;
        setAuthStatus("guest");
        sessionStorage.setItem(storageKey, "guest");
      } finally {
        inFlightAuthCheck = null;
      }
    };

    const stored = sessionStorage.getItem(storageKey);
    if (stored === "authed") {
      check();
    } else {
      // Avoid spamming /me (and 401s in console) when user is clearly a guest.
      if (stored !== "guest") sessionStorage.setItem(storageKey, "guest");
    }

    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  return {
    authStatus,
    isCheckingAuth: authStatus === "checking",
    isAuthenticated: authStatus === "authed",
  };
}
