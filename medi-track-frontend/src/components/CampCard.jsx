import React from 'react';
import { Link } from 'react-router-dom';

export default function CampCard({ camp }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{camp.title}</h3>
          <p className="text-sm text-gray-600">By {camp.organizer?.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(camp.status)}`}>
          {camp.status}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-3">{camp.description}</p>

      <div className="flex flex-col space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="text-lg mr-2">📍</span>
          <span>{camp.location}</span>
        </div>
        <div className="flex items-center">
          <span className="text-lg mr-2">📅</span>
          <span>{formatDate(camp.date)}</span>
        </div>
        {camp.doctors && camp.doctors.length > 0 && (
          <div className="flex items-center">
            <span className="text-lg mr-2">👨‍⚕️</span>
            <span>{camp.doctors.length} Doctor(s)</span>
          </div>
        )}
      </div>

      <Link
        to={`/camp/${camp._id}`}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold text-center block"
      >
        View Details
      </Link>
    </div>
  );
}
