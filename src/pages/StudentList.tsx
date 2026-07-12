import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { Card } from '../components/Card';
import { 
  FiSearch, 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiFilter, 
  FiPlus, 
  FiList, 
  FiGrid, 
  FiDownload, 
  FiChevronLeft, 
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiCalendar,
  FiBookOpen,
  FiMapPin
} from 'react-icons/fi';

export const StudentList: React.FC = () => {
  const { students, deleteStudent, loading, error, addToast } = useStudents();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Sorting State
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'course'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Layout State
  const [viewLayout, setViewLayout] = useState<'table' | 'card'>(() => {
    return (localStorage.getItem('sms_view_layout') as 'table' | 'card') || 'table';
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Sync Layout selection
  useEffect(() => {
    localStorage.setItem('sms_view_layout', viewLayout);
  }, [viewLayout]);

  // Click outside search suggestions handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset pagination on filter search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCourse, selectedStatus]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary">Retrieving student records...</p>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="container py-5">
        <Card className="text-center p-5 border border-danger">
          <h2 className="text-danger mb-3">Database Connection Error</h2>
          <p className="text-secondary mb-4">
            Could not fetch students data from the API server. Please ensure that JSON Server is running on port 5000.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </Card>
      </div>
    );
  }

  // Calculate age helper
  const getAge = (dobString: string) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get courses dynamically
  const coursesList = ['All', ...new Set(students.map(s => s.course).filter(Boolean))];

  // Search Suggestions filtered from total list
  const suggestions = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    searchTerm.trim().length > 0
  ).slice(0, 5);

  // Filter logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCourse = selectedCourse === 'All' || student.course === selectedCourse;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Sorting logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'age') {
      comparison = getAge(a.dob) - getAge(b.dob);
    } else if (sortBy === 'course') {
      comparison = a.course.localeCompare(b.course);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Sorting handler
  const handleSort = (field: 'name' | 'age' | 'course') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete student file: ${name}?`)) {
      deleteStudent(id);
    }
  };

  // Export to CSV helper
  const exportToCSV = () => {
    if (sortedStudents.length === 0) {
      addToast('No student files to export.', 'warning');
      return;
    }
    
    const headers = ['Full Name', 'Roll Number', 'Email', 'Phone', 'Gender', 'Date of Birth', 'Course', 'Year', 'Address', 'Status', 'Enrollment Date'];
    const rows = sortedStudents.map(s => [
      `"${s.name.replace(/"/g, '""')}"`,
      s.rollNumber,
      s.email,
      s.phone,
      s.gender,
      s.dob,
      `"${s.course.replace(/"/g, '""')}"`,
      s.year,
      `"${s.address.replace(/"/g, '""')}"`,
      s.status,
      s.enrollmentDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_list_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Filtered student registry exported to CSV.', 'success');
  };

  return (
    <div className="student-list-page">
      <div className="page-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h1>Student Directory</h1>
          <p className="text-secondary mt-1">
            Browse, search, sort, filter, and manage academic profiles.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-secondary d-flex align-items-center gap-2" onClick={exportToCSV} disabled={sortedStudents.length === 0}>
            <FiDownload size={18} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => navigate('/add-student')}>
            <FiPlus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <Card className="filter-panel mb-4 p-3">
        <div className="row g-3 align-items-center">
          {/* Search Box with suggestions */}
          <div className="col-lg-5 col-md-6" ref={suggestionsRef}>
            <div className="search-suggest-wrapper position-relative">
              <div className="search-box-container d-flex align-items-center bg-primary bg-opacity-10 border border-light-subtle rounded px-3 py-1">
                <FiSearch className="text-secondary me-2" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, roll, or email..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="form-control border-0 bg-transparent py-2 shadow-none"
                  style={{ outline: 'none' }}
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions-dropdown">
                  {suggestions.map(student => (
                    <div 
                      key={student.id} 
                      className="suggestion-item"
                      onClick={() => {
                        setSearchTerm(student.name);
                        setShowSuggestions(false);
                      }}
                    >
                      {student.profileImage ? (
                        <img src={student.profileImage} alt={student.name} className="suggestion-avatar" onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }} />
                      ) : null}
                      <div className="suggestion-avatar">
                        {student.name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2)}
                      </div>
                      <div className="suggestion-info">
                        <span className="suggestion-name">{student.name}</span>
                        <span className="suggestion-roll">{student.rollNumber} • {student.course}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Department/Course Filter */}
          <div className="col-lg-3 col-md-3">
            <div className="d-flex align-items-center bg-primary bg-opacity-10 border border-light-subtle rounded px-3 py-1">
              <FiFilter className="text-secondary me-2" size={16} />
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="form-select border-0 bg-transparent py-2 shadow-none"
              >
                <option value="All">All Departments</option>
                {coursesList.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-lg-2 col-md-3">
            <div className="d-flex align-items-center bg-primary bg-opacity-10 border border-light-subtle rounded px-3 py-1">
              <FiFilter className="text-secondary me-2" size={16} />
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-select border-0 bg-transparent py-2 shadow-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Layout Toggle Buttons */}
          <div className="col-lg-2 col-md-12 d-flex justify-content-lg-end gap-2">
            <button 
              className={`layout-toggle-btn ${viewLayout === 'table' ? 'active' : ''}`}
              onClick={() => setViewLayout('table')}
              title="Table View"
            >
              <FiList size={18} />
            </button>
            <button 
              className={`layout-toggle-btn ${viewLayout === 'card' ? 'active' : ''}`}
              onClick={() => setViewLayout('card')}
              title="Grid Cards View"
            >
              <FiGrid size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* Sorting Indicators Bar */}
      <div className="d-flex align-items-center gap-3 px-3 py-2 mb-3 bg-secondary rounded border border-light-subtle small fw-medium text-secondary">
        <span>Sort By:</span>
        <button 
          onClick={() => handleSort('name')} 
          className={`btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1 small ${sortBy === 'name' ? 'text-primary fw-bold' : 'text-secondary'}`}
        >
          Name {sortBy === 'name' && (sortOrder === 'asc' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />)}
        </button>
        <button 
          onClick={() => handleSort('age')} 
          className={`btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1 small ${sortBy === 'age' ? 'text-primary fw-bold' : 'text-secondary'}`}
        >
          Age/DOB {sortBy === 'age' && (sortOrder === 'asc' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />)}
        </button>
        <button 
          onClick={() => handleSort('course')} 
          className={`btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1 small ${sortBy === 'course' ? 'text-primary fw-bold' : 'text-secondary'}`}
        >
          Course {sortBy === 'course' && (sortOrder === 'asc' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />)}
        </button>
      </div>

      {/* Registry Rendering */}
      {currentStudents.length > 0 ? (
        viewLayout === 'table' ? (
          /* TABLE VIEW */
          <Card className="p-0 overflow-hidden border border-light-subtle">
            <div className="table-container">
              <table className="custom-table w-100">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Roll Number</th>
                    <th>Course/Dept</th>
                    <th>Age</th>
                    <th>Year Level</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => {
                    const initials = student.name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
                    return (
                      <tr key={student.id}>
                        {/* Student Details */}
                        <td>
                          <div className="student-profile-cell d-flex align-items-center gap-3">
                            {student.profileImage ? (
                              <img 
                                src={student.profileImage} 
                                alt={student.name} 
                                className="student-avatar-small" 
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563EB&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="student-avatar-small d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold" style={{ width: '40px', height: '40px', borderRadius: '50%' }}>
                                {initials}
                              </div>
                            )}
                            <div className="student-info-text d-flex flex-column text-start">
                              <span className="student-name-text fw-semibold text-primary">{student.name}</span>
                              <span className="student-email-text small text-secondary">{student.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Roll Number */}
                        <td>
                          <span className="font-monospace text-secondary" style={{ fontSize: '0.85rem' }}>{student.rollNumber}</span>
                        </td>

                        {/* Course */}
                        <td>
                          <span className="fw-medium">{student.course}</span>
                        </td>

                        {/* Age */}
                        <td>
                          <span>{getAge(student.dob)} Yrs</span>
                        </td>

                        {/* Year */}
                        <td>
                          <span className="badge bg-secondary">{student.year}</span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${student.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success-subtle' : 'bg-danger bg-opacity-10 text-danger border border-danger-subtle'}`}>
                            {student.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="actions-cell d-flex justify-content-end gap-2">
                            <button 
                              className="btn-icon" 
                              onClick={() => navigate(`/student/${student.id}`)}
                              title="View Profile"
                            >
                              <FiEye size={16} />
                            </button>
                            <button 
                              className="btn-icon" 
                              onClick={() => navigate(`/edit-student/${student.id}`)}
                              title="Edit Student"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button 
                              className="btn-icon hover-danger" 
                              onClick={() => handleDelete(student.id, student.name)}
                              title="Delete Record"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* CARD GRID VIEW */
          <div className="student-cards-grid">
            {currentStudents.map((student) => {
              const initials = student.name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
              return (
                <div key={student.id} className="student-card-item">
                  {/* Status Badge */}
                  <span className={`student-card-badge badge ${student.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                    {student.status}
                  </span>

                  {/* Profile Photo */}
                  {student.profileImage ? (
                    <img 
                      src={student.profileImage} 
                      alt={student.name} 
                      className="student-card-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=2563EB&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="student-card-avatar d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary fw-bold fs-4 mx-auto mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%' }}>
                      {initials}
                    </div>
                  )}

                  {/* Name and Roll */}
                  <h4 className="student-card-name">{student.name}</h4>
                  <span className="student-card-roll">{student.rollNumber}</span>

                  {/* Attributes */}
                  <div className="student-card-details mt-3">
                    <div className="student-card-detail-item">
                      <span className="small text-secondary"><FiBookOpen size={12} className="me-1" /> Course:</span>
                      <span className="small fw-semibold">{student.course}</span>
                    </div>
                    <div className="student-card-detail-item">
                      <span className="small text-secondary"><FiCalendar size={12} className="me-1" /> Year:</span>
                      <span className="small fw-semibold">{student.year}</span>
                    </div>
                    <div className="student-card-detail-item">
                      <span className="small text-secondary"><FiUsers size={12} className="me-1" /> Age:</span>
                      <span className="small fw-semibold">{getAge(student.dob)} Yrs</span>
                    </div>
                    <div className="student-card-detail-item">
                      <span className="small text-secondary"><FiMapPin size={12} className="me-1" /> Location:</span>
                      <span className="small text-truncate" style={{ maxWidth: '140px' }} title={student.address}>{student.address}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="student-card-actions">
                    <button 
                      className="btn btn-secondary py-1 px-2 d-flex align-items-center gap-1 small"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      <FiEye size={14} /> Profile
                    </button>
                    <button 
                      className="btn btn-secondary py-1 px-2 d-flex align-items-center gap-1 small"
                      onClick={() => navigate(`/edit-student/${student.id}`)}
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button 
                      className="btn btn-danger py-1 px-2 d-flex align-items-center gap-1 small text-white"
                      onClick={() => handleDelete(student.id, student.name)}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* EMPTY STATE ILLUSTRATION */
        <Card className="text-center p-5 border border-light-subtle">
          <FiUsers className="text-secondary opacity-50 mb-3 mx-auto" size={64} />
          <h3>No Student Records Found</h3>
          <p className="text-secondary max-width-400 mx-auto mt-2">
            No registry profiles matched your active keyword search or department filters. Enroll a new student profile or modify existing selections to expand catalog listings.
          </p>
          <button className="btn btn-primary d-inline-flex align-items-center gap-2 mt-4" onClick={() => {
            setSearchTerm('');
            setSelectedCourse('All');
            setSelectedStatus('All');
          }}>
            Clear Search Filter
          </button>
        </Card>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4 px-2">
          <span className="small text-secondary">
            Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, sortedStudents.length)}</strong> of <strong>{sortedStudents.length}</strong> student files
          </span>
          <nav aria-label="Registry pagination">
            <ul className="pagination mb-0 gap-1">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="btn btn-secondary py-1 px-2" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  <FiChevronLeft size={16} />
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button 
                    className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'} py-1 px-3`} 
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="btn btn-secondary py-1 px-2" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  <FiChevronRight size={16} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
