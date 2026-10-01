import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopHeader from "./AdminTopHeader";

export default function EditListing(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [form,setForm] = useState({ title:"", location:"", price:"", type:"", guests:2, description:"" });
  const [existingImages,setExistingImages] = useState([]);
  const [newImages,setNewImages] = useState([]);
  const [newPreviews,setNewPreviews] = useState([]);
  const [saving,setSaving] = useState(false);

  useEffect(()=>{
    fetch(`http://localhost:5000/api/accommodations/${id}`).then(r=>r.json()).then(d=>{
      setForm({ title:d.title||"", location:d.location||"", price:d.price||"", type:d.type||"Entire home", guests:d.guests||2, description:d.description||"" });
      setExistingImages(d.images || (d.img? [d.img]:[]));
    });
  },[id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    Object.keys(form).forEach(k=> data.append(k, form[k]));
    data.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach(f=> data.append("images", f));
    try{
      await fetch(`http://localhost:5000/api/accommodations/${id}`, { method:"PUT", headers:{ "Authorization":`Bearer ${localStorage.getItem("token")}` }, body:data });
      navigate("/admin");
    }catch{ alert("Failed"); } finally{ setSaving(false); }
  };

  return(
    <>
      <AdminTopHeader />
      <div style={{maxWidth:"700px", margin:"30px auto", padding:"20px"}}>
        <h1>Edit Listing</h1>
        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"15px", marginTop:"20px"}}>
          <label style={{fontWeight:"600"}}>Current Images (click ✕ to remove)</label>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"10px"}}>
            {existingImages.map((src,i)=><div key={i} style={{position:"relative"}}><img src={src} alt="" style={{width:"100%", height:"120px", objectFit:"cover", borderRadius:"8px"}} /><button type="button" onClick={()=>setExistingImages(existingImages.filter((_,x)=>x!==i))} style={{position:"absolute", top:"5px", right:"5px", background:"black", color:"white", borderRadius:"50%", border:"none", width:"24px"}}>✕</button></div>)}
          </div>
          <div onClick={()=>document.getElementById("editFile").click()} style={{border:"2px dashed #ccc", padding:"20px", textAlign:"center", borderRadius:"12px", cursor:"pointer"}}>📸 Add New Images<input id="editFile" type="file" multiple accept="image/*" onChange={e=>{const files=Array.from(e.target.files); setNewImages([...newImages,...files]); setNewPreviews([...newPreviews,...files.map(f=>URL.createObjectURL(f))])}} style={{display:"none"}} /></div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"10px"}}>{newPreviews.map((src,i)=><div key={i} style={{position:"relative", border:"2px solid #4CAF50", borderRadius:"8px"}}><img src={src} alt="" style={{width:"100%", height:"120px", objectFit:"cover", borderRadius:"8px"}} /><span style={{position:"absolute", top:"5px", left:"5px", background:"#4CAF50", color:"white", fontSize:"10px", padding:"2px 6px", borderRadius:"4px"}}>NEW</span></div>)}</div>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{padding:"12px", borderRadius:"8px", border:"1px solid #ddd"}} />
          <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={{padding:"12px", borderRadius:"8px", border:"1px solid #ddd"}} />
          <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={{padding:"12px", borderRadius:"8px", border:"1px solid #ddd"}} />
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{padding:"12px", borderRadius:"8px", border:"1px solid #ddd"}} rows={4}></textarea>
          <button disabled={saving} style={{padding:"14px", background:"#FF385C", color:"white", border:"none", borderRadius:"8px"}}>{saving?"Saving...":"Update Listing"}</button>
        </form>
      </div>
    </>
  )
}