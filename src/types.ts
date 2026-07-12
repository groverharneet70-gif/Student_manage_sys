export interface Student {
  id: string;
  name: string; // Full Name
  rollNumber: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string; // Date of Birth
  course: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  address: string;
  profileImage: string; // Profile Image URL
  status: 'Active' | 'Inactive';
  enrollmentDate: string;
}

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

export interface ActivityType {
  id: string;
  description: string;
  timestamp: string;
  type: 'add' | 'update' | 'delete';
}

export interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;
  addStudent: (student: Omit<Student, 'id' | 'enrollmentDate'>) => Promise<boolean>;
  updateStudent: (id: string, updatedData: Omit<Student, 'id' | 'enrollmentDate'>) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  getStudentById: (id: string) => Student | undefined;
  toasts: ToastType[];
  addToast: (message: string, type: 'success' | 'danger' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  activities: ActivityType[];
  logActivity: (description: string, type: 'add' | 'update' | 'delete') => void;
}
