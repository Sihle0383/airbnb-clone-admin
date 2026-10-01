import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/accommodations/${id}`)
     .then(res => res.json())
     .then(data => setForm(data));
  }, [id]);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/accommodations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({...form, price: Number(form.price) })
    });
    if (res.ok) {
      alert('Updated!');
      navigate('/admin');
    } else {
      alert('Failed to update');
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Update Listing</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input name="title" value={form.title} onChange={handleChange} required />
        <input name="location" value={form.location} onChange={handleChange} required />
        <input name="price" type="number" value={form.price} onChange={handleChange} required />
        <input name="image" value={form.image} onChange={handleChange} required />
        <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
        <button type="submit" style={{ padding: '12px', background: '#222', color: 'white', border: 'none', borderRadius: '8px' }}>Update Listing</button>
      </form>
    </div>
  );
}

export default EditListing;