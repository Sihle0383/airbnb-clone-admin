export default function ShopAirbnb(){
  return (
    <div style={{padding:"40px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <div>
        <h1 style={{fontSize:"48px", width:"300px"}}>Shop Airbnb gift cards</h1>
        <button style={{padding:"12px 24px", background:"black", color:"white", borderRadius:"8px", marginTop:"20px"}}>Learn more</button>
      </div>
      <img src="https://a0.muscache.com/im/pictures/1e5d4c3a-8c0d-4c7d-8b0a-9e0b8c8a9c8a.jpg" alt="" style={{width:"50%", borderRadius:"12px"}}
      onError={(e)=>e.target.src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38"} />
    </div>
  )
}