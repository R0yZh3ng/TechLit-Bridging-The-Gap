import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-shield-alt"></i> TechLit
        </Link>
        <ul className="nav-links">
          <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/learn"><i className="fas fa-book"></i> Learn</Link></li>
          <li><Link to="/practice"><i className="fas fa-dumbbell"></i> Practice</Link></li>
          <li><Link to="/about"><i className="fas fa-info-circle"></i> About</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;