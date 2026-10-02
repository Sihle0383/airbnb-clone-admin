import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LocationPage({ listings: propListings }){
  const { locationName } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState(propListings || []);
  const [loading, setLoading] = useState(!propListings);

  // If parent didn't pass listings, fetch from backend
  useEffect(()=>{
    if(!propListings){
      fetch(`http://localhost:5000/api/accommodations`)
     .then(r=>r.json())
     .then(d=>{
        setListings(Array.isArray(d)? d : []);
        setLoading(false);
      })
     .catch(()=>setLoading(false));
    }
  },[propListings]);

  const getImage = (item)=>{
    const url = item.img || item.images?.[0] || "";
    if(!url) return "https://via.placeholder.com/300x200?text=No+Image";
    if(url.startsWith("http")) return url;
    return `http://localhost:5000${url.startsWith("/")? "" : "/"}${url}`;
  };

  // FIX: use _id and safe filter
  const filtered = listings.filter(l =>
    l.location && locationName?
    l.location.toLowerCase().includes(locationName.toLowerCase()) : true
  );

  if(loading) return <div style={{padding:"30px"}}>Loading stays...</div>;

  return (
    <div style={{padding:"30px", maxWidth:"1100px", margin:"0 auto"}}>
      <h3>{filtered.length} stays in {locationName || "All"}</h3>
      <h1>{locationName? `${locationName} - Stays` : "All Stays"}</h1>

      {filtered.length===0 && <p>No listings found for {locationName}. Try creating one in Admin.</p>}

      {filtered.map(item => {
        const id = item._id || item.id; // FIXED: supports both
        return (
          <div key={id} onClick={()=>navigate(`/details/${id}`)} style={{display:"flex", gap:"20px", borderTop:"1px solid #eee", padding:"20px 0", cursor:"pointer"}}>
            <img src={getImage(item)} style={{width:"300px", height:"200px", borderRadius:"12px", objectFit:"cover"}} alt={item.title} />
            <div style={{flex:1}}>
              <p style={{color:"gray", margin:"0 0 5px", fontSize:"14px"}}>{item.type || "Entire apartment"} in {item.location}</p>
              <h3 style={{margin:"0 0 8px"}}>{item.title}</h3>
              <p style={{color:"#717171", fontSize:"14px", margin:"0 0 8px"}}>{item.description?.slice(0,120)}...</p>
              <p style={{fontSize:"14px"}}>★ {item.rating || item.star || 4.9} ({item.reviews || 120} reviews) • {(item.amenities||[]).slice(0,3).join(" • ")}</p>
              <h3 style={{textAlign:"right", marginTop:"20px"}}>R{item.price} / night</h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}