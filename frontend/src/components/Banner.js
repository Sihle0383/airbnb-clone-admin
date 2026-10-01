import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <div className="banner">
      <div className="banner__info">
        <h1>Not sure where to go? Perfect.</h1>
        <button onClick={() => window.scrollTo({top: 700, behavior: "smooth"})}>
          I'm flexible
        </button>
      </div>
    </div>
  );
}
export default Banner;