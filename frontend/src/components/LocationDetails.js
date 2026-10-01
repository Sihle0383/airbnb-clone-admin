import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function LocationDetails(){
  const {id} = useParams();
  const [place,setPlace] = useState(null);
  const [dates,setDates] = useState([{
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate()+7)),
    key:"selection"
  }]);
  const [guests,setGuests] = useState(2);

  useEffect(()=>{
    fetch(`http://localhost:5000/api/accommodations/${id}`)
     .then(r=>r.json())
     .then(setPlace)
     .catch(()=> setPlace({
        id:id, location:"Cape Town", type:"Entire apartment", title:"Modern Apartment in Cape Town",
        host:"Johann", host_id:"6676f16fdace0e26aed41e79", guests:4, bedrooms:2, bathrooms:2,
        amenities:["wifi","kitchen","free parking"], rating:4.5, reviews:320, star:4.8, price:320,
        cleaningFee:50, serviceFee:50, occupancyTaxes:30, weeklyDiscount:0.1,
        description:"Stay in the heart of Cape Town",
        images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267","https://images.unsplash.com/photo-1507525428034-b723cf961d3e","https://images.unsplash.com/photo-1449157291145-7efd050a4d0e","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4","https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
        img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
      }));
  },[id]);

  if(!place) return <p style={{padding:"40px"}}>Loading...</p>;

  const nights = Math.max(1, Math.round((dates[0].endDate - dates[0].startDate)/(1000*60*60*24)));
  const subtotal = place.price * nights;
  const weeklyDiscount = nights >=7? subtotal * (place.weeklyDiscount||0.1) : 0;
  const total = subtotal - weeklyDiscount + (place.cleaningFee||50) + (place.serviceFee||50) + (place.occupancyTaxes||30);

  const handleReserve = () => {
    fetch("http://localhost:5000/api/reservations", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ accommodation_id: place.id, host_id: place.host_id, checkIn: dates[0].startDate, checkOut: dates[0].endDate, guests, nights, total })
    }).then(()=>alert("Reservation saved! Total R"+total.toFixed(0))).catch(()=>alert("Reserved! Total R"+total.toFixed(0)+" (demo mode)"));
  };

  return (
    <div style={{padding:"40px"}}>
      <h1>{place.type} in {place.location}</h1>
      <p>★ {place.rating || place.star} • {place.reviews || 120} reviews • {place.location}</p>
      <div style={{display:"flex", gap:"10px", height:"400px", marginTop:"20px"}}>
        <img src={place.images?.[0]||place.img} style={{flex:2, borderRadius:"12px", objectFit:"cover", width:"50%", height:"400px"}} alt="" />
        <div style={{flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
          {(place.images?.slice(1,5)||[place.img,place.img,place.img,place.img]).map((img,i)=><img key={i} src={img} style={{width:"100%", height:"195px", objectFit:"cover", borderRadius:"8px"}} alt="" />)}
        </div>
      </div>
      <div style={{display:"flex", gap:"40px", marginTop:"40px"}}>
        <div style={{flex:2}}><h2>Hosted by {place.host}</h2><p>{place.guests} guests • {place.bedrooms} bedrooms • {place.bathrooms} baths</p><p>{place.description}</p></div>
        <div style={{flex:1, border:"1px solid #ddd", borderRadius:"12px", padding:"20px", position:"sticky", top:"20px"}}>
          <h3>R{place.price} / night</h3>
          <DateRange ranges={dates} onChange={i=>setDates([i.selection])} rangeColors={["#FF385C"]} />
          <div>Guests: <button onClick={()=>setGuests(Math.max(1,guests-1))}>-</button> {guests} <button onClick={()=>setGuests(guests+1)}>+</button></div>
          <p>R{place.price} x {nights} = R{subtotal}</p>
          {weeklyDiscount>0 && <p style={{color:"green"}}>Weekly discount -R{weeklyDiscount.toFixed(0)}</p>}
          <p>Cleaning R{place.cleaningFee||50} • Service R{place.serviceFee||50} • Tax R{place.occupancyTaxes||30}</p>
          <h3>Total R{total.toFixed(0)}</h3>
          <button onClick={handleReserve} style={{width:"100%", background:"#FF385C", color:"white", padding:"14px", border:"none", borderRadius:"8px"}}>Reserve</button>
        </div>
      </div>
    </div>
  )
}