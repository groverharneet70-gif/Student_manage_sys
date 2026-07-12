import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiUsers, FiUserPlus, FiInfo, FiMenu, FiX } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Do not render Sidebar on Login page or if user is unauthenticated
  if (!isAuthenticated || location.pathname === '/login') return null;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-nav-header d-flex justify-content-between align-items-center d-md-none bg-secondary border-bottom border-light-subtle px-3 py-2 fixed-top" style={{ zIndex: 1000, height: '56px' }}>
        <div className="logo-container d-flex align-items-center gap-2">
          <FaGraduationCap className="logo-icon text-primary" size={28} />
          <span className="logo-text fw-bold fs-5 text-primary">EduPulse</span>
        </div>
        <button className="nav-toggle-btn btn border-0 p-1" onClick={toggleSidebar} aria-label="Toggle navigation drawer">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {isOpen && <div className="sidebar-backdrop fixed-top w-100 vh-100" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 998 }} onClick={closeSidebar}></div>}

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} style={{ zIndex: 999 }}>
        <div className="sidebar-brand">
          <FaGraduationCap className="logo-icon" size={32} />
          <div className="brand-info">
            <span className="logo-text">EduPulse</span>
            <span className="logo-subtext">Registry Admin</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <FiGrid size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/students" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <FiUsers size={18} />
              <span>Students Directory</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/add-student" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <FiUserPlus size={18} />
              <span>Enroll Student</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <FiInfo size={18} />
              <span>About System</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="footer-status">
            <div className="status-dot"></div>
            <span>System Active</span>
          </div>
          <span className="version-tag">v1.0.0</span>
        </div>
      </nav>
    </>
  );
};
