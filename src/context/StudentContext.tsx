import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, StudentContextType, ToastType, ActivityType } from '../types';

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/students';

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sms_dark_mode') === 'true';
  });

  const [activities, setActivities] = useState<ActivityType[]>(() => {
    try {
      const stored = localStorage.getItem('sms_activities');
      return stored ? JSON.parse(stored) : [
        {
          id: 'act-1',
          description: 'Database initialized with demo records.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleString(),
          type: 'info'
        }
      ];
    } catch {
      return [];
    }
  });

  // Log activity helper
  const logActivity = (description: string, type: 'add' | 'update' | 'delete') => {
    const newActivity: ActivityType = {
      id: Math.random().toString(36).substring(2, 9),
      description,
      timestamp: new Date().toLocaleString(),
      type
    };
    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 10);
      localStorage.setItem('sms_activities', JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch students from JSON Server
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch student data from API');
      }
      const data = await response.json();
      setStudents(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connecting to database server failed.');
      addToast('Error connecting to API. Please ensure the database server is running.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Sync Dark Mode state to document body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('sms_dark_mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Toast Management
  const addToast = (message: string, type: 'success' | 'danger' | 'warning' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastType = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Add Student
  const addStudent = async (studentData: Omit<Student, 'id' | 'enrollmentDate'>): Promise<boolean> => {
    try {
      // Check roll number uniqueness
      const exists = students.some(s => s.rollNumber.toLowerCase() === studentData.rollNumber.toLowerCase());
      if (exists) {
        addToast(`Roll number "${studentData.rollNumber}" already exists.`, 'danger');
        return false;
      }

      const newStudent = {
        ...studentData,
        enrollmentDate: new Date().toISOString().split('T')[0]
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });

      if (!response.ok) {
        throw new Error('Failed to create student record.');
      }

      const created: Student = await response.json();
      setStudents(prev => [created, ...prev]);
      addToast(`Student "${created.name}" enrolled successfully!`, 'success');
      logActivity(`Enrolled student "${created.name}" (Roll No: ${created.rollNumber})`, 'add');
      return true;
    } catch (err: any) {
      addToast(err.message || 'Error adding student record.', 'danger');
      return false;
    }
  };

  // Update Student
  const updateStudent = async (id: string, updatedData: Omit<Student, 'id' | 'enrollmentDate'>): Promise<boolean> => {
    try {
      // Check roll number uniqueness against OTHER students
      const exists = students.some(s => s.id !== id && s.rollNumber.toLowerCase() === updatedData.rollNumber.toLowerCase());
      if (exists) {
        addToast(`Roll number "${updatedData.rollNumber}" is already used by another student.`, 'danger');
        return false;
      }

      // Find original enrollmentDate to keep it
      const original = students.find(s => s.id === id);
      const enrollmentDate = original ? original.enrollmentDate : new Date().toISOString().split('T')[0];

      const fullPayload: Student = {
        ...updatedData,
        id,
        enrollmentDate
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to update student record.');
      }

      const updated: Student = await response.json();
      setStudents(prev => prev.map(s => s.id === id ? updated : s));
      addToast(`Student "${updated.name}" updated successfully!`, 'success');
      logActivity(`Updated student details for "${updated.name}"`, 'update');
      return true;
    } catch (err: any) {
      addToast(err.message || 'Error updating student record.', 'danger');
      return false;
    }
  };

  // Delete Student
  const deleteStudent = async (id: string): Promise<boolean> => {
    const studentToDelete = students.find(s => s.id === id);
    const studentName = studentToDelete ? studentToDelete.name : 'Student';
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete student record.');
      }

      setStudents(prev => prev.filter(s => s.id !== id));
      addToast(`Student "${studentName}" deleted successfully!`, 'warning');
      logActivity(`Removed student "${studentName}" record`, 'delete');
      return true;
    } catch (err: any) {
      addToast(err.message || 'Error deleting student record.', 'danger');
      return false;
    }
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.id === id);
  };

  return (
    <StudentContext.Provider value={{
      students,
      loading,
      error,
      addStudent,
      updateStudent,
      deleteStudent,
      getStudentById,
      toasts,
      addToast,
      removeToast,
      darkMode,
      toggleDarkMode,
      activities,
      logActivity
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
