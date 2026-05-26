import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";
import { BACKEND_URL } from "../config/urls";


import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, price, percent, closeSellWindow, setOrderChecker }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(typeof price === "number" ? price : 0.0);

    useEffect(()=>{
      setStockPrice(price);
    },[price])
    
  const navigateAfterClose = () => {
    if (pathname === "/marketwatch") {
      navigate("/marketwatch", { replace: true });
    }
     else {
      navigate(pathname, { replace: true });
    }
  };

  const handleSellClick = async () => {
    try {
      await axios.post(`${BACKEND_URL}/newOrder`, {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      });
      toast.success(`Sell order placed for ${uid}`);
      setOrderChecker((prev) => !prev);
      closeSellWindow();
      navigateAfterClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Request failed";
      console.error("Sell order failed:", error);
      alert(message);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
    navigateAfterClose();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <span>Price: {typeof price === "number" ? `₹${price}` : "-"}</span>
        <span>Percent: {percent || "-"}</span>
        <div>
          <button type="button" className="btn btn-blue" onClick={handleSellClick}>
            Sell
          </button>
          <button type="button" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
