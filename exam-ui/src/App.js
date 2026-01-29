import React, { useEffect, useState } from 'react';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeacherResults from './components/TeacherResults'; 
import AdminDashboard from './components/AdminDashboard'; 
import ExamSession from './components/ExamSession'; 

// Helper to protect routes based on the Access Control Matrix
const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/" />;
  if (role !== allowedRole) return <Navigate to="/" />;
  return children;
};

// SUB-COMPONENT: Navigation logic that reacts to route changes
const Navigation = ({ handleLogout }) => {
  const location = useLocation();
  const [session, setSession] = useState({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
  });

  // Automatically syncs the navbar when navigating between screens
  useEffect(() => {
    setSession({
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role')
    });

    // Fix: Clears old data when landing on Login/Register
    if (location.pathname === '/' || location.pathname === '/register') {
      localStorage.clear(); 
    }
  }, [location]);

  return (
    <nav style={{ 
      padding: '15px 30px', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
    }}>
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          🛡️ SecurePortal
        </Link>
        
        {!session.token && (
          <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '500' }}>
            New User? Register
          </Link>
        )}

        {session.token && (
          <>
            {session.role === 'Admin' && <Link to="/admin-dashboard" style={{ color: '#38bdf8', textDecoration: 'none' }}>Admin Panel</Link>}
            {session.role === 'Teacher' && (
              <>
                <Link to="/teacher-dashboard" style={{ color: '#38bdf8', textDecoration: 'none' }}>Create Exam</Link>
                <Link to="/teacher-results" style={{ color: '#38bdf8', textDecoration: 'none' }}>View Results</Link>
              </>
            )}
            {session.role === 'Student' && <Link to="/student-dashboard" style={{ color: '#38bdf8', textDecoration: 'none' }}>Student Portal</Link>}
          </>
        )}
      </div>

      {session.token && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Authenticated Subject</span>
            <strong style={{ color: 'white', fontSize: '1rem' }}>
              {session.username} <span style={{ color: '#38bdf8', fontWeight: '400' }}>({session.role})</span>
            </strong>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

function App() {
  const handleLogout = () => {
    localStorage.clear(); // Revokes Subject identity
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="App">
        <Navigation handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRole="Teacher"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute allowedRole="Student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/teacher-results" element={<ProtectedRoute allowedRole="Teacher"><TeacherResults /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/take-exam/:examId" element={<ProtectedRoute allowedRole="Student"><ExamSession /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;