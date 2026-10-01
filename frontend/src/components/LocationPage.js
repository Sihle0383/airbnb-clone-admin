import { useParams, useNavigate } from 'react-router-dom';
export default function LocationPage({listings}){
  const {locationName} = useParams();
  const navigate = useNavigate();
  const filtered = listings.filter(l => l.location.toLowerCase().includes(locationName.toLowerCase()));
  return (
    <div style={{padding:"30px"}}>
      <h3>{filtered.length} stays in {locationName}</h3>
      <h1>{locationName} - Stays</h1>
      {filtered.map(item => (
        <div key={item.id} onClick={()=>navigate(`/details/${item.id}`)} style={{display:"flex", gap:"20px", borderTop:"1px solid #eee", padding:"20px 0", cursor:"pointer"}}>
          <img src={item.img} style={{width:"300px", height:"200px", borderRadius:"12px", objectFit:"cover"}} alt="" />
          <div>
            <p style={{color:"gray"}}>{item.type} in {item.location}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>★ {item.star} ({item.reviews} reviews) • {item.amenities?.join(" • ")}</p>
            <h3 style={{textAlign:"right"}}>R{item.price} / night</h3>
          </div>
        </div>
      ))}
    </div>
  )
}