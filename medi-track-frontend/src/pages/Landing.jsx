import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import CampCard from '../components/CampCard';

export default function Landing() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCamps();
  }, [page]);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/camps', {
        params: { page, limit: 9 },
      });
      setCamps(response.data.data.camps);
      setTotalPages(response.data.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch camps');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to MediTrack</h1>
          <p className="text-xl mb-4">
            Organize and manage neighborhood health camps efficiently
          </p>
          <p className="text-lg opacity-90">
            Register patients, track medicines, and generate comprehensive reports
          </p>
        </div>
      </div>

      {/* Camps Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Upcoming Camps</h2>

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
            <p className="text-gray-600 text-lg">No camps available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {camps.map((camp) => (
                <CampCard key={camp._id} camp={camp} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
