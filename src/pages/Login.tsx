import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import { FiUser, FiLock } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useStudents();
  const navigate = useNavigate();
  const location = useLocation();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect target after login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const success = login(usernameInput, passwordInput);
    if (success) {
      addToast('Logged in successfully! Welcome to the Dashboard.', 'success');
      navigate(from, { replace: true });
    } else {
      setErrorMsg('Invalid username or password. (Hint: use admin / admin)');
      addToast('Authentication failed.', 'danger');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <FaGraduationCap size={36} />
        </div>
        <div className="login-header">
          <h2>EduPulse SMS</h2>
          <p>Sign in to manage the student registry</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && (
            <div className="alert alert-danger py-2 px-3 mb-3 text-center" style={{ fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label d-flex align-items-center gap-1">
              <FiUser size={14} /> Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username (admin)"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label d-flex align-items-center gap-1">
              <FiLock size={14} /> Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password (admin)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            Credential Hint: <strong>admin</strong> / <strong>admin</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
