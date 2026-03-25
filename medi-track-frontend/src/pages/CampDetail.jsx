import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import PatientRow from '../components/PatientRow';
import MedicineTable from '../components/MedicineTable';

export default function CampDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [camp, setCamp] = useState(null);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCampDetails();
  }, [id]);

  const fetchCampDetails = async () => {
    try {
      setLoading(true);
      const [campRes, patientsRes, medicinesRes] = await Promise.all([
        axiosInstance.get(`/camps/${id}`),
        axiosInstance.get(`/patients/camp/${id}?limit=100`),
        axiosInstance.get(`/medicines/camp/${id}`),
      ]);

      setCamp(campRes.data.data);
      setPatients(patientsRes.data.data.docs || []);
      setMedicines(medicinesRes.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch camp details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCamp = async () => {
    try {
      await axiosInstance.patch(`/camps/${id}/join`);
      alert('Successfully joined the camp!');
      fetchCampDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join camp');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading camp details...</p>
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Camp not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Back to Camps
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Camp Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {camp.title}
              </h1>
              <p className="text-gray-600">
                Organized by <strong>{camp.organizer?.name}</strong>
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-4 py-2 rounded-full font-semibold text-white ${
                  camp.status === 'upcoming'
                    ? 'bg-yellow-500'
                    : camp.status === 'active'
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                }`}
              >
                {camp.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">📍 Location:</span> {camp.location}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">📅 Date:</span>{' '}
                {formatDate(camp.date)}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">👨‍⚕️ Doctors:</span>{' '}
                {camp.doctors?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-800">{camp.description}</p>
            </div>
          </div>

          {user?.role === 'doctor' && !camp.doctors?.includes(user._id) && (
            <button
              onClick={handleJoinCamp}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
            >
              Join as Doctor
            </button>
          )}

          {user?.role === 'patient' && (
            <button
              onClick={() => navigate(`/register-patient/${id}`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
            >
              Register as Patient
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 font-semibold text-center ${
                activeTab === 'overview'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex-1 py-4 font-semibold text-center ${
                activeTab === 'patients'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Patients ({patients.length})
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex-1 py-4 font-semibold text-center ${
                activeTab === 'medicines'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Medicines
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Camp Details</h3>
                <p className="text-gray-700 mb-4">{camp.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Assigned Doctors</h4>
                    {camp.doctors && camp.doctors.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {camp.doctors.map((doctor) => (
                          <li key={doctor._id}>{doctor.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No doctors assigned yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Registered Patients</h3>
                {patients.length === 0 ? (
                  <p className="text-gray-600">No patients registered yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Age</th>
                          <th className="px-4 py-3 text-left">Gender</th>
                          <th className="px-4 py-3 text-left">Contact</th>
                          <th className="px-4 py-3 text-left">BP</th>
                          <th className="px-4 py-3 text-left">Temp</th>
                          <th className="px-4 py-3 text-left">Weight</th>
                          <th className="px-4 py-3 text-left">Complaint</th>
                          <th className="px-4 py-3 text-left">Doctor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient) => (
                          <PatientRow key={patient._id} patient={patient} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'medicines' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Medicine Inventory</h3>
                <MedicineTable medicines={medicines} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
