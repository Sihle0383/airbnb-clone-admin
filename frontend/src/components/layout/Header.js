import React, { useState, useEffect } from "react";
import "./Header.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthModal from './AuthModal';

function Header({ setFiltered }) {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('userEmail');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u.email || u.username || savedEmail || "user");
      } catch {
        setUser(savedUser);
      }
    } else if (savedEmail) {
      setUser(savedEmail);
    }
  }, [showAuth]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    setUser(null);
    setShowMenu(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [showHotels, setShowHotels] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [showDates, setShowDates] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [dates, setDates] = useState([{
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    key: "selection"
  }]);
  const [guests, setGuests] = useState({adults: 0, children: 0, infants: 0, pets: 0});
  const hotels = ["Cape Town", "Durban", "Knysna", "Sandton", "Pretoria", "Camps Bay", "Table Mountain"];

  const handleBecomeHost = () => {
    const token = localStorage.getItem('token');
    if (token) navigate('/admin'); else navigate('/admin/login');
  };

  // FIXED: Click location -> straight to filtered listings
  const handleHotelSelect = async (h) => {
    setSelectedHotel(h);
    setShowHotels(false);
    setShowDates(false);
    setShowGuests(false);

    const params = new URLSearchParams();
    params.append("location", h);
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) params.append("guests", totalGuests);

    try {
      // Fetch ONLY that location
      const res = await fetch(`http://localhost:5000/api/search?${params}`);
      const data = await res.json();

      if(setFiltered) setFiltered(data);

      // If you are not on home page, go to home with filter
      if (locationPath.pathname!== "/") {
        navigate(`/?location=${encodeURIComponent(h)}`);
      }

      // Take straight to listings (your listings section)
      setTimeout(() => {
        const listingsSection = document.getElementById("listings") || document.querySelector(".listings");
        if (listingsSection) {
          listingsSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 600, behavior: "smooth" });
        }
      }, 100);

    } catch (e) { console.log(e); }
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (selectedHotel) params.append("location", selectedHotel);
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) params.append("guests", totalGuests);
    if (dates[0].startDate) params.append("checkIn", dates[0].startDate.toISOString().split('T')[0]);
    if (dates[0].endDate) params.append("checkOut", dates[0].endDate.toISOString().split('T')[0]);
    try {
      const res = await fetch(`http://localhost:5000/api/search?${params}`);
      const data = await res.json();
      if(setFiltered) setFiltered(data);
      setShowDates(false); setShowHotels(false); setShowGuests(false);
      if (locationPath.pathname!== "/") navigate("/");
      window.scrollTo({ top: 600, behavior: "smooth" });
    } catch (e) { console.log(e); }
  };

  const totalGuestsDisplay = guests.adults + guests.children + guests.infants;
  const isLoggedIn =!!user;

  return (
    <div className={`headerWrapper ${scrolled? "headerWrapper__scrolled" : ""}`}>
      <div className="header__mainTop">
        <div className="header__logo" style={{cursor:"pointer", display:'flex', alignItems:'center'}} onClick={()=>window.location.reload()}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="airbnb" style={{height:'32px', width:'auto'}} />
          </Link>
        </div>

        <div className="header_topNav">
          <span className="active">Places to stay</span>
          <span>Experiences</span>
          <span>Online Experiences</span>
        </div>

        <div className="header__rightSection">
          {isLoggedIn? (
            <p onClick={() => setShowMenu(!showMenu)} style={{cursor:'pointer', fontWeight:600}}>
              Hi, {user.includes('@')? user.split('@')[0] : user}
            </p>
          ) : (
            <p onClick={handleBecomeHost} style={{cursor:'pointer', fontWeight:600}}>Become a host</p>
          )}

          <LanguageIcon className="header__iconBtn" />
          <div className="profile__container" style={{position:'relative'}}>
            <div className="header__profile" onClick={() => setShowMenu(!showMenu)} style={{cursor:'pointer'}}>
              <MenuIcon />
              {user? (
                <div style={{background:'#FF385C', color:'white', width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>
                  {user[0].toUpperCase()}
                </div>
              ) : <AccountCircleIcon />}
            </div>

            {showMenu && (
  <div className="airbnb-menu">
    {isLoggedIn? (
      <>
        <div className="menu-item" style={{fontWeight:700, cursor:'default'}}>
          Hi, {user.includes('@')? user.split('@')[0] : user}
        </div>
        <hr className="menu-divider" />
        <div className="menu-item" onClick={handleLogout} style={{cursor:'pointer', fontWeight:600}}>
          Log out
        </div>
      </>
                ) : (
                  <>
                    <div className="menu-item"><span className="menu-icon">🌐</span> Languages & currency</div>
                    <div className="menu-item"><span className="menu-icon">❔</span> Help Center</div>
                    <hr className="menu-divider" />
                    <div className="menu-item host-item" onClick={handleBecomeHost}>
                      <div><b>Become a host</b><p>It's easy to start hosting and earn extra income.</p></div>
                      <img src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" alt="host" className="host-illustration" />
                    </div>
                    <hr className="menu-divider" />
                    <div className="menu-item">Refer a Host</div>
                    <div className="menu-item">Find a co-host</div>
                    <hr className="menu-divider" />
                    <div className="menu-item" onClick={() => { setShowAuth(true); setShowMenu(false); }}>Log in or sign up</div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="searchBar">
        <div className="searchSection" onClick={() => { setShowHotels(!showHotels); setShowDates(false); setShowGuests(false); }}>
          <b>Locations</b><p>{selectedHotel || "Select Hotel"}</p>
          {showHotels && (
            <div className="dropdown" onClick={e=>e.stopPropagation()}>
              {hotels.map(h => (
                <div key={h} className="dropdownItem" onClick={(e) => { e.stopPropagation(); handleHotelSelect(h); }}>{h}</div>
              ))}
            </div>
          )}
        </div>
        <span className="divider" />
        <div className="searchSection" onClick={() => { setShowDates(true); setShowHotels(false); setShowGuests(false); }}>
          <b>Check in date</b><p>{dates[0].startDate.toDateString() === new Date().toDateString()? "Add dates" : dates[0].startDate.toLocaleDateString()}</p>
        </div>
        <span className="divider" />
        <div className="searchSection" onClick={() => { setShowDates(true); setShowHotels(false); setShowGuests(false); }}>
          <b>Check out date</b><p>{dates[0].endDate.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()? "Add dates" : dates[0].endDate.toLocaleDateString()}</p>
        </div>
        <span className="divider" />
        <div className="searchSection" onClick={() => { setShowGuests(!showGuests); setShowHotels(false); setShowDates(false); }}>
          <b>Guests</b><p>{totalGuestsDisplay > 0? `${totalGuestsDisplay} guests` : "Add guests"}</p>
          {showGuests && (
            <div className="dropdown guestsDropdown" onClick={e=>e.stopPropagation()}>
              <div className="guestRow">
                <div><b>Adults</b><div style={{fontSize:"13px", color:"#717171"}}>Ages 13 or above</div></div>
                <div className="guestControls">
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, adults: Math.max(0,p.adults-1)}))}}>-</button>
                  <span>{guests.adults}</span>
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, adults: p.adults+1}))}}>+</button>
                </div>
              </div>
              <div className="guestRow">
                <div><b>Children</b><div style={{fontSize:"13px", color:"#717171"}}>Ages 2 - 12</div></div>
                <div className="guestControls">
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, children: Math.max(0,p.children-1)}))}}>-</button>
                  <span>{guests.children}</span>
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, children: p.children+1}))}}>+</button>
                </div>
              </div>
              <div className="guestRow">
                <div><b>Infants</b><div style={{fontSize:"13px", color:"#717171"}}>Under 2</div></div>
                <div className="guestControls">
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, infants: Math.max(0,p.infants-1)}))}}>-</button>
                  <span>{guests.infants}</span>
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, infants: p.infants+1}))}}>+</button>
                </div>
              </div>
              <div className="guestRow">
                <div><b>Pets</b><div style={{fontSize:"13px", color:"#717171", textDecoration:"underline"}}>Bringing a service animal?</div></div>
                <div className="guestControls">
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, pets: Math.max(0,p.pets-1)}))}}>-</button>
                  <span>{guests.pets}</span>
                  <button onClick={(e)=>{e.stopPropagation(); setGuests(p=>({...p, pets: p.pets+1}))}}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="searchButton" onClick={handleSearch}><SearchIcon /></div>
      </div>

      {showDates && (
        <div className="datePickerWrapper" onClick={e=>e.stopPropagation()}>
          <DateRange ranges={dates} onChange={item => setDates([item.selection])} rangeColors={["#FF385C"]} minDate={new Date()} />
          <button className="closeCalendarBtn" onClick={()=>setShowDates(false)}>Close</button>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
export default Header;