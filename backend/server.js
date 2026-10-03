require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive:true});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

const AccommodationSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  type: {type:String, default:"Entire apartment"},
  guests: Number,
  bedrooms: Number,
  bathrooms: Number,
  description: String,
  amenities: [String],
  images: [String],
  img: String,
  host: {type:String, default:"Johann"},
  hostName: String,
  host_id: {type:String, default:"6676f16fdace0e26aed41e79"},
  rating: {type:Number, default:4.9},
  reviews: {type:Number, default:120},
  cleaningFee: {type:Number, default:50},
  serviceFee: {type:Number, default:50},
  occupancyTax: {type:Number, default:30},
  occupancyTaxes: {type:Number, default:30},
  discount: Number,
  weeklyDiscount: {type:Number, default:0},
}, {timestamps:true, strict:false});

const ReservationSchema = new mongoose.Schema({
  accommodation_id: String,
  listingId: String,
  title: String,
  location: String,
  image: String,
  images: [String],
  price: Number,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  nights: Number,
  total: Number,
  userEmail: String,
}, {timestamps:true, strict:false});

const Accommodation = mongoose.model("Accommodation", AccommodationSchema);
const Reservation = mongoose.model("Reservation", ReservationSchema);

// ROUTES
app.get("/api/accommodations", async (req,res)=>{
  try {
    const filter = {};
    if(req.query.location) filter.location = {$regex:req.query.location, $options:"i"};
    if(req.query.guests) filter.guests = { $gte: Number(req.query.guests) };
    const all = await Accommodation.find(filter).sort({createdAt:-1});
    res.json(all);
  } catch(e){ res.status(500).json({error:e.message}); }
});

// --- ADDED: SEARCH ENDPOINT FOR YOUR HEADER FILTER (so location click works) ---
app.get("/api/search", async (req,res)=>{
  try{
    const filter = {};
    if(req.query.location) filter.location = {$regex:req.query.location, $options:"i"};
    if(req.query.guests) filter.guests = { $gte: Number(req.query.guests) };
    const all = await Accommodation.find(filter).sort({createdAt:-1});
    res.json(all);
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.get("/api/accommodations/:id", async (req,res)=>{
  try{
    if(req.params.id==="undefined") return res.status(400).json({error:"Invalid ID"});
    const one = await Accommodation.findById(req.params.id);
    if(!one) return res.status(404).json({error:"Not found"});
    res.json(one);
  }catch(e){ res.status(400).json({error:e.message}); }
});

app.post("/api/accommodations", upload.array("images", 6), async (req,res)=>{
  try{
    let data = {...req.body};
    if(typeof data.amenities==='string'){
      try{ data.amenities=JSON.parse(data.amenities); }catch{ data.amenities=data.amenities.split(","); }
    }
    if(req.files?.length){
      const urls = req.files.map(f=>`http://localhost:5000/uploads/${f.filename}`);
      data.images = urls;
      data.img = urls[0];
    }
    data.host = data.host || data.hostName || "Johann";
    const created = await Accommodation.create(data);
    res.status(201).json(created);
  }catch(e){ res.status(400).json({error:e.message}); }
});

app.put("/api/accommodations/:id", upload.array("images", 6), async (req,res)=>{
  try{
    let data = {...req.body};
    if(typeof data.amenities==='string'){
      try{ data.amenities=JSON.parse(data.amenities); }catch{ data.amenities=[]; }
    }
    if(req.files?.length){
      const urls = req.files.map(f=>`http://localhost:5000/uploads/${f.filename}`);
      data.images = urls;
      data.img = urls[0];
    }
    const updated = await Accommodation.findByIdAndUpdate(req.params.id, data, {new:true});
    res.json(updated);
  }catch(e){ res.status(400).json({error:e.message}); }
});

app.delete("/api/accommodations/:id", async (req,res)=>{
  try{
    if(!req.params.id || req.params.id==="undefined") return res.status(400).json({error:"Invalid ID"});
    const del = await Accommodation.findByIdAndDelete(req.params.id);
    if(!del) return res.status(404).json({error:"Not found"});
    res.json({message:"Deleted"});
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.get("/api/reservations", async (req,res)=>{
  try{
    const all = await Reservation.find().sort({createdAt:-1});
    res.json(all);
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.post("/api/reservations", async (req,res)=>{
  try{
    const created = await Reservation.create(req.body);
    res.status(201).json(created);
  }catch(e){ res.status(400).json({error:e.message}); }
});

app.delete("/api/reservations/:id", async (req,res)=>{
  try{
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({message:"Deleted"});
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.post("/api/auth/login", (req,res)=>{
  const {email,password}=req.body;
  if(email==="jane@airbnb.com" && password==="password321"){
    return res.json({user:{email,name:"Jane"}, token:"fake"});
  }
  res.status(401).json({error:"Invalid"});
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// --- ADDED: Health check so VS Code doesn't say "lost communication" ---
app.get("/", (req,res)=> res.send("API running - MongoDB connected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));