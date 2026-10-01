import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header'; // if yours is in layout/Header use that path
import Banner from './components/Banner';
import Home from './components/Home';
import LocationPage from './components/LocationPage';
import LocationDetails from './components/LocationDetails';
import Footer from './components/layout/Footer';
import Reservations from './components/Reservations';
import Login from './components/admin/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateListing from './components/admin/CreateListing';
import EditListing from './components/admin/EditListing';
import HostingBanner from './components/hostingBanner/HostingBanner';

function App() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/accommodations")
     .then(res => res.json())
     .then(data => setListings(data));
  }, []);

  return (
    <div className="app">
      <Header setFiltered={setFiltered} listings={listings} />
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreateListing />} />
        <Route path="/admin/edit/:id" element={<EditListing />} />
        {/* Also support your old button names */}
        <Route path="/admin/create-listing" element={<CreateListing />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/" element={<><Banner /><Home listings={filtered || listings} /></>} />
        <Route path="/location/:locationName" element={<LocationPage listings={listings} />} />
        <Route path="/details/:id" element={<LocationDetails />} />
      </Routes>
      <HostingBanner />
      <Footer />
    </div>
  );
}
export default App;