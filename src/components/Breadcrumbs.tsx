import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Hide breadcrumbs on root dashboard and login pages
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            <FiHome size={14} style={{ marginRight: '6px', transform: 'translateY(-1px)' }} />
            Dashboard
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          let displayName = value;
          if (value === 'students') displayName = 'Student Directory';
          else if (value === 'add-student') displayName = 'New Enrollment';
          else if (value === 'edit-student') displayName = 'Modify Profile';
          else if (value === 'student') displayName = 'Student Profile';
          else if (value === 'about') displayName = 'About System';
          else if (value.length > 5 && (value.startsWith('std-') || !isNaN(Number(value)) || value.length >= 10)) {
            displayName = 'Profile File';
          } else {
            displayName = value.charAt(0).toUpperCase() + value.slice(1);
          }

          return last ? (
            <li key={to} className="breadcrumb-item active" aria-current="page">
              <FiChevronRight size={14} className="breadcrumb-separator" />
              <span>{displayName}</span>
            </li>
          ) : (
            <li key={to} className="breadcrumb-item">
              <FiChevronRight size={14} className="breadcrumb-separator" />
              <Link to={to} className="breadcrumb-link">
                {displayName}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
