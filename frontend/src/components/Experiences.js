export default function Experiences(){
  return (
    <div style={{padding:"40px"}}>
      <h2>Discover Airbnb Experiences</h2>
      <div style={{display:"flex", gap:"20px", marginTop:"20px"}}>
        <div style={{flex:1, background:"url(https://images.unsplash.com/photo-1528543606781-2f6e6857f318) center", height:"400px", borderRadius:"12px", padding:"30px", color:"white", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
          <h1 style={{width:"200px"}}>Things to do on your trip</h1>
          <button style={{width:"150px", padding:"12px", borderRadius:"8px", border:"none", fontWeight:"bold"}}>Experiences</button>
        </div>
        <div style={{flex:1, background:"url(https://images.unsplash.com/photo-1515378791036-0648a3ef77b2) center", height:"400px", borderRadius:"12px", padding:"30px", color:"white", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
          <h1 style={{width:"200px"}}>Things to do at home</h1>
          <button style={{width:"150px", padding:"12px", borderRadius:"8px", border:"none", fontWeight:"bold"}}>Online Experiences</button>
        </div>
      </div>
    </div>
  )
}