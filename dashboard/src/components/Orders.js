import React from "react";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import { BACKEND_URL } from "../config/urls";

import axios from "axios";


const Orders = () => {
  const data = useContext(GeneralContext);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/allOrders`).then((res) => {
      setAllOrders(res.data);
    });
  }, [data.orderChecker]);
  return (
    <div className="orders">
      <h3 className="title">Orders ({allOrders.length})</h3>
      {allOrders.length > 0 ? (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Mode</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {allOrders.map((orders, index) => {
                return (
                  <tr key={index}>
                    <td>{orders.name}</td>
                    <td>{orders.qty}</td>
                    <td>{orders.price.toFixed(2)}</td>
                    <td>{orders.mode}</td>
                    <td style={{ fontSize: "15px", fontWeight: "500" }}>
                      {(() => {
                        const date = new Date(orders.time);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const year = date.getFullYear();
                        const time = date.toLocaleTimeString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        });
                        return `${day}-${month}-${year} ${time}`;
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;

// time changer
// const utcTime = "2025-02-05T04:41:38.000Z"; // UTC time in ISO format
// const indianTime = new Date(utcTime).toLocaleString("en-IN", {
//   timeZone: "Asia/Kolkata",
// });
// console.log(indianTime);
