import React, { useState, useEffect } from "react";
import "./Admin.css";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // REMOVED Authorization header - your server doesn't need it and it was causing CORS block
        const res = await fetch("http://localhost:5000/api/reservations");
        const data = await res.json();
        setReservations(Array.isArray(data)? data : []);
      } catch (err) {
        console.log("Fetch error:", err);
      }
      finally { setLoading(false); }
    };
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (!id || id === "undefined") return alert("Invalid ID");
    if (!window.confirm("Delete this reservation?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: "DELETE",
      });
      if(!res.ok) throw new Error("Delete failed");
      setReservations(prev => prev.filter(r => (r._id || r.id)!== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed: " + err.message);
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString('en-GB'); }
    catch { return d; }
  };

  // FIXES YOUR "can't see my pictures" - handles all URL types
  const getImage = (r) => {
    const url = r.image || r.images?.[0] || r.accommodation?.images?.[0] || r.listingImage || "";
    if(!url) return "https://via.placeholder.com/80x60?text=No+Image";
    if(url.startsWith("http")) return url;
    return `http://localhost:5000${url.startsWith("/")? "" : "/"}${url}`;
  };

  // FIXES blank property name - checks every possible field name your code used
  const getPropertyName = (r) => {
    return r.title || r.listing || r.listingTitle || r.propertyName || r.accommodationTitle || r.accommodation?.title || "Untitled Property";
  };

  const getBookedBy = (r) => {
    return r.guestName || r.guest || r.userEmail || r.bookedBy || "Guest";
  };

  if (loading) return <div className="adminPage"><h2>Loading...</h2></div>;

  if (reservations.length === 0) return (
    <div className="adminPage" style={{maxWidth:"1100px", margin:"40px auto"}}>
      <h2 style={{textAlign:"center"}}>My Reservations</h2>
      <p style={{textAlign:"center", marginTop:"20px"}}>No reservations yet. Go book a place first!</p>
    </div>
  );

  return (
    <div className="adminPage" style={{maxWidth:"1150px", margin:"40px auto", padding:"20px", background:"white"}}>
      <h2 style={{textAlign:"center", marginBottom:"25px", fontWeight:"700"}}>My Reservations ({reservations.length})</h2>

      <div style={{overflowX:"auto"}}>
        <table className="adminTable" style={{width:"100%", borderCollapse:"collapse", fontSize:"14px"}}>
          <thead>
            <tr style={{background:"#e8f0fe", textAlign:"left"}}>
              <th style={{padding:"12px"}}>Image</th>
              <th style={{padding:"12px"}}>Booked by</th>
              <th style={{padding:"12px"}}>Property name</th>
              <th style={{padding:"12px"}}>Check-in</th>
              <th style={{padding:"12px"}}>Check-out</th>
              <th style={{padding:"12px"}}>Total</th>
              <th style={{padding:"12px"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r, i) => {
              const id = r._id || r.id;
              return (
                <tr key={id || i} style={{borderBottom:"1px solid #eee"}}>
                  {/* IMAGE COLUMN - FIXES YOUR VIDEO */}
                  <td style={{padding:"12px"}}>
                    <img
                      src={getImage(r)}
                      alt=""
                      style={{width:"80px", height:"60px", objectFit:"cover", borderRadius:"6px"}}
                      onError={(e)=>e.target.src="https://via.placeholder.com/80x60?text=No+Image"}
                    />
                  </td>
                  <td style={{padding:"12px"}}>{getBookedBy(r)}</td>
                  <td style={{padding:"12px", fontWeight:"600"}}>{getPropertyName(r)}</td>
                  <td style={{padding:"12px"}}>{formatDate(r.checkIn || r.checkInDate)}</td>
                  <td style={{padding:"12px"}}>{formatDate(r.checkOut || r.checkOutDate)}</td>
                  <td style={{padding:"12px"}}>${r.total || r.totalPrice || "-"}</td>
                  <td style={{padding:"12px"}}>
                    <button
                      onClick={()=>handleDelete(id)}
                      style={{
                        background:"#c0392b", color:"white", border:"none",
                        padding:"8px 16px", borderRadius:"4px", cursor:"pointer", fontWeight:"500"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservations;