import React from 'react';
import { useStudents } from '../context/StudentContext';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStudents();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-notification-container">
      {toasts.map((toast) => {
        let Icon = FiInfo;
        let bgClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = FiCheckCircle;
          bgClass = 'toast-success';
        } else if (toast.type === 'danger') {
          Icon = FiXCircle;
          bgClass = 'toast-danger';
        } else if (toast.type === 'warning') {
          Icon = FiAlertTriangle;
          bgClass = 'toast-warning';
        }

        return (
          <div key={toast.id} className={`custom-toast-message ${bgClass}`}>
            <div className="toast-icon-wrapper">
              <Icon size={20} />
            </div>
            <div className="toast-body-text">{toast.message}</div>
            <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
              <FiX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
