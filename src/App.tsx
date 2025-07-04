import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import InnovatorDashboard from './pages/InnovatorDashboard';
import PendingApprovalPage from './pages/PendingApprovalPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/pending-approval" element={<PendingApprovalPage />} />
            
            <Route 
              path="/admin/dashboard/*" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/investor/dashboard/*" 
              element={
                <ProtectedRoute role="investor">
                  <InvestorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/innovator/dashboard/*" 
              element={
                <ProtectedRoute role="innovator">
                  <InnovatorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;