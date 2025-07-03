import React from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ onLogout }) => {
    const handleLogout = () => {
        if (onLogout) onLogout();
    };

    return (
        <nav className="navbar">
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/tasks">Tasks</NavLink></li>
                <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
