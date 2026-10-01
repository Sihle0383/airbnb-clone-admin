const locations = [
  {name:"Cape Town", img:"https://images.unsplash.com/photo-1587133599428-16354b28e6a8?w=800&auto=format&fit=crop", color:"#DE3151"},
  {name:"Durban", img:"https://images.unsplash.com/photo-1576485290814-1c72c0bcc5d1", color:"#BC1A6E"},
  {name:"Knysna", img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e", color:"#D93B30"},
  {name:"Pretoria", img:"https://images.unsplash.com/photo-1523906834658-6e24ef2386f9", color:"#CC2D4A"}
];
export default function Inspiration(){
  return (
    <div style={{display:"flex", gap:"20px", marginTop:"20px"}}>
      {locations.map(l => (
        <div key={l.name} style={{background:l.color, borderRadius:"12px", width:"280px", color:"white"}}>
          <img src={l.img} style={{width:"100%", height:"180px", objectFit:"cover", borderRadius:"12px 12px 0 0"}} alt="" />
          <div style={{padding:"15px"}}><h3>{l.name}</h3><p>2 hours drive</p></div>
        </div>
      ))}
    </div>
  )
}