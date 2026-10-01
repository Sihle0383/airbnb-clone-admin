import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopHeader from "./AdminTopHeader";

const AMENITIES_LIST = ["Wifi","Kitchen","Washer","Dryer","Air conditioning","Heating","Dedicated workspace","TV","Hair dryer","Iron","Pool","Hot tub","Free parking","EV charger","Crib","King bed","Gym","BBQ grill","Breakfast","Beachfront","Smoke alarm","Carbon monoxide alarm"];

export default function CreateListing(){
  const navigate = useNavigate();
  const [form,setForm] = useState({
    title:"", location:"", price:"", type:"Entire home",
    guests:2, bedrooms:1, bathrooms:1,
    cleaningFee:0, serviceFee:0, occupancyTax:0, discount:0,
    description:""
  });
  const [amenities, setAmenities] = useState([]);
  const [images,setImages] = useState([]);
  const [previews,setPreviews] = useState([]);
  const [uploading,setUploading] = useState(false);

  const addFiles = (files) => {
    if (images.length >= 6) {
      alert("Max 6 images");
      return;
    }
    const allowed = files.slice(0, 6 - images.length);
    setImages(prev=>[...prev,...allowed]);
    setPreviews(prev=>[...prev,...allowed.map(f=>URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i!== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i!== index);
    });
  };

  const toggleAmenity = (item) => {
    setAmenities(prev => prev.includes(item)? prev.filter(a=>a!==item) : [...prev, item]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length===0) return alert("Upload at least 1 image");
    setUploading(true);
    const data = new FormData();
    Object.keys(form).forEach(k=> data.append(k, form[k]));
    data.append("amenities", JSON.stringify(amenities));
    images.forEach(f=> data.append("images", f));

    try{
      const res = await fetch("http://localhost:5000/api/accommodations", {
        method:"POST",
        headers:{ "Authorization":`Bearer ${localStorage.getItem("token")}` },
        body:data
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create - check server logs");
      alert("Listing created with " + images.length + " images!");
      navigate("/admin");
    }catch(err){ alert(err.message); }
    finally{ setUploading(false); }
  };

  const inputStyle = {padding:"12px", borderRadius:"8px", border:"1px solid #ddd", width:"100%", boxSizing:"border-box"};
  const labelStyle = {fontWeight:"600", fontSize:"13px", color:"#555", marginBottom:"4px", display:"block"};

  return(
    <>
      <AdminTopHeader />
      <div style={{ maxWidth:"700px", margin:"30px auto", padding:"20px" }}>
        <h1>Create New Listing</h1>
        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"15px", marginTop:"20px"}}>

          <div onClick={()=>document.getElementById("fileInput").click()} style={{border:"2px dashed #ccc", borderRadius:"12px", padding:"30px", textAlign:"center", background:"#fafafa", cursor:"pointer"}}>
            <p>📸 Click or drag & drop images ({images.length}/6) - 6 now works!</p>
            <input id="fileInput" type="file" multiple accept="image/*" onChange={e=>addFiles(Array.from(e.target.files))} style={{display:"none"}} />
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"10px"}}>
            {previews.map((src,i)=><div key={i} style={{position:"relative"}}><img src={src} alt="" style={{width:"100%", height:"120px", objectFit:"cover", borderRadius:"8px"}} /><button type="button" onClick={()=>removeImage(i)} style={{position:"absolute", top:"5px", right:"5px", background:"black", color:"white", border:"none", borderRadius:"50%", width:"24px", height:"24px", cursor:"pointer"}}>✕</button></div>)}
          </div>

          <input name="title" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required style={inputStyle} />
          <input name="location" placeholder="Location - e.g. Camps Bay, Cape Town" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required style={inputStyle} />
          <input name="price" type="number" placeholder="Price per night" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required style={inputStyle} />
          <select name="type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inputStyle}><option>Entire home</option><option>Private room</option><option>Shared room</option></select>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px"}}>
            <div><label style={labelStyle}>Guests</label><input type="number" min="1" value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Bedrooms</label><input type="number" min="0" value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Bathrooms</label><input type="number" min="0" step="0.5" value={form.bathrooms} onChange={e=>setForm({...form,bathrooms:e.target.value})} style={inputStyle} /></div>
          </div>

          <div>
            <label style={labelStyle}>Amenities</label>
            <div style={{border:"1px solid #ddd", borderRadius:"8px", padding:"12px", display:"flex", flexWrap:"wrap", gap:"8px"}}>
              {AMENITIES_LIST.map(item=>(
                <span key={item} onClick={()=>toggleAmenity(item)} style={{padding:"6px 10px", borderRadius:"20px", fontSize:"13px", cursor:"pointer", border:"1px solid", borderColor: amenities.includes(item)? "#FF385C" : "#ddd", background: amenities.includes(item)? "#FFE8EC" : "white"}}>
                  {amenities.includes(item)? "✓ " : ""}{item}
                </span>
              ))}
            </div>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
            <div><label style={labelStyle}>Cleaning fee ($)</label><input type="number" min="0" value={form.cleaningFee} onChange={e=>setForm({...form,cleaningFee:e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Service fee ($)</label><input type="number" min="0" value={form.serviceFee} onChange={e=>setForm({...form,serviceFee:e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Occupancy taxes (%)</label><input type="number" min="0" max="100" value={form.occupancyTax} onChange={e=>setForm({...form,occupancyTax:e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Discount (%)</label><input type="number" min="0" max="100" value={form.discount} onChange={e=>setForm({...form,discount:e.target.value})} style={inputStyle} /></div>
          </div>

          <textarea name="description" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4} style={inputStyle}></textarea>
          <button disabled={uploading} style={{padding:"14px", background:"#FF385C", color:"white", border:"none", borderRadius:"8px", fontWeight:"600", cursor:"pointer"}}>{uploading?`Uploading ${images.length} images...`:"Create Listing"}</button>
        </form>
      </div>
    </>
  )
}