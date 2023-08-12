import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import noProfile from "../assets/no-profile.png"
import { GiShoppingCart } from "react-icons/gi"
import { AiFillHome, AiFillInfoCircle, AiFillPhone, AiOutlinePoweroff } from "react-icons/ai"

function Header({toggleCart}) {

  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false)

  const { isLoggedIn, logout, loggedInUser } = useAuth()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfile = ()=> {
    setProfileOpen(!profileOpen)
  }

  const handleLogout = ()=> {
    logout()
    setMenuOpen(false)
    setProfileOpen(false)
    navigate('/')
    
  }

  console.log(loggedInUser)

  return(
    <div className='nav-container'>
      <nav className="navbar">
        <div className="nav-menu">
          <h1 className='nav-brand'>beliKelambi</h1>
          <Link to="/" className='nav-link'>Home</Link>
          <Link to="/contact" className='nav-link'>Contact</Link>
          <Link to="/about" className='nav-link'>About Us</Link>
        </div>

        <div className="nav-profile">
          {isLoggedIn ? (
            <>
              <div className="cart-icon">
                {loggedInUser.cart && loggedInUser.cart.length > 0 && (

                  <div className="cart-notification"></div>
                )}
                <GiShoppingCart 
                onClick={toggleCart} />
              </div>
              <img 
              src={noProfile} 
              alt="profile picture"
              className='profile-img'
              onClick={toggleProfile}  />
            </>
          ) : (
            <>
              <Link to="/login" className='login-btn'>Login</Link>
              <Link to="/register" className='register-btn'>Register</Link>
            </>
          )}
          <div onClick={toggleMenu} className={`hamburger-menu ${menuOpen ? "active" : ""}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </nav>

      <div className={`sidebar ${menuOpen ? "active" : ""}`}>
        {isLoggedIn && (
          <>
            <img 
              src={noProfile} 
              alt="profile picture"
              className='sidebar-profile-img'  />
              <Link to="/login" className="sidebar-profile-link">profile</Link>
          </>
        )}
        <Link to="/login" className="sidebar-link"><span><AiFillHome /></span> Home</Link>
        <Link to="/login" className="sidebar-link"><span><AiFillInfoCircle /></span> About</Link>
        <Link to="/login" className="sidebar-link"><span><AiFillPhone /></span> Contact</Link>
        {isLoggedIn ? <button className='logout-btn' onClick={handleLogout}><span><AiOutlinePoweroff /></span> Logout</button> : (
          <>
            <Link to="/login" className='sidebar-login'>Login</Link>
            <Link to="/register" className='sidebar-register'>Register</Link>
          </>
        )}
      </div>
      {profileOpen && isLoggedIn && (
        <div className={`profile ${profileOpen ? "active" : ""}`}>
            <Link to="/profile" className="profile-link">Profile</Link>
            <button className='logout-btn' onClick={handleLogout}><span><AiOutlinePoweroff /></span> Logout</button>
        </div>
      )}
    </div>
  );
}

export default Header;
