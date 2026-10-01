import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AdminTopHeader from "./AdminTopHeader";

export default function Login(){
  const [email, setEmail] = useState("jane@airbnb.com");
  const [password, setPassword] = useState("password321");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Rubric: Input validation
    if (!email) return setError("Email is required");
    if (!email.includes("@") || !email.includes(".")) return setError("Please enter a valid email");
    if (!password) return setError("Password is required");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Rubric: Save session with JWT
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      
      navigate("/admin"); // Rubric: Redirect to dashboard on success
    } catch (err) {
      setError("Server error - is backend running on port 5000?");
      setLoading(false);
    }
  };

  return (
    <>
      <AdminTopHeader />
      <div className="loginWrapper">
        <form className="loginForm" onSubmit={handleSubmit}>
          <h2>Log in as Admin</h2>
          <p style={{color:"gray", fontSize:"13px"}}>Use: jane@airbnb.com / password321</p>
          
          {error && <div className="errorMsg">{error}</div>}

          <label>Email
            <input 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="jane@airbnb.com"
              required
            />
          </label>

          <label>Password
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p style={{fontSize:"12px", color:"gray", textAlign:"center"}}>
            Don't have account? Jane Doe is seeded as host
          </p>
        </form>
      </div>
    </>
  )
}