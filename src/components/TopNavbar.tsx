import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { Breadcrumbs } from './Breadcrumbs';
import { FiSearch, FiSun, FiMoon, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';

export const TopNavbar: React.FC = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const { students, darkMode, toggleDarkMode } = useStudents();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchVal, setSearchVal] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const suggestRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Reset search when path changes
  useEffect(() => {
    setSearchVal('');
    setShowSuggest(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  // Hide on login screen
  if (!isAuthenticated || location.pathname === '/login') return null;

  // Filter suggestions
  const suggestions = students.filter(s => 
    s.name.toLowerCase().includes(searchVal.toLowerCase()) && 
    searchVal.trim().length > 0
  ).slice(0, 5);

  const handleSuggestionClick = (id: string) => {
    setSearchVal('');
    setShowSuggest(false);
    navigate(`/student/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-navbar-wrapper mb-4 d-flex flex-column gap-2">
      <div className="d-flex justify-content-between align-items-center">
        {/* Left Side: Breadcrumbs */}
        <div className="d-none d-md-block">
          <Breadcrumbs />
        </div>

        {/* Right Side: Search, Theme, Profile */}
        <div className="d-flex align-items-center gap-3 ms-auto w-100 justify-content-between justify-content-md-end">
          {/* Global Search Bar */}
          <div className="search-suggest-wrapper position-relative" style={{ maxWidth: '300px', flexGrow: 1 }} ref={suggestRef}>
            <div className="d-flex align-items-center bg-secondary border border-light-subtle rounded px-2 py-1">
              <FiSearch className="text-secondary me-2" size={16} />
              <input
                type="text"
                placeholder="Quick search student..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setShowSuggest(true);
                }}
                onFocus={() => setShowSuggest(true)}
                className="form-control border-0 bg-transparent py-1 shadow-none small"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            {/* Suggestions dropdown */}
            {showSuggest && suggestions.length > 0 && (
              <div className="search-suggestions-dropdown" style={{ minWidth: '240px' }}>
                {suggestions.map(student => {
                  const initial = student.name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
                  return (
                    <div
                      key={student.id}
                      className="suggestion-item d-flex align-items-center gap-2 p-2 border-bottom border-light-subtle"
                      onClick={() => handleSuggestionClick(student.id)}
                    >
                      {student.profileImage ? (
                        <img 
                          src={student.profileImage} 
                          alt={student.name} 
                          className="suggestion-avatar"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563EB&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="suggestion-avatar d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-semibold" style={{ fontSize: '0.75rem' }}>
                          {initial}
                        </div>
                      )}
                      <div className="suggestion-info">
                        <span className="suggestion-name small">{student.name}</span>
                        <span className="suggestion-roll text-muted" style={{ fontSize: '0.7rem' }}>{student.rollNumber}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="d-flex align-items-center gap-2">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-secondary p-2 d-flex align-items-center justify-content-center"
              style={{ width: '38px', height: '38px' }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FiSun size={18} className="text-warning" /> : <FiMoon size={18} />}
            </button>

            {/* User Profile dropdown */}
            <div className="user-profile-dropdown" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(prev => !prev)}
                className="btn btn-secondary d-flex align-items-center gap-2 py-1 px-2 border-light-subtle"
                style={{ height: '38px' }}
              >
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold small"
                  style={{ width: '26px', height: '26px', fontSize: '0.75rem' }}
                >
                  {username ? username.toUpperCase().substring(0, 2) : 'AD'}
                </div>
                <span className="small d-none d-sm-inline fw-semibold">{username || 'Admin'}</span>
                <FiChevronDown size={14} className="text-secondary" />
              </button>

              {/* Profile dropdown menu */}
              {showProfileMenu && (
                <div className="user-profile-menu">
                  <div className="px-3 py-2 border-bottom border-light-subtle mb-1">
                    <span className="small d-block text-secondary">Logged in as</span>
                    <span className="fw-semibold small text-primary">{username || 'Administrator'}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/about');
                    }}
                    className="user-profile-item"
                  >
                    <FiUser size={14} /> System Info
                  </button>
                  <div className="user-profile-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="user-profile-item text-danger"
                  >
                    <FiLogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Breadcrumbs view */}
      <div className="d-block d-md-none mt-2">
        <Breadcrumbs />
      </div>
    </header>
  );
};
