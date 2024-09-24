import React from 'react';
import {Link} from "react-router-dom";


function Header() {
  return (
    <header className='header'>
      <div className='header-container'>
        <div className='logo'>
          <Link to='/'>TaskNest</Link>
        </div>
        <nav className='nav'>
          <ul className='nav-links'>
            <li>
              <Link to ='/'>Home</Link>
            </li>
            <li>
              <Link to ='/'>Tasks</Link>
            </li>
            <li>
              <Link to = '/'>Profile</Link>
            </li>
          </ul>
        </nav>
        <div className='search-bar'> 
        <input type='text' placeholder="search tasks"></input>
        </div>
      </div>
    </header>
  );
}

export default Header;