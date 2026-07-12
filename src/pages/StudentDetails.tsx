import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { Card } from '../components/Card';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiUser, 
  FiMapPin, 
  FiFileText,
  FiInfo
} from 'react-icons/fi';

export const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getStudentById, deleteStudent } = useStudents();
  const navigate = useNavigate();

  const student = id ? getStudentById(id) : undefined;

  if (!student) {
    return (
      <div className="student-details-page container py-4 text-center">
        <Card className="p-5 max-width-600 mx-auto border border-danger">
          <FiInfo size={48} className="text-danger mb-3" />
          <h2 className="mb-3">Student File Not Found</h2>
          <p className="text-secondary mb-4">
            The student record you are attempting to view does not exist or has been removed from the registry.
          </p>
          <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => navigate('/students')}>
            <FiArrowLeft size={16} /> Return to Directory
          </button>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete student file: ${student.name}?`)) {
      const success = await deleteStudent(student.id);
      if (success) {
        navigate('/students');
      }
    }
  };

  const initials = student.name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="student-details-page container py-4">
      {/* Page Header */}
      <div className="page-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-secondary btn-icon" onClick={() => navigate('/students')} title="Back to Directory">
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1>Student Profile</h1>
            <p className="text-secondary mt-1">
              Registered academic profile file record for {student.name}
            </p>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button className="btn btn-secondary d-flex align-items-center gap-2" onClick={() => navigate(`/edit-student/${student.id}`)}>
            <FiEdit2 size={16} />
            <span>Edit Profile</span>
          </button>
          <button className="btn btn-danger d-flex align-items-center gap-2 text-white" onClick={handleDelete}>
            <FiTrash2 size={16} />
            <span>Delete File</span>
          </button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="row g-4">
        {/* Left Column: Core Identity Card */}
        <div className="col-lg-4">
          <Card className="profile-hero-card p-4 text-center d-flex flex-column align-items-center justify-content-center h-100">
            <div className="profile-avatar-large mb-3 position-relative">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={student.name} 
                  className="rounded-circle border border-5 border-primary-subtle" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563EB&color=fff&size=150`;
                  }}
                />
              ) : (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold border border-5 border-primary-subtle mx-auto"
                  style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                >
                  {initials}
                </div>
              )}
            </div>

            <h2 className="fw-bold mb-1">{student.name}</h2>
            <span className="font-monospace text-secondary mb-3" style={{ fontSize: '0.9rem' }}>{student.rollNumber}</span>
            
            <div className="d-flex gap-2 justify-content-center mb-3">
              <span className="badge bg-primary px-3 py-2">{student.year}</span>
              <span className={`badge px-3 py-2 ${student.status === 'Active' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                {student.status}
              </span>
            </div>

            <p className="text-secondary small mt-2 mb-0">
              Department: <strong>{student.course}</strong>
            </p>
          </Card>
        </div>

        {/* Right Column: Personal & Registry Attributes */}
        <div className="col-lg-8">
          <Card className="profile-details-panel p-4 h-100">
            <h3 className="fs-5 border-bottom border-light-subtle pb-3 mb-4 d-flex align-items-center gap-2">
              <FiFileText className="text-primary" /> Registry Information
            </h3>

            <div className="row g-4">
              {/* Full Name */}
              <div className="col-md-6 d-flex align-items-start gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary mt-1">
                  <FiUser size={18} />
                </div>
                <div>
                  <span className="text-secondary small d-block">Full Name</span>
                  <span className="fw-semibold text-primary">{student.name}</span>
                </div>
              </div>

              {/* Email Address */}
              <div className="col-md-6 d-flex align-items-start gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary mt-1">
                  <FiMail size={18} />
                </div>
                <div>
                  <span className="text-secondary small d-block">Email Address</span>
                  <a href={`mailto:${student.email}`} className="fw-semibold text-primary text-decoration-none">{student.email}</a>
                </div>
              </div>

              {/* Contact Number */}
              <div className="col-md-6 d-flex align-items-start gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary mt-1">
                  <FiPhone size={18} />
                </div>
                <div>
                  <span className="text-secondary small d-block">Contact Number</span>
                  <span className="fw-semibold text-primary">{student.phone}</span>
                </div>
              </div>

              {/* Gender */}
              <div className="col-md-6 d-flex align-items-start gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary mt-1">
                  <FiUser size={18} />
                </div>
                <div>
                  <span className="text-secondary small d-block">Gender</span>
                  <span className="fw-semibold text-primary">{student.gender}</span>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="col-md-6 d-flex align-items-start gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary mt-1">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <span className="text-secondary small d-block">Date of Birth</span>
                  <span className="fw-semibold text-primary">{student.dob}</span>
                </div>
              </div>

              {/* Enrollment Date */}
              <div className="col-md-6 d-flex align-items-start gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary mt-1">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <span className="text-secondary small d-block">Enrollment Date</span>
                  <span className="fw-semibold text-primary">{student.enrollmentDate}</span>
                </div>
              </div>

              {/* Residential Address */}
              <div className="col-12 d-flex align-items-start gap-3 border-top border-light-subtle pt-3 mt-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded text-primary mt-1">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <span className="text-secondary small d-block">Residential Address</span>
                  <span className="fw-semibold text-primary" style={{ lineHeight: '1.6' }}>{student.address}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
