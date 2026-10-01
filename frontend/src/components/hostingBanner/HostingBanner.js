import React from 'react';
import './HostingBanner.css';

function HostingBanner() {
  return (
    <div className="hosting__section">
      <div className="hosting__card">
        <img 
          className="hosting__img"
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80" 
          alt="hosting questions"
        />
        <div className="hosting__overlay">
          <h1>Questions<br/>about<br/>hosting?</h1>
          <button className="hosting__btn">Ask a super host</button>
        </div>
      </div>
    </div>
  );
}

export default HostingBanner;