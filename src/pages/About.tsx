import React from 'react';
import { Card } from '../components/Card';
import { FiCpu, FiDatabase, FiLayout, FiCheckCircle, FiInfo, FiCode } from 'react-icons/fi';

export const About: React.FC = () => {
  const features = [
    'Secure Routing and Login Simulation',
    'Full CRUD (Create, Read, Update, Delete) via HTTP requests to JSON Server REST API',
    'Responsive Sidebar Navigation & Search Suggestions dropdown',
    'Dark/Light Mode Theme toggles saved to localStorage',
    'Form validations with roll number uniqueness checks',
    'Dynamic pagination, sorting, and multi-course filtering',
    'Table and Card layouts with toggle switches',
    'CSV export of student profiles list',
    'Toast alerts for user actions and backend fetch errors'
  ];

  return (
    <div className="about-page container py-4">
      <div className="page-header mb-4">
        <h1>About the System</h1>
        <p className="text-secondary">
          EduPulse Student Management System is an advanced React admin dashboard designed for academic organizations.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Side: System Summary */}
        <div className="col-lg-7">
          <Card className="p-4 mb-4">
            <h3 className="mb-3 d-flex align-items-center gap-2">
              <FiInfo className="text-primary" /> Application Overview
            </h3>
            <p className="mb-3" style={{ lineHeight: '1.7' }}>
              This application showcases modern frontend architecture using functional React, TypeScript, and state management. 
              It provides administrators with full-fledged tooling to query, structure, export, and write student database entries.
            </p>
            <p className="mb-4" style={{ lineHeight: '1.7' }}>
              The UI features a customized glassmorphism design built upon the Bootstrap 5 responsive grid system, providing a clean dashboard on phones, tablets, and desktop computers.
            </p>

            <h4 className="mb-3 d-flex align-items-center gap-2">
              <FiCode className="text-primary" size={18} /> Core Features
            </h4>
            <div className="d-flex flex-column gap-2">
              {features.map((feat, index) => (
                <div key={index} className="d-flex align-items-start gap-2">
                  <FiCheckCircle className="text-success mt-1 flex-shrink-0" size={16} />
                  <span style={{ fontSize: '0.925rem' }}>{feat}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Technical Specs */}
        <div className="col-lg-5">
          <Card className="p-4 mb-4">
            <h3 className="mb-4 d-flex align-items-center gap-2">
              <FiCpu className="text-primary" /> Technology Stack
            </h3>

            <div className="d-flex flex-column gap-4">
              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary">
                  <FiCode size={24} />
                </div>
                <div>
                  <h5 className="mb-1">React 19 & TypeScript</h5>
                  <p className="text-secondary small mb-0">
                    Built using custom React Hooks, functional components, Context API state management, and strict TypeScript types.
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary">
                  <FiLayout size={24} />
                </div>
                <div>
                  <h5 className="mb-1">Bootstrap 5 & Custom CSS</h5>
                  <p className="text-secondary small mb-0">
                    Utilizes Bootstrap responsive containers combined with customized, smooth CSS transitions, shadows, and light/dark theme variables.
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary">
                  <FiDatabase size={24} />
                </div>
                <div>
                  <h5 className="mb-1">JSON Server Database</h5>
                  <p className="text-secondary small mb-0">
                    REST API simulator. Executes HTTP fetch protocols (GET, POST, PUT, DELETE) representing full-scale CRUD operations.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 text-center">
            <h5 className="mb-2">Portfolio Project</h5>
            <p className="text-secondary small mb-3">
              Developed as a professional resume item demonstrating state-of-the-art React dashboard implementations.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <span className="badge bg-secondary">React.js</span>
              <span className="badge bg-secondary">TypeScript</span>
              <span className="badge bg-secondary">REST API</span>
              <span className="badge bg-secondary">Bootstrap 5</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
