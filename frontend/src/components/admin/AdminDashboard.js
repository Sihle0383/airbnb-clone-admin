import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminTopHeader from "./AdminTopHeader";

export default function AdminDashboard(){
  const [listings,setListings] = useState([]);
  const [loading,setLoading] = useState(true);

  const loadListings = () => {
    fetch("http://localhost:5000/api/accommodations")
   .then(r=>r.json())
   .then(d=>{setListings(d); setLoading(false)})
   .catch(()=>setLoading(false));
  };

  useEffect(()=>{ loadListings(); },[]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/accommodations/${id}`, {
        method:"DELETE",
        headers:{ "Authorization":`Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Delete failed");

      // Remove from UI instantly
      setListings(prev => prev.filter(l => (l.id || l._id)!== id));
      alert("Deleted!");
    } catch(err){
      alert("Failed to delete: " + err.message);
    }
  };

  if (loading) return <><AdminTopHeader /><div style={{padding:"40px"}}>Loading...</div></>;

  return(
    <>
      <AdminTopHeader />
      <div style={{padding:"30px"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h1>All Listings</h1>
          <Link to="/admin/create" style={{padding:"10px 18px", background:"#FF385C", color:"white", borderRadius:"8px", textDecoration:"none", fontWeight:"600"}}>+ Create New</Link>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"20px", marginTop:"20px"}}>
          {listings.map(l=>{
            const listingId = l.id || l._id;
            return(
              <div key={listingId} style={{border:"1px solid #ddd", borderRadius:"12px", overflow:"hidden", background:"white"}}>
                <img src={l.img || l.images?.[0]} alt="" style={{width:"100%", height:"180px", objectFit:"cover"}} />
                <div style={{padding:"12px"}}>
                  <h3 style={{margin:"0 0 5px"}}>{l.title}</h3>
                  <p style={{margin:0, color:"#717171", fontSize:"14px"}}>{l.location} - ${l.price}/night</p>

                  <div style={{display:"flex", gap:"12px", marginTop:"12px"}}>
                    <Link to={`/admin/edit/${listingId}`} style={{padding:"6px 12px", border:"1px solid #ddd", borderRadius:"6px", textDecoration:"none", color:"#222", fontSize:"13px", fontWeight:"600"}}>Edit</Link>
                    <button onClick={()=>handleDelete(listingId)} style={{padding:"6px 12px", border:"1px solid #FF385C", borderRadius:"6px", background:"white", color:"#FF385C", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}