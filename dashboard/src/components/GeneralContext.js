import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import { BACKEND_URL } from "../config/urls";

const GeneralContext = createContext();

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [orderChecker, SetOrderChecker] = useState(false);
  const [selectedStock, setSelectedStock] = useState({
    uid: "",
    price: null,
    percent: "",
  });
  const [userName, setUserName] = useState(localStorage.getItem("username") || "Guest");
  const [userEmail, setUserEmail] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      // Frontend and dashboard are different origins, so localStorage is not shared.
      // When coming from frontend after login/signup we accept token from URL hash.
      let token = localStorage.getItem('token');

      try {
        const hash = window.location.hash || "";
        const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
        const incomingToken = hashParams.get("token");
        if (!token && incomingToken) {
          token = incomingToken;
          localStorage.setItem('token', incomingToken);

          // Remove token from URL (keep other params like login/signup for welcome toast)
          hashParams.delete("token");
          const nextHash = hashParams.toString();
          const nextUrl =
            window.location.pathname +
            window.location.search +
            (nextHash ? `#${nextHash}` : "");
          window.history.replaceState(null, "", nextUrl);
        }
      } catch (_e) {
        // Ignore URL parsing issues
      }
      try {
        const { data } = await axios.get(`${BACKEND_URL}/me`, {
          headers: {
                    Authorization: `Bearer ${token}`
               },
          withCredentials: true,
        });

        const isAuthed = Boolean(data?.success);
        const username = isAuthed ? data?.user?.username || "" : "";
        const email = isAuthed ? data?.user?.email || "" : "";
        const displayName = username
          ? username.charAt(0).toUpperCase() + username.slice(1)
          : "Guest";

        setUserName(displayName);
        setUserEmail(email);
        setIsAuthenticated(isAuthed);
        setAuthChecked(true);

        if (isAuthed && displayName !== "Guest") {
          localStorage.setItem("username", displayName);
        } else {
          localStorage.removeItem("username");
        }
      } catch (e) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        setUserName("Guest");
        setUserEmail("");
        localStorage.removeItem("username");
      }
    };

    fetchUserInfo();

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleCloseBuyWindow();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


  const handleOpenBuyWindow = (stockOrUid) => {
    setIsSellWindowOpen(false);
    setIsBuyWindowOpen(true);

    if (typeof stockOrUid === "string") {
      setSelectedStock({ uid: stockOrUid, price: null, percent: "" });
    } else {
      setSelectedStock({
        uid: stockOrUid?.name ?? stockOrUid?.uid ?? "",
        price: stockOrUid?.price ?? null,
        percent: stockOrUid?.percent ?? "",
      });
    }
  };
  const handleOpenSellWindow = (stockOrUid) => {
    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(true);

    if (typeof stockOrUid === "string") {
      setSelectedStock({ uid: stockOrUid, price: null, percent: "" });
    } else {
      setSelectedStock({
        uid: stockOrUid?.name ?? stockOrUid?.uid ?? "",
        price: stockOrUid?.price ?? null,
        percent: stockOrUid?.percent ?? "",
      });
    }
  };
  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(false);
    setSelectedStock({ uid: "", price: null, percent: "" });
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeBuyWindow: handleCloseBuyWindow,
        closeSellWindow: handleCloseBuyWindow,
        orderChecker,
        setOrderChecker: SetOrderChecker,
        selectedStock,
        userName,
        userEmail,
        authChecked,
        isAuthenticated,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStock.uid}
          price={selectedStock.price}
          percent={selectedStock.percent}
          closeBuyWindow={handleCloseBuyWindow}
          setOrderChecker={SetOrderChecker}
        />
      )}
      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedStock.uid}
          price={selectedStock.price}
          percent={selectedStock.percent}
          closeSellWindow={handleCloseBuyWindow}
          setOrderChecker={SetOrderChecker}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;