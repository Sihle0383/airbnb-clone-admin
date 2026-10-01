import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function FutureGetaways(){
  const [tab,setTab] = useState("Cape Town");
  const data = {
    "Cape Town":["Camps Bay - Villa","Sea Point - Apartment","Table Mountain - Cabin"],
    "Durban":["Umhlanga - Beach House","Ballito - Villa","Durban North - Flat"],
    "Pretoria":["Brooklyn - Loft","Menlyn - Apartment","Centurion - House"]
  };
  return (
    <div style={{padding:"40px", marginTop:"-110px", borderTop:"1px solid #ddd"}}>
      <h2>Inspiration for future getaways</h2>
      <div style={{display:"flex", gap:"20px", margin:"20px 0", borderBottom:"1px solid #ddd"}}>
        {Object.keys(data).map(t => (
          <span key={t} onClick={()=>setTab(t)} style={{paddingBottom:"10px", cursor:"pointer", borderBottom: tab===t?"2px solid black":"none"}}>{t}</span>
        ))}
      </div>
      <div style={{display:"flex", flexWrap:"wrap", gap:"40px"}}>
        {data[tab].map(i => <div key={i}><p><b>{i.split("-")[0]}</b></p><p style={{color:"gray"}}>{i.split("-")[1]}</p></div>)}
      </div>
    </div>
  )
}

export default function Home({ listings }) {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{padding:"40px"}}>
        <h2>Inspiration for your next trip</h2>
        <div style={{display:"flex", gap:"20px", marginTop:"20px", overflowX:"auto"}}>
          {[
            {name:"Cape Town", img:"https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1000", color:"#DE3151"},
            {name:"Durban", img:"https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1000", color:"#BC1A6E"},
            {name:"Knysna", img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e", color:"#D93B30"},
            {name:"Pretoria", img:"https://images.unsplash.com/photo-1523906834658-6e24ef2386f9", color:"#CC2D4A"},
            {name:"Sandton", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrQgenDWBuX6eSQEPLyB7X5QSa33VOLmuGWYUZgbERUA&s=10", color:"#f80b37"}
          ].map(l=>(
            <div key={l.name} onClick={()=>navigate(`/location/${l.name}`)} style={{minWidth:"260px", background:l.color, borderRadius:"12px", color:"white", cursor:"pointer"}}>
              <img src={l.img} style={{width:"100%", height:"150px", objectFit:"cover", borderRadius:"12px 12px 0 0"}} alt="" />
              <div style={{padding:"15px"}}><h3>{l.name}</h3><p>4 hours drive</p></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"20px 40px", display:"flex", flexWrap:"wrap", gap:"24px"}}>
        {listings.map(item => (
          <div key={item.id} onClick={()=>navigate(`/details/${item.id}`)} style={{width:"300px", borderRadius:"12px", overflow:"hidden", border:"1px solid #ddd", cursor:"pointer"}}>
            <img src={item.img} alt="" style={{width:"100%", height:"200px", objectFit:"cover"}} />
            <div style={{padding:"12px"}}>
              <p style={{margin:0, color:"gray", fontSize:"14px"}}>{item.location} • {item.maxGuests} guests</p>
              <h4 style={{margin:"5px 0"}}>{item.title}</h4>
              <p><b>R{item.price}</b> / night</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:"40px"}}>
        <h2>Discover Airbnb Experiences</h2>
        <div style={{display:"flex", gap:"20px", marginTop:"20px", flexWrap:"wrap"}}>
          <div style={{flex:1, minWidth:"300px", background:"url(https://images.unsplash.com/photo-1528543606781-2f6e6857f318) center/cover", height:"400px", borderRadius:"12px", padding:"30px", color:"white", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <h1 style={{maxWidth:"200px"}}>Things to do on your trip</h1>
            <button style={{width:"150px", padding:"12px", borderRadius:"8px", border:"none", fontWeight:"bold"}}>Experiences</button>
          </div>
          <div style={{flex:1, minWidth:"300px", background:"url(https://images.unsplash.com/photo-1515378791036-0648a3ef77b2) center/cover", height:"400px", borderRadius:"12px", padding:"30px", color:"white", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <h1 style={{maxWidth:"200px"}}>Things to do at home</h1>
            <button style={{width:"150px", padding:"12px", borderRadius:"8px", border:"none", fontWeight:"bold"}}>Online Experiences</button>
          </div>
        </div>
      </div>

      <div style={{padding:"40px", marginTop:"-40px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", transition: "transform 0.2s ease", cursor: "pointer"}}>
        {/* onMouseEnter= {e => e.currentTarget.style.transform = "scale(1.02)"} */}
        {/* onMouseLeave= {e => e.currentTarget.style.transform = "scale(1)"} */}

        <div><h1 style={{fontSize:"48px", maxWidth:"400px"}}>Shop Airbnb gift cards</h1><button style={{padding:"12px 24px", background:"black", color:"white", borderRadius:"8px", marginTop:"20px"}}>Learn more</button></div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUXz1jqgukBc-vgSxspCWdEvDb9QP5oPgX1OQ6AwyuPg&s=10" alt="" 
        style={{width:"45%", minWidth:"400px", borderRadius:"12px", marginRight:"350px"}} />
      </div>

      <FutureGetaways />
    </div>
  );
}