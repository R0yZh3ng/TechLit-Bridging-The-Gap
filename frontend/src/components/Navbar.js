import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

function Navbar({ user }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-shield-alt"></i> ScamSense
        </Link>
        
        <div className="navbar-streak">
          <i className="fas fa-fire"></i>
          <span>{user?.current_streak || 0}</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/learn"><i className="fas fa-book"></i> Learn</Link></li>
          <li><Link to="/practice"><i className="fas fa-dumbbell"></i> Practice</Link></li>
          <li><Link to="/daily-challenge"><i className="fas fa-calendar-day"></i> Daily Challenge</Link></li>
          <li><Link to="/about"><i className="fas fa-info-circle"></i> About</Link></li>
          {user && (
            <li>
              <span className="user-info">{user.email}</span>
              <button className="logout-btn" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;