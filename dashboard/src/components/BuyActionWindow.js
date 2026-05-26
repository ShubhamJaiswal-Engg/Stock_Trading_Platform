import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";
import { toast } from "react-toastify";


import "./BuyActionWindow.css";
import { BACKEND_URL } from "../config/urls";

const BuyActionWindow = ({ uid, price, percent }) => {
  const { closeBuyWindow, setOrderChecker } = useContext(GeneralContext); 
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
    } else {
      navigate(pathname, { replace: true });
    }
  };

  const handleBuyClick = async () => {
    try {
      await axios.post(`${BACKEND_URL}/newOrder`, {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
      });
      toast.success(`Buy order placed for ${uid}`);
      setOrderChecker((prev) => !prev);
      closeBuyWindow();
      navigateAfterClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Request failed";
      console.error("Buy order failed:", error);
      alert(message);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
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
          <button type="button" className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>
          <button type="button" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
