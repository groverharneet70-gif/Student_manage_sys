import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { FiCompass, FiArrowLeft } from 'react-icons/fi';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="text-center p-5" style={{ maxWidth: '500px' }}>
        <div className="text-primary mb-4">
          <FiCompass size={72} className="animate-spin-slow" />
        </div>
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h3 className="mb-3">Page Not Found</h3>
        <p className="text-secondary mb-4">
          The requested page route could not be found or has been moved. Check the URL or click below to return to safety.
        </p>
        <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => navigate('/')}>
          <FiArrowLeft size={16} /> Back to Dashboard
        </button>
      </Card>
    </div>
  );
};
