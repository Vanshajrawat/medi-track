import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateCamp from './pages/CreateCamp';
import CampDetail from './pages/CampDetail';
import RegisterPatient from './pages/RegisterPatient';
import CampReport from './pages/CampReport';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Camp Routes */}
            <Route path="/camp/:id" element={<CampDetail />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/create-camp"
              element={
                <PrivateRoute requiredRoles={['admin']}>
                  <CreateCamp />
                </PrivateRoute>
              }
            />

            <Route
              path="/register-patient/:campId"
              element={
                <PrivateRoute requiredRoles={['doctor', 'admin']}>
                  <RegisterPatient />
                </PrivateRoute>
              }
            />

            <Route
              path="/camp/:campId/report"
              element={
                <PrivateRoute requiredRoles={['admin', 'doctor']}>
                  <CampReport />
                </PrivateRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
