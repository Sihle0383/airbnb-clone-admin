const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// --- 1. JWT AUTH MIDDLEWARE (Box 6) ---
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ error: "No token, not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "airbnb_secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --- 2. MULTER SETUP FOR MULTIPLE IMAGES ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
  }
});

// --- 3. LISTING MODEL (Mongoose) ---
const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  bedrooms: Number,
  bathrooms: Number,
  guests: Number,
  type: String,
  price: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  weeklyDiscount: { type: Number, default: 0 },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  occupancyTaxes: { type: Number, default: 0 },
  host: { type: String },
}, { timestamps: true });

const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

// --- 4. CREATE LISTING - Multiple Images (Box 3) ---
router.post("/", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { title, location, description, bedrooms, bathrooms, guests, type, price, amenities, weeklyDiscount, cleaningFee, serviceFee, occupancyTaxes } = req.body;

    // Validation
    if (!title ||!location ||!price) {
      return res.status(400).json({ error: "Title, location and price are required" });
    }

    const imagePaths = req.files? req.files.map(f => `/uploads/${f.filename}`) : [];

    const newListing = new Listing({
      title,
      location,
      description,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      guests: Number(guests) || 0,
      type,
      price: Number(price),
      amenities: amenities? amenities.split(",").map(a => a.trim()) : [],
      images: imagePaths,
      weeklyDiscount: Number(weeklyDiscount) || 0,
      cleaningFee: Number(cleaningFee) || 0,
      serviceFee: Number(serviceFee) || 0,
      occupancyTaxes: Number(occupancyTaxes) || 0,
      host: req.user.username || req.user.id
    });

    const saved = await newListing.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- 5. VIEW ALL LISTINGS (Box 4) ---
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 6. GET SINGLE LISTING (For Update Page - Box 5) ---
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 7. UPDATE LISTING (Box 5) - Pre-fill + Save ---
router.put("/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const existing = await Listing.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    // If new images uploaded, add them, otherwise keep old
    let imagePaths = existing.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      imagePaths = [...imagePaths,...newImages];
    }

    const updatedData = {
     ...req.body,
      amenities: req.body.amenities? req.body.amenities.split(",").map(a => a.trim()) : existing.amenities,
      images: imagePaths,
      price: req.body.price? Number(req.body.price) : existing.price
    };

    const updated = await Listing.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 8. DELETE LISTING (Box 4) ---
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;