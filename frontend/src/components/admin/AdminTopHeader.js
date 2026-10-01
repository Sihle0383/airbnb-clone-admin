import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminTopHeader(){
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Only logged in if token EXISTS
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const raw = localStorage.getItem("user") || localStorage.getItem("adminUser");

    if (token && raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(typeof parsed === 'string' ? { username: parsed } : parsed);
      } catch {
        setUser({ username: raw });
      }
    } else {
      setUser(null); // <-- This makes login page show Become a host
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("userEmail");
    setUser(null);
    navigate("/admin/login");
  };

  return(
    <div style={{ 
      padding: "20px 40px", 
      background: "white", 
      borderBottom: "1px solid #EEE", 
      display:"flex", 
      justifyContent:"space-between", 
      alignItems:"center",
      overflow:"visible",
      position:"relative",
      zIndex: 100
    }}>
      
      {/* LOGGED OUT STATE */}
      {!user ? (
        <>
          <div></div>
          <Link to="/" style={{ textDecoration: "none", color: "#222", fontWeight: "600" }}>
            Become a host
          </Link>
        </>
      ) : (
        /* LOGGED IN STATE */
        <div style={{ position: "relative", width: "220px" }}>
          <span onClick={() => setShow(!show)} style={{ fontSize: "20px", cursor: "pointer", fontWeight: "700" }}>
            Hi, {user.username || user.name || "Jane Doe"} {show ? "▲" : "▼"}
          </span>

          {show && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "12px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.20)",
              border: "1px solid #ddd",
              overflow: "hidden",
              position: "absolute",
              top: "35px",
              left: 0,
              width: "220px",
              zIndex: 9999
            }}>
              <Link to="/reservations" onClick={() => setShow(false)} style={{
                padding: "14px 16px",
                textDecoration: "none",
                color: "#222",
                borderBottom: "1px solid #eee",
                fontSize: "15px"
              }}>
                Reservations
              </Link>
              <button onClick={logout} style={{
                padding: "14px 16px",
                background: "white",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600"
              }}>
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}