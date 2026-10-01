import { useState } from "react";

export default function Footer(){
  const [showLang, setShowLang] = useState(false);
  const [lang, setLang] = useState("English (US)");

  const languages = ["English (US)", "Français", "Español", "IsiZulu"];

  return (
    <>
    <style>{`
      .footer-link { cursor: pointer; margin-bottom: 12px; font-size: 14px; }
      .footer-link:hover { text-decoration: underline; }
      .icon-btn { cursor: pointer; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #ebebeb; }
      .icon-btn:hover { background: #ddd; }
      .lang-dropdown { position: absolute; bottom: 45px; left: 0; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); overflow: hidden; z-index: 10; }
      .lang-item { padding: 10px 16px; cursor: pointer; font-size: 14px; }
      .lang-item:hover { background: #f7f7f7; }
    `}</style>

    <div style={{display:"flex", justifyContent:"space-between", padding:"40px", background:"#f7f7f7", borderTop:"1px solid #ddd"}}>
      <div><h4>Support</h4><p className="footer-link">Help Center</p><p className="footer-link">Safety</p><p className="footer-link">AirCover</p> <p className="footer-link">Cancellation</p> <p className="footer-link">Anti-discrimination</p><p className="footer-link">AirCover</p></div>
      <div><h4>Hosting</h4><p className="footer-link">Airbnb your home</p> <p className="footer-link">Airbnb your experience</p> <p className="footer-link">Airbnb your service</p><p className="footer-link">Community forum</p></div>
      <div><h4>Airbnb</h4><p className="footer-link">Newsroom</p><p className="footer-link">2026 Summer Release</p><p className="footer-link">Investors</p><p className="footer-link">Careers</p><p className="footer-link">Gift cards</p></div>
      <div><h4>Community</h4><p className="footer-link">Disaster relief</p><p className="footer-link">Against discrimination</p></div>
    </div>

    {/* BOTTOM BAR - this is the part from your photo */}
    <div style={{display:"flex", cursor:"pointer", justifyContent:"space-between", padding:"20px 40px", borderTop:"1px solid #ddd", background:"#f7f7f7", alignItems:"center", flexWrap:"wrap", gap:"20px"}}>
      <p>© 2026 Airbnb, Inc.</p>

      <div style={{display:"flex", gap:"24px", alignItems:"center"}}>
        
        {/* LANGUAGE BUTTON WITH 3+ OPTIONS */}
        <div style={{position:"relative"}}>
          <button 
            onClick={()=>setShowLang(!showLang)}
            style={{display:"flex", alignItems:"center", gap:"6px", background:"none", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"14px"}}
          >
            <span>🌐</span> {lang}
          </button>
          {showLang && (
            <div className="lang-dropdown">
              {languages.map(l => (
                <div key={l} className="lang-item" onClick={()=>{setLang(l); setShowLang(false)}}>
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>

        <span style={{fontWeight:"600", fontSize:"14px"}}>R ZAR</span>

        {/* STATIC ICONS - No links, just icons */}
        <div style={{display:"flex", gap:"10px"}}>
          {/* Facebook */}
          <div className="icon-btn" title="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </div>
          {/* Instagram */}
          <div className="icon-btn" title="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1"/></svg>
          </div>
          {/* Twitter / X */}
          <div className="icon-btn" title="Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.4l7.3-8.4L3 2h6.3l4.3 5.7L18.9 2zm-1.1 18h1.7L6 4H4.1L17.8 20z"/></svg>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}