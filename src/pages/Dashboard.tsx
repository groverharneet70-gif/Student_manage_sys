import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext';
import { Card } from '../components/Card';
import { 
  FiUsers, 
  FiBookOpen, 
  FiUserCheck, 
  FiCalendar, 
  FiActivity, 
  FiLayers, 
  FiPieChart,
  FiUserPlus,
  FiFileText,
  FiArrowRight,
  FiInfo,
  FiGrid
} from 'react-icons/fi';

export const Dashboard: React.FC = () => {
  const { students, activities, loading, error } = useStudents();
  const navigate = useNavigate();

  // Loading/Error states handled in parent or page level
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary">Loading dashboard metrics...</p>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="container py-5">
        <Card className="text-center p-5 border border-danger">
          <h2 className="text-danger mb-3">Database Connection Failed</h2>
          <p className="text-secondary mb-4">
            Could not fetch students data from the API server. Please ensure that JSON Server is running.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              Retry Connection
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const totalStudents = students.length;
  
  // Unique courses
  const uniqueCourses = [...new Set(students.map(s => s.course).filter(Boolean))];
  const totalCourses = uniqueCourses.length;

  // Active students
  const activeStudentsCount = students.filter(s => s.status === 'Active').length;

  // New Admissions (registered in current or last year, e.g. 2025/2026)
  const newAdmissionsCount = students.filter(s => {
    if (!s.enrollmentDate) return false;
    const year = s.enrollmentDate.split('-')[0];
    return year === '2025' || year === '2026';
  }).length;

  // Course distribution counts
  const courseCounts: Record<string, number> = {};
  students.forEach(s => {
    if (s.course) {
      courseCounts[s.course] = (courseCounts[s.course] || 0) + 1;
    }
  });

  const sortedCourses = Object.entries(courseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Year breakdown counts
  const yearCounts: Record<string, number> = {
    '1st Year': 0,
    '2nd Year': 0,
    '3rd Year': 0,
    '4th Year': 0
  };
  students.forEach(s => {
    if (s.year && yearCounts[s.year] !== undefined) {
      yearCounts[s.year]++;
    }
  });

  // Gender breakdown counts
  const genderCounts: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
  students.forEach(s => {
    if (s.gender && genderCounts[s.gender] !== undefined) {
      genderCounts[s.gender]++;
    }
  });

  // Helper for CSV export
  const exportToCSV = () => {
    if (students.length === 0) return;
    
    const headers = ['ID', 'Full Name', 'Roll Number', 'Email', 'Phone', 'Gender', 'DOB', 'Course', 'Year', 'Address', 'Status', 'Enrollment Date'];
    const rows = students.map(s => [
      s.id,
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
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-secondary mt-1">
            Real-time insights and registry management for EduPulse Academy.
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => navigate('/add-student')}>
          <FiUserPlus size={18} />
          <span>Enroll Student</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid mb-4">
        <Card className="kpi-card violet-glow">
          <div className="kpi-content">
            <span className="kpi-label">Total Students</span>
            <span className="kpi-value">{totalStudents}</span>
            <span className="kpi-subtext">Registered in database</span>
          </div>
          <div className="kpi-icon-wrapper bg-violet">
            <FiUsers size={24} />
          </div>
        </Card>

        <Card className="kpi-card cyan-glow">
          <div className="kpi-content">
            <span className="kpi-label">Total Courses</span>
            <span className="kpi-value">{totalCourses}</span>
            <span className="kpi-subtext">Active departments</span>
          </div>
          <div className="kpi-icon-wrapper bg-cyan">
            <FiBookOpen size={24} />
          </div>
        </Card>

        <Card className="kpi-card emerald-glow">
          <div className="kpi-content">
            <span className="kpi-label">Active Students</span>
            <span className="kpi-value">{activeStudentsCount}</span>
            <span className="kpi-subtext">
              {totalStudents > 0 ? Math.round((activeStudentsCount / totalStudents) * 100) : 0}% Active Ratio
            </span>
          </div>
          <div className="kpi-icon-wrapper bg-emerald">
            <FiUserCheck size={24} />
          </div>
        </Card>

        <Card className="kpi-card amber-glow">
          <div className="kpi-content">
            <span className="kpi-label">New Admissions</span>
            <span className="kpi-value">{newAdmissionsCount}</span>
            <span className="kpi-subtext">Enrolled in 2025/2026</span>
          </div>
          <div className="kpi-icon-wrapper bg-amber">
            <FiCalendar size={24} />
          </div>
        </Card>
      </div>

      {/* Main Analytics Layout */}
      <div className="dashboard-layout">
        {/* Left Column: Metrics & Charts */}
        <div className="layout-col-main">
          {/* Charts Row */}
          <div className="grid-split mb-4">
            {/* Course Enrollment Card */}
            <Card className="dashboard-panel">
              <div className="panel-header mb-3">
                <h3 className="d-flex align-items-center gap-2">
                  <FiLayers className="text-cyan" /> Popular Courses
                </h3>
              </div>
              <div className="course-chart-container">
                {sortedCourses.length > 0 ? (
                  sortedCourses.map(([course, count]) => (
                    <div key={course} className="course-bar-row mb-3">
                      <div className="d-flex justify-content-between mb-1 small fw-semibold">
                        <span className="course-name">{course}</span>
                        <span className="course-count">{count} {count === 1 ? 'student' : 'students'}</span>
                      </div>
                      <div className="course-progress-bar" style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          className="progress-fill fill-cyan"
                          style={{ 
                            width: `${totalStudents > 0 ? (count / totalStudents) * 100 : 0}%`, 
                            height: '100%',
                            background: 'var(--accent-secondary)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease-out'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-panel-state py-4 text-center text-muted">
                    No students registered in any courses yet.
                  </div>
                )}
              </div>
            </Card>

            {/* Academic Year Enrollment Card */}
            <Card className="dashboard-panel">
              <div className="panel-header mb-3">
                <h3 className="d-flex align-items-center gap-2">
                  <FiPieChart className="text-violet" /> Academic Year Breakdown
                </h3>
              </div>
              <div className="year-chart-container">
                {totalStudents > 0 ? (
                  Object.entries(yearCounts).map(([year, count]) => (
                    <div key={year} className="course-bar-row mb-3">
                      <div className="d-flex justify-content-between mb-1 small fw-semibold">
                        <span className="course-name">{year}</span>
                        <span className="course-count">{count} {count === 1 ? 'student' : 'students'}</span>
                      </div>
                      <div className="course-progress-bar" style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          className="progress-fill fill-violet"
                          style={{ 
                            width: `${totalStudents > 0 ? (count / totalStudents) * 100 : 0}%`, 
                            height: '100%',
                            background: 'var(--accent-primary)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease-out'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-panel-state py-4 text-center text-muted">
                    No academic records.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Demographic Breakdown & Gender Stats */}
          <Card className="dashboard-panel mb-4">
            <div className="panel-header mb-3">
              <h3 className="d-flex align-items-center gap-2">
                <FiUsers className="text-primary" /> Gender Demographics
              </h3>
            </div>
            <div className="row text-center py-2">
              <div className="col-4">
                <div className="p-3 border rounded border-light-subtle bg-opacity-10 bg-primary">
                  <h4 className="fw-bold mb-1">{genderCounts.Male}</h4>
                  <span className="small text-secondary">Male Students</span>
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div className="progress-bar bg-primary" style={{ width: `${totalStudents > 0 ? (genderCounts.Male / totalStudents) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 border rounded border-light-subtle bg-opacity-10 bg-info">
                  <h4 className="fw-bold mb-1">{genderCounts.Female}</h4>
                  <span className="small text-secondary">Female Students</span>
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div className="progress-bar bg-info" style={{ width: `${totalStudents > 0 ? (genderCounts.Female / totalStudents) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 border rounded border-light-subtle bg-opacity-10 bg-secondary">
                  <h4 className="fw-bold mb-1">{genderCounts.Other}</h4>
                  <span className="small text-secondary">Other / Unspecified</span>
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div className="progress-bar bg-secondary" style={{ width: `${totalStudents > 0 ? (genderCounts.Other / totalStudents) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Actions & Recent Activity Logs */}
        <div className="layout-col-side">
          {/* Quick Actions Panel */}
          <Card className="dashboard-panel mb-4">
            <div className="panel-header mb-3">
              <h3>Quick Actions</h3>
            </div>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-secondary w-100 text-start d-flex align-items-center justify-content-between p-3" onClick={() => navigate('/students')}>
                <div className="d-flex align-items-center gap-2">
                  <FiGrid className="text-primary" />
                  <span>Student Directory</span>
                </div>
                <FiArrowRight />
              </button>

              <button className="btn btn-secondary w-100 text-start d-flex align-items-center justify-content-between p-3" onClick={exportToCSV} disabled={students.length === 0}>
                <div className="d-flex align-items-center gap-2">
                  <FiFileText className="text-success" />
                  <span>Export to CSV</span>
                </div>
                <FiArrowRight />
              </button>

              <button className="btn btn-secondary w-100 text-start d-flex align-items-center justify-content-between p-3" onClick={() => navigate('/about')}>
                <div className="d-flex align-items-center gap-2">
                  <FiInfo className="text-info" />
                  <span>About System Stack</span>
                </div>
                <FiArrowRight />
              </button>
            </div>
          </Card>

          {/* Recent Activity Log */}
          <Card className="dashboard-panel">
            <div className="panel-header mb-3 d-flex justify-content-between align-items-center">
              <h3 className="d-flex align-items-center gap-2 mb-0">
                <FiActivity className="text-danger" /> Activity Log
              </h3>
            </div>
            <div className="activity-list" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="d-flex align-items-start gap-2 border-bottom border-light-subtle pb-2 mb-2">
                    <span className={`badge mt-1 ${activity.type === 'add' ? 'bg-success' : activity.type === 'delete' ? 'bg-danger' : activity.type === 'update' ? 'bg-warning' : 'bg-info'}`} style={{ width: '8px', height: '8px', borderRadius: '50%', padding: 0 }}> </span>
                    <div style={{ fontSize: '0.85rem' }}>
                      <p className="mb-0 text-primary fw-medium">{activity.description}</p>
                      <span className="text-muted small" style={{ fontSize: '0.725rem' }}>{activity.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-4 small">
                  No recent activities recorded.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
