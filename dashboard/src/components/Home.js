import React, { useEffect, useContext } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeneralContext from "./GeneralContext";
import { FRONTEND_URL, buildUrl } from "../config/urls";

const Home = () => {
  const context = useContext(GeneralContext);

  useEffect(() => {
    if (!context.authChecked) return;
    if (!context.isAuthenticated) {
      window.location.assign(buildUrl("/login", FRONTEND_URL));
    }
  }, [context.authChecked, context.isAuthenticated]);

  useEffect(() => {
    // Wait until auth is checked AND we actually have a valid userName from the backend.
    if (!context.authChecked || !context.userName || context.userName === "Guest") {
      return;
    }

    // Check Dashboard's own sessionStorage (Port 3001) so we don't rely on Port 3000
    const hasSeenWelcome = sessionStorage.getItem("dashboard_welcome_shown");

    const urlParams = new URLSearchParams(window.location.search);
    const isSignup = urlParams.get("signup") === "true";
    if (!hasSeenWelcome) {
      const message = isSignup ? `Welcome ${context.userName}` : `Welcome back ${context.userName}`;

      toast.success(message, {
        className: "custom-toast",
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        toastId: "welcome-toast",
      });
      // Mark as shown so it doesn't pop up again when user refreshes the page
      sessionStorage.setItem("dashboard_welcome_shown", "true");

    }
    // Clean up the URL parameters if they exist
    if (urlParams.has("signup") || urlParams.has("login")) {
      urlParams.delete("signup");
      urlParams.delete("login");
      const newSearch = urlParams.toString();
      const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
      window.history.replaceState(null, '', newUrl);
    }
  }, [context.authChecked, context.userName]);

  if (!context.authChecked) return null;
  if (!context.isAuthenticated) return null;
  
  return (
    <>
      <TopBar />
      <Dashboard />
      <ToastContainer />
    </>
  );
};

export default Home;
