import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./index.css";
import Home from "./components/Home";
import { GeneralContextProvider } from "./components/GeneralContext";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch {
    token = null;
  }
  if (token) {
    const headers = config.headers ?? {};
    if (!headers.Authorization && !headers.authorization) {
      config.headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GeneralContextProvider>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </GeneralContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

