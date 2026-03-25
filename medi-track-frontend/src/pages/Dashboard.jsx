import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import CampCard from '../components/CampCard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/camps', {
        params: { limit: 6 },
      });
      setCamps(response.data.data.docs || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'patient':
        return 'Patient Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{getWelcomeMessage()}</h1>
          <p className="text-lg opacity-90">
            Hello, <strong>{user?.name}</strong>!
          </p>
        </div>
      </div>

      {/* Admin Panel */}
      {user?.role === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/create-camp')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
              >
                ➕ Create New Camp
              </button>
              <button
                onClick={() => navigate('/camps')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                📋 View All Camps
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
              >
                📊 View Reports
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Panel */}
      {user?.role === 'doctor' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Controls</h2>
            <p className="text-gray-600 mb-4">
              View camps assigned to you and manage patient records.
            </p>
            <button
              onClick={() => navigate('/my-camps')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              📋 View My Camps
            </button>
          </div>
        </div>
      )}

      {/* Patient Panel */}
      {user?.role === 'patient' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Camps</h2>
            <p className="text-gray-600 mb-4">
              View camps you've registered for.
            </p>
          </div>
        </div>
      )}

      {/* Available Camps */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Camps</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading camps...</p>
          </div>
        ) : camps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No camps available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map((camp) => (
              <CampCard key={camp._id} camp={camp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
