import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import PYQRepository from './pages/PYQRepository';
import PYQAnalytics from './pages/PYQAnalytics';
import NotesRepository from './pages/NotesRepository';
import VivaPrep from './pages/VivaPrep';
import StudyPlanner from './pages/StudyPlanner';
import ScholarshipHub from './pages/ScholarshipHub';
import NoticeTracker from './pages/NoticeTracker';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/pyqs" element={<PYQRepository />} />
              <Route path="/pyq-analytics" element={<PYQAnalytics />} />
              <Route path="/notes" element={<NotesRepository />} />
              <Route path="/viva" element={<VivaPrep />} />
              <Route path="/planner" element={<StudyPlanner />} />
              <Route path="/scholarships" element={<ScholarshipHub />} />
              <Route path="/notices" element={<NoticeTracker />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
