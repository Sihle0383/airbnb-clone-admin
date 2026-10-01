import React, { useState, useEffect } from "react";
import "./Admin.css";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reservations", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
        const data = await res.json();
        setReservations(data);
      } catch (err) { console.log(err); }
    };
    fetchReservations();
  }, []);

  if (reservations.length === 0) return <div className="adminPage"><h2>No reservations yet</h2></div>;

  return (
    <div className="adminPage">
      <h2>Reservations</h2>
      <table className="adminTable">
        <thead>
          <tr><th>Guest</th><th>Listing</th><th>Location</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Total</th></tr>
        </thead>
        <tbody>
          {reservations.map((r, i) => (
            <tr key={i}>
              <td>{r.userEmail || r.guestName || "Guest"}</td>
              <td>{r.listingTitle || r.accommodation?.title}</td>
              <td>{r.location || r.accommodation?.location}</td>
              <td>{new Date(r.checkIn).toLocaleDateString()}</td>
              <td>{new Date(r.checkOut).toLocaleDateString()}</td>
              <td>{r.guests}</td>
              <td>${r.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Reservations;