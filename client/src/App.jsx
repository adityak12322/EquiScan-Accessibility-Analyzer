import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import ReportPage from './pages/ReportPage'; // New Import
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen'; // ✅ NEW IMPORT
import ResetPasswordScreen from './pages/ResetPasswordScreen';
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* ✅ NEW: Forgot Password Routes (Public) */}
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
        {/* Protected Routes - Report Page aur Dashboard dono yahan aayenge */}
        <Route element={<ProtectedRoute />}>
            {/* Default Index Route */}
            <Route index element={<DashboardPage />} /> 
            
            {/* Specific Protected Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report/:id" element={<ReportPage />} /> {/* New Report Route */}
        </Route>
        
        {/* Fallback route (404 Page) */}
        <Route path="*" element={<LoginPage />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;