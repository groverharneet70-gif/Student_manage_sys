import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { Card } from '../components/Card';
import { FiArrowLeft, FiSave, FiStar, FiAlertCircle } from 'react-icons/fi';
import type { Student } from '../types';

export const StudentForm: React.FC = () => {
  const { addStudent, updateStudent, getStudentById, students } = useStudents();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    gender: 'Male' as Student['gender'],
    dob: '',
    course: '',
    year: '1st Year' as Student['year'],
    address: '',
    profileImage: '',
    status: 'Active' as Student['status']
  });

  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing student data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const student = getStudentById(id);
      if (student) {
        setFormData({
          name: student.name,
          rollNumber: student.rollNumber,
          email: student.email,
          phone: student.phone,
          gender: student.gender,
          dob: student.dob,
          course: student.course,
          year: student.year,
          address: student.address,
          profileImage: student.profileImage || '',
          status: student.status
        });
      } else {
        navigate('/students');
      }
    }
  }, [isEditMode, id, getStudentById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user begins typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name check
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full Name must be at least 2 characters';
    }

    // Roll Number check
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll Number is required';
    } else {
      const rollRegex = /^SMS-\d{4}-\d{3}$/i;
      const formatExample = 'SMS-2025-001';
      if (!rollRegex.test(formData.rollNumber.trim())) {
        newErrors.rollNumber = `Roll Number format must match "${formatExample}"`;
      } else {
        // Uniqueness check
        const isDuplicate = students.some(s =>
          s.rollNumber.toLowerCase() === formData.rollNumber.trim().toLowerCase() &&
          (!isEditMode || s.id !== id)
        );
        if (isDuplicate) {
          newErrors.rollNumber = 'This Roll Number is already assigned to another student';
        }
      }
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address format';
    }

    // Phone check
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Basic format check
      const phoneClean = formData.phone.replace(/[-+\s()]/g, '');
      if (isNaN(Number(phoneClean)) || phoneClean.length < 7 || phoneClean.length > 15) {
        newErrors.phone = 'Please enter a valid telephone number (7 to 15 digits)';
      }
    }

    // Date of Birth check
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dob = 'Date of Birth cannot be a future date';
      }
    }

    // Course check
    if (!formData.course.trim()) {
      newErrors.course = 'Enrolled course department is required';
    }

    // Address check
    if (!formData.address.trim()) {
      newErrors.address = 'Residential address is required';
    }

    // Profile Image URL check
    if (formData.profileImage.trim()) {
      try {
        new URL(formData.profileImage.trim());
      } catch (_) {
        newErrors.profileImage = 'Please enter a valid URL or leave blank for default avatar';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      dob: formData.dob,
      course: formData.course.trim(),
      year: formData.year,
      address: formData.address.trim(),
      profileImage: formData.profileImage.trim(),
      status: formData.status
    };

    let success = false;
    if (isEditMode && id) {
      success = await updateStudent(id, payload);
    } else {
      success = await addStudent(payload);
    }

    setIsSubmitting(false);

    if (success) {
      navigate(isEditMode && id ? `/student/${id}` : '/students');
    }
  };

  return (
    <div className="student-form-page">
      <div className="page-header mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-secondary btn-icon" onClick={() => navigate(-1)} title="Go Back">
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1>{isEditMode ? 'Modify Student Profile' : 'New Enrollment Form'}</h1>
            <p className="text-secondary mt-1">
              {isEditMode ? 'Make adjustments to the selected student profile record.' : 'Add a new student profile to the academic directory.'}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Form Controls */}
        <div className="col-lg-8">
          <Card className="form-card p-4">
            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-header-accent d-flex align-items-center gap-2 mb-4 border-bottom border-light-subtle pb-3">
                <FiStar className="text-primary" size={20} />
                <h3 className="mb-0 fs-5">Personal & Academic Details</h3>
              </div>

              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6 form-group">
                  <label className="form-label">Full Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sara khan"
                    className={`form-control ${errors.name ? 'border border-danger' : ''}`}
                  />
                  {errors.name && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.name}</span>}
                </div>

                {/* Roll Number */}
                <div className="col-md-6 form-group">
                  <label className="form-label">Roll Number (Format: SMS-YYYY-XXX) <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. SMS-2026-042"
                    className={`form-control ${errors.rollNumber ? 'border border-danger' : ''}`}
                    disabled={isEditMode} // Usually Roll Numbers aren't editable
                  />
                  {errors.rollNumber && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.rollNumber}</span>}
                </div>

                {/* Email Address */}
                <div className="col-md-6 form-group">
                  <label className="form-label">Email Address <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. Abcd@gmail.com"
                    className={`form-control ${errors.email ? 'border border-danger' : ''}`}
                  />
                  {errors.email && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.email}</span>}
                </div>

                {/* Phone Number */}
                <div className="col-md-6 form-group">
                  <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 98XXXXXXXX"
                    className={`form-control ${errors.phone ? 'border border-danger' : ''}`}
                  />
                  {errors.phone && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.phone}</span>}
                </div>

                {/* Gender select */}
                <div className="col-md-4 form-group">
                  <label className="form-label">Gender <span className="text-danger">*</span></label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-select form-control"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="col-md-4 form-group">
                  <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`form-control ${errors.dob ? 'border border-danger' : ''}`}
                  />
                  {errors.dob && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.dob}</span>}
                </div>

                {/* Status selection */}
                <div className="col-md-4 form-group">
                  <label className="form-label">Status <span className="text-danger">*</span></label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select form-control"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Course Enrolled */}
                <div className="col-md-6 form-group">
                  <label className="form-label">Course / Major <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className={`form-control ${errors.course ? 'border border-danger' : ''}`}
                  />
                  {errors.course && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.course}</span>}
                </div>

                {/* Academic Year select */}
                <div className="col-md-6 form-group">
                  <label className="form-label">Academic Year <span className="text-danger">*</span></label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-select form-control"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                  </select>
                </div>

                {/* Profile Image URL */}
                <div className="col-12 form-group">
                  <label className="form-label">Profile Image URL</label>
                  <input
                    type="text"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="e.g. https://images.facebook.com/... or leave blank"
                    className={`form-control ${errors.profileImage ? 'border border-danger' : ''}`}
                  />
                  {errors.profileImage && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.profileImage}</span>}
                  <span className="text-muted small mt-1 d-block" style={{ fontSize: '0.75rem' }}>Provide an Unsplash or static image URL. Fallback initials are used if left blank.</span>
                </div>

                {/* Residential Address */}
                <div className="col-12 form-group">
                  <label className="form-label">Residential Address <span className="text-danger">*</span></label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 56, Model town, Ludhiana, Punjab, 141002"
                    rows={3}
                    className={`form-control ${errors.address ? 'border border-danger' : ''}`}
                  />
                  {errors.address && <span className="text-danger small d-flex align-items-center gap-1 mt-1"><FiAlertCircle /> {errors.address}</span>}
                </div>
              </div>

              <div className="form-actions-footer d-flex justify-content-end gap-2 border-top border-light-subtle pt-3 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={isSubmitting}>
                  <FiSave size={18} />
                  <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Profile' : 'Enroll Student'}</span>
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Side: Profile Photo Preview Card */}
        <div className="col-lg-4">
          <Card className="p-4 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
            <h4 className="mb-3 w-100 border-bottom border-light-subtle pb-2 text-start fs-5 text-secondary">Photo Preview</h4>

            <div className="preview-avatar-container mb-3 position-relative">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Avatar Preview"
                  className="rounded-circle border border-5 border-primary-subtle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  onError={(e) => {
                    // Fail preview gracefully
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Preview&size=150&background=e5e7eb&color=4b5563';
                  }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold border border-5 border-primary-subtle"
                  style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                >
                  {formData.name ? formData.name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2) : 'ST'}
                </div>
              )}
            </div>

            <h5 className="fw-bold mb-1">{formData.name || 'Student Name'}</h5>
            <span className="badge bg-secondary mb-2">{formData.year}</span>
            <p className="text-muted small mb-0">{formData.course || 'Select Department'}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
