import React from 'react';
import './Card.css';

const Card = ({src, title, description, price, city}) => {
  return (
    <div className='card'>
       <img
        src={src}
        alt={city || title}
        onError={(e) => {
          e.target.onerror = null;
          // fallback if Unsplash link dies
          e.target.src = `https://source.unsplash.com/800x600/?${city || title},beach`;
        }}
        style={{width:'100%', height:'200px', objectFit:'cover', display:'block', borderRadius:'10px'}}
       />
       <div className='card_info'>
          <h2>{title}</h2>
          <h4>{description}</h4>
          <h3>{price}</h3>
       </div>
    </div>
  )
}

export default Card;