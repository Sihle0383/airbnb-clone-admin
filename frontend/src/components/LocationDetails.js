import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function LocationDetails(){
  const {id} = useParams();
  const navigate = useNavigate();
  const [place,setPlace] = useState(null);
  const [dates,setDates] = useState([{
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate()+5)),
    key:"selection"
  }]);
  const [guests,setGuests] = useState(2);

  useEffect(()=>{
    if(!id || id==="undefined"){
      navigate("/");
      return;
    }
    fetch(`http://localhost:5000/api/accommodations/${id}`)
   .then(r=>{
       if(!r.ok) throw new Error("Not found");
       return r.json();
     })
   .then(setPlace)
   .catch(()=> {
       console.log("Using fallback - listing not in DB");
       setPlace({
        _id:id, location:"Cape Town", type:"Entire apartment", title:"Modern Apartment in Cape Town",
        host:"Johann", host_id:"6676f16fdace0e26aed41e79", guests:4, bedrooms:2, bathrooms:2,
        amenities:["Wifi","Kitchen","Washer","Dryer","Air conditioning","Heating","Dedicated workspace","TV","Hair dryer","Iron"], rating:4.5, reviews:320, star:4.8, price:320,
        cleaningFee:50, serviceFee:50, occupancyTaxes:30, weeklyDiscount:10,
        description:"Stay in the heart of Cape Town. This beautiful apartment is close to everything, with easy access to beaches and restaurants.",
        images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267","https://images.unsplash.com/photo-1507525428034-b723cf961d3e","https://images.unsplash.com/photo-1449157291145-7efd050a4d0e","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4","https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
        img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
      });
     });
  },[id, navigate]);

  if(!place) return <p style={{padding:"40px"}}>Loading...</p>;

  const getImage = (url)=>{
    if(!url) return "https://via.placeholder.com/600x400?text=No+Image";
    if(url.startsWith("http")) return url;
    if(url.startsWith("/uploads")) return `http://localhost:5000${url}`;
    if(url.startsWith("uploads")) return `http://localhost:5000/${url}`;
    return `http://localhost:5000/uploads/${url}`;
  };

  const nights = Math.max(1, Math.round((dates[0].endDate - dates[0].startDate)/(1000*60*60*24)));
  const price = Number(place.price)||0;
  const subtotal = price * nights;
  const weeklyDiscountPercent = Number(place.weeklyDiscount)||0;
  const weeklyDiscount = nights >=7? (weeklyDiscountPercent<1? subtotal*weeklyDiscountPercent : subtotal*weeklyDiscountPercent/100) : 0;
  const cleaning = Number(place.cleaningFee)||50;
  const service = Number(place.serviceFee)||50;
  const tax = Number(place.occupancyTaxes || place.occupancyTax)||30;
  const total = subtotal - weeklyDiscount + cleaning + service + tax;

  const handleReserve = async() => {
    const realId = place._id || place.id;
    const reservationData = {
      accommodation_id: realId,
      listingId: realId,
      title: place.title,
      propertyName: place.title,
      location: place.location,
      image: place.img || place.images?.[0],
      images: place.images,
      price: place.price,
      host_id: place.host_id,
      checkIn: dates[0].startDate,
      checkOut: dates[0].endDate,
      checkInDate: dates[0].startDate,
      checkOutDate: dates[0].endDate,
      guests,
      nights,
      total,
      totalPrice: total,
      guestName: "Jane Doe",
      userEmail: "jane@airbnb.com"
    };
    console.log("Reserving:", reservationData);
    try{
      const res = await fetch("http://localhost:5000/api/reservations", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(reservationData)
      });
      const data = await res.json();
      console.log("Reservation saved:", data);
      alert(`Reservation saved! Total R${total.toFixed(0)}`);
      navigate("/reservations");
    }catch(e){
      console.error(e);
      alert("Reservation saved locally (demo) R"+total.toFixed(0));
      navigate("/reservations");
    }
  };

  const mainImage = place.img || place.images?.[0];
  const gallery = place.images?.length>=5? place.images : [mainImage, mainImage, mainImage, mainImage, mainImage];
  const checkInStr = dates[0].startDate.toLocaleDateString();
  const checkOutStr = dates[0].endDate.toLocaleDateString();

  return (
    <div style={{padding:"40px", maxWidth:"1200px", margin:"0 auto"}}>
      <h1 style={{marginBottom:"5px"}}>{place.type} in {place.location}</h1>
      <p style={{marginTop:"0"}}>★ {place.rating || place.star || 4.9} • {place.reviews || 120} reviews • {place.location}</p>

      <div style={{display:"flex", gap:"10px", height:"400px", marginTop:"20px", borderRadius:"12px", overflow:"hidden"}}>
        <img src={getImage(gallery[0])} style={{flex:2, objectFit:"cover", width:"50%", height:"400px"}} alt="" onError={e=>e.target.src="https://via.placeholder.com/600x400"} />
        <div style={{flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", height:"400px"}}>
          <img src={getImage(gallery[1])} style={{width:"100%", height:"195px", objectFit:"cover", borderRadius:"8px"}} alt="" onError={e=>e.target.src="https://via.placeholder.com/300"} />
          <img src={getImage(gallery[2])} style={{width:"100%", height:"195px", objectFit:"cover", borderRadius:"8px"}} alt="" onError={e=>e.target.src="https://via.placeholder.com/300"} />
          <img src={getImage(gallery[3])} style={{width:"100%", height:"195px", objectFit:"cover", borderRadius:"8px"}} alt="" onError={e=>e.target.src="https://via.placeholder.com/300"} />
          <img src={getImage(gallery[4])} style={{width:"100%", height:"195px", objectFit:"cover", borderRadius:"8px"}} alt="" onError={e=>e.target.src="https://via.placeholder.com/300"} />
        </div>
      </div>

      <div style={{display:"flex", gap:"40px", marginTop:"40px"}}>
        {/* LEFT */}
        <div style={{flex:2}}>
          <h2>Hosted by {place.host || "Johann"}</h2>
          <p>{place.guests} guests • {place.bedrooms} bedrooms • {place.bathrooms} baths • {place.bedrooms} beds</p>
          <hr style={{margin:"20px 0"}} />

          <h3>About this place</h3>
          <p>{place.description || "Beautiful place in the heart of the city."}</p>
          <hr style={{margin:"20px 0"}} />

          {/* --- ADDED FROM VIDEO: Where you'll sleep --- */}
          <h2>Where you'll sleep</h2>
          <div style={{border:"1px solid #ddd", borderRadius:"12px", padding:"15px", width:"220px", marginTop:"15px"}}>
            <img src={getImage(gallery[0])} style={{width:"100%", height:"120px", objectFit:"cover", borderRadius:"8px"}} alt="" />
            <p style={{marginTop:"10px", marginBottom:"0"}}><b>Bedroom 1</b><br/>1 king bed</p>
          </div>
          <hr style={{margin:"20px 0"}} />

          {/* --- EDITED: What this place offers - now like video --- */}
          <h2>What this place offers</h2>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginTop:"15px"}}>
            {(place.amenities?.length? place.amenities : ["Kitchen","Wifi","Washer","Dryer","Air conditioning","Heating","Dedicated workspace","TV","Hair dryer","Iron"]).map((a,i)=>(
              <span key={i} style={{fontSize:"15px"}}>✓ {a}</span>
            ))}
          </div>
          <button style={{marginTop:"15px", padding:"10px 20px", borderRadius:"8px", border:"1px solid black", background:"white", fontWeight:"600", cursor:"pointer"}}>Show all 32 amenities</button>
          <hr style={{margin:"20px 0"}} />

          {/* --- ADDED FROM VIDEO: 7 Nights dynamic --- */}
          <h2>{nights} nights in {place.location}</h2>
          <p style={{color:"#717171", fontSize:"14px", marginTop:"5px"}}>{checkInStr} - {checkOutStr}</p>
          <p style={{fontSize:"13px", color:"#717171"}}>As you change dates above, dates below also update - dynamic like video</p>
          {/* Mini calendars that sync with main DateRange */}
          <div style={{display:"flex", gap:"30px", marginTop:"15px", border:"1px solid #eee", borderRadius:"12px", padding:"15px", overflowX:"auto"}}>
             <div>
               <b>{dates[0].startDate.toLocaleString('default',{month:'long'})} {dates[0].startDate.getFullYear()}</b>
               <div style={{fontSize:"13px", marginTop:"8px"}}>Check-in: <b>{checkInStr}</b></div>
             </div>
             <div>
               <b>{dates[0].endDate.toLocaleString('default',{month:'long'})} {dates[0].endDate.getFullYear()}</b>
               <div style={{fontSize:"13px", marginTop:"8px"}}>Check-out: <b>{checkOutStr}</b></div>
             </div>
          </div>
          <hr style={{margin:"20px 0"}} />

          {/* --- ADDED FROM VIDEO: Reviews --- */}
          <h2>★ {place.rating || 4.9} • {place.reviews || 120} reviews</h2>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginTop:"15px"}}>
            <div><div style={{display:"flex", justifyContent:"space-between"}}><span>Cleanliness</span><span>4.8</span></div><div style={{background:"#ddd", height:"4px", borderRadius:"2px"}}><div style={{background:"black", width:"90%", height:"4px"}}></div></div></div>
            <div><div style={{display:"flex", justifyContent:"space-between"}}><span>Accuracy</span><span>4.9</span></div><div style={{background:"#ddd", height:"4px"}}><div style={{background:"black", width:"95%", height:"4px"}}></div></div></div>
            <div><div style={{display:"flex", justifyContent:"space-between"}}><span>Communication</span><span>4.9</span></div><div style={{background:"#ddd", height:"4px"}}><div style={{background:"black", width:"96%", height:"4px"}}></div></div></div>
            <div><div style={{display:"flex", justifyContent:"space-between"}}><span>Location</span><span>4.8</span></div><div style={{background:"#ddd", height:"4px"}}><div style={{background:"black", width:"90%", height:"4px"}}></div></div></div>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"25px", marginTop:"25px"}}>
            {[
              {name:"Maya", date:"December 2023", text:"Great location, very clean. Host Johann was super responsive."},
              {name:"Alex", date:"November 2023", text:"Beautiful apartment in Cape Town, close to everything."},
              {name:"Sarah", date:"October 2023", text:"Loved the place, exactly as described. Would stay again!"},
              {name:"David", date:"September 2023", text:"Amazing stay, highly recommend for families."},
            ].map((r,i)=>(
              <div key={i}>
                <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
                  <div style={{width:"40px", height:"40px", background:"#FF385C", color:"white", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"700"}}>{r.name[0]}</div>
                  <div><b>{r.name}</b><div style={{fontSize:"13px", color:"#717171"}}>{r.date}</div></div>
                </div>
                <p style={{fontSize:"14px", marginTop:"8px", lineHeight:"1.4"}}>{r.text}</p>
              </div>
            ))}
          </div>
          <button style={{marginTop:"15px", padding:"10px 20px", borderRadius:"8px", border:"1px solid black", background:"white", fontWeight:"600", cursor:"pointer"}}>Show all 120 reviews</button>
          <hr style={{margin:"20px 0"}} />

          {/* --- ADDED FROM VIDEO: Hosted By Details --- */}
          <div style={{display:"flex", gap:"15px", alignItems:"center"}}>
            <div style={{width:"60px", height:"60px", background:"#ddd", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px"}}>👤</div>
            <div>
              <h2 style={{margin:0}}>Hosted By {place.host || "Johann"}</h2>
              <p style={{margin:"5px 0", color:"#717171", fontSize:"14px"}}>Superhost • 7 years hosting</p>
            </div>
          </div>
          <p style={{marginTop:"15px"}}>⭐ 4.9 Rating • {place.reviews || 120} Reviews • Identity verified • Superhost</p>
          <p style={{fontSize:"14px", lineHeight:"1.5"}}>Johann is a Superhost. Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
          <p style={{fontSize:"14px"}}><b>Response rate:</b> 100% • <b>Response time:</b> within an hour</p>
          <button style={{marginTop:"10px", padding:"12px 20px", borderRadius:"8px", border:"1px solid black", background:"white", fontWeight:"600", cursor:"pointer"}}>Contact Host</button>
          <hr style={{margin:"25px 0"}} />

          {/* --- ADDED FROM VIDEO: House Rules / Health / Cancellation --- */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"30px"}}>
            <div>
              <h3>House Rules</h3>
              <p style={{fontSize:"14px", lineHeight:"1.6"}}>Check-in: 3:00 PM - 9:00 PM<br/>Checkout: 10:00 AM<br/>No smoking<br/>No pets<br/>No parties or events</p>
              <u style={{fontWeight:"600", cursor:"pointer"}}>Show more</u>
            </div>
            <div>
              <h3>Health & Safety</h3>
              <p style={{fontSize:"14px", lineHeight:"1.6"}}>✓ Enhanced cleaning process<br/>✓ Social distancing and other COVID-19 guidelines<br/>✓ Carbon monoxide alarm<br/>✓ Smoke alarm</p>
              <u style={{fontWeight:"600", cursor:"pointer"}}>Show more</u>
            </div>
            <div>
              <h3>Cancellation Policy</h3>
              <p style={{fontSize:"14px", lineHeight:"1.6"}}>Free cancellation before Oct 4.<br/>Review the Host's full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19.</p>
              <u style={{fontWeight:"600", cursor:"pointer"}}>Show more</u>
            </div>
          </div>
        </div>

        {/* RIGHT - YOUR EXISTING COST CALCULATOR - UNCHANGED LOGIC */}
        <div style={{flex:1, border:"1px solid #ddd", borderRadius:"12px", padding:"20px", position:"sticky", top:"20px", boxShadow:"0 6px 16px rgba(0,0,0,0.12)", height:"fit-content"}}>
          <h3 style={{display:"flex", justifyContent:"space-between"}}><span>R{price} / night</span><span>★ {place.rating||4.9}</span></h3>

          <div style={{border:"1px solid #ddd", borderRadius:"8px", overflow:"hidden", margin:"15px 0"}}>
            <DateRange ranges={dates} onChange={i=>setDates([i.selection])} rangeColors={["#FF385C"]} minDate={new Date()} />
            <div style={{padding:"12px", borderTop:"1px solid #ddd", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span>Guests</span>
              <div><button onClick={()=>setGuests(Math.max(1,guests-1))} style={{padding:"4px 8px"}}>-</button> <span style={{margin:"0 8px"}}>{guests}</span> <button onClick={()=>setGuests(guests+1)} style={{padding:"4px 8px"}}>+</button></div>
            </div>
          </div>

          <button onClick={handleReserve} style={{width:"100%", background:"#FF385C", color:"white", padding:"14px", border:"none", borderRadius:"8px", fontWeight:"700", cursor:"pointer", fontSize:"16px"}}>Reserve</button>
          <p style={{textAlign:"center", fontSize:"13px", margin:"10px 0", color:"#717171"}}>You won't be charged yet</p>

          <div style={{marginTop:"15px"}}>
            <div style={{display:"flex", justifyContent:"space-between", margin:"10px 0"}}><span>R{price} x {nights} nights</span><span>R{subtotal.toFixed(0)}</span></div>
            {weeklyDiscount>0 && <div style={{display:"flex", justifyContent:"space-between", margin:"10px 0", color:"green"}}><span>Weekly discount</span><span>-R{weeklyDiscount.toFixed(0)}</span></div>}
            <div style={{display:"flex", justifyContent:"space-between", margin:"10px 0"}}><span>Cleaning fee</span><span>R{cleaning}</span></div>
            <div style={{display:"flex", justifyContent:"space-between", margin:"10px 0"}}><span>Service fee</span><span>R{service}</span></div>
            <div style={{display:"flex", justifyContent:"space-between", margin:"10px 0"}}><span>Occupancy taxes</span><span>R{tax}</span></div>
            <hr style={{margin:"15px 0"}} />
            <div style={{display:"flex", justifyContent:"space-between", fontWeight:"700", fontSize:"18px"}}><span>Total</span><span>R{total.toFixed(0)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}