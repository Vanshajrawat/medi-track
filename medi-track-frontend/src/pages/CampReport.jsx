import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function CampReport() {
  const { campId } = useParams();
  const [camp, setCamp] = useState(null);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [campId]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [campRes, patientsRes, medicinesRes] = await Promise.all([
        axiosInstance.get(`/camps/${campId}`),
        axiosInstance.get(`/patients/camp/${campId}?limit=1000`),
        axiosInstance.get(`/medicines/camp/${campId}`),
      ]);

      setCamp(campRes.data.data);
      setPatients(patientsRes.data.data.patients || []);
      setMedicines(medicinesRes.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const getComplaints = () => {
    const complaintMap = {};
    patients.forEach((patient) => {
      if (patient.complaint) {
        complaintMap[patient.complaint] =
          (complaintMap[patient.complaint] || 0) + 1;
      }
    });
    return Object.entries(complaintMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getDoctorStats = () => {
    const doctorMap = {};
    patients.forEach((patient) => {
      if (patient.assignedDoctor) {
        const doctorName = patient.assignedDoctor.name;
        doctorMap[doctorName] = (doctorMap[doctorName] || 0) + 1;
      }
    });
    return Object.entries(doctorMap);
  };

  const getMedicineStats = () => {
    return medicines.map((medicine) => ({
      name: medicine.name,
      total: medicine.quantity,
      dispensed: medicine.dispensedTo ? medicine.dispensedTo.length : 0,
      remaining: medicine.quantity - (medicine.dispensedTo ? medicine.dispensedTo.length : 0),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading report...</p>
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error || 'Camp not found'}</p>
      </div>
    );
  }

  const complaints = getComplaints();
  const doctors = getDoctorStats();
  const medicineStats = getMedicineStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Print Button */}
        <div className="print:hidden mb-6">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded"
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Report Container */}
        <div className="bg-white rounded-lg shadow p-8 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b">
            <h1 className="text-4xl font-bold text-gray-800">
              {camp.title} - Report
            </h1>
            <p className="text-gray-600 mt-2">
              {new Date(camp.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-600">📍 {camp.location}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-600 text-sm">Total Patients</p>
              <p className="text-4xl font-bold text-blue-600">{patients.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-gray-600 text-sm">Doctors Assigned</p>
              <p className="text-4xl font-bold text-green-600">{camp.doctors?.length || 0}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <p className="text-gray-600 text-sm">Medicines Recorded</p>
              <p className="text-4xl font-bold text-yellow-600">{medicines.length}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-600 text-sm">Total Medicines Dispensed</p>
              <p className="text-4xl font-bold text-purple-600">
                {medicineStats.reduce((sum, m) => sum + m.dispensed, 0)}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {/* Top Complaints */}
            <div className="page-break">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Top Complaints
              </h2>
              {complaints.length === 0 ? (
                <p className="text-gray-600">No complaints recorded</p>
              ) : (
                <div className="space-y-3">
                  {complaints.map((complaint, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-3 border-b">
                      <span className="text-gray-700">{complaint[0]}</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                        {complaint[1]} patients
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Doctor Stats */}
            <div className="page-break">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Patients per Doctor
              </h2>
              {doctors.length === 0 ? (
                <p className="text-gray-600">No doctor assignments</p>
              ) : (
                <div className="space-y-3">
                  {doctors.map((doctor, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-3 border-b">
                      <span className="text-gray-700">{doctor[0]}</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                        {doctor[1]} patients
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Medicine Inventory */}
            <div className="page-break">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Medicine Inventory Report
              </h2>
              {medicineStats.length === 0 ? (
                <p className="text-gray-600">No medicines recorded</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border px-4 py-3 text-left">Medicine Name</th>
                        <th className="border px-4 py-3 text-center">Total Qty</th>
                        <th className="border px-4 py-3 text-center">Dispensed</th>
                        <th className="border px-4 py-3 text-center">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicineStats.map((med, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border px-4 py-3">{med.name}</td>
                          <td className="border px-4 py-3 text-center">{med.total}</td>
                          <td className="border px-4 py-3 text-center font-semibold text-green-600">
                            {med.dispensed}
                          </td>
                          <td className="border px-4 py-3 text-center font-semibold text-yellow-600">
                            {med.remaining}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-gray-600 text-sm">
            <p>Report generated by MediTrack</p>
            <p>{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .page-break {
            page-break-inside: avoid;
          }
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
