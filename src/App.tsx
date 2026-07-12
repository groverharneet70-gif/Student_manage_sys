import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { Navbar } from './components/Navbar';
import { TopNavbar } from './components/TopNavbar';
import { ToastContainer } from './components/Toast';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StudentList } from './pages/StudentList';
import { StudentForm } from './pages/StudentForm';
import { StudentDetails } from './pages/StudentDetails';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

const AppContent: React.FC = () => {
  return (
    <div className="app-container">
      {/* Left Sidebar Menu */}
      <Navbar />

      {/* Main Panel Content Area */}
      <main className="main-content d-flex flex-column">
        {/* Header toolbar */}
        <TopNavbar />

        {/* Dynamic Route views */}
        <div className="flex-grow-1">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected dashboard/registry routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            } />
            <Route path="/add-student" element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            } />
            <Route path="/edit-student/:id" element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            } />
            <Route path="/student/:id" element={
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Toast Notification Container */}
        <ToastContainer />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StudentProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </StudentProvider>
    </AuthProvider>
  );
};

export default App;
