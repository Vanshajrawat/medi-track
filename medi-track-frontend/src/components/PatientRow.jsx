import React from 'react';

export default function PatientRow({ patient }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">{patient.name}</td>
      <td className="px-4 py-3">{patient.age}</td>
      <td className="px-4 py-3 capitalize">{patient.gender}</td>
      <td className="px-4 py-3">{patient.contact || '-'}</td>
      <td className="px-4 py-3">
        {patient.vitals?.bloodPressure || '-'}
      </td>
      <td className="px-4 py-3">
        {patient.vitals?.temperature || '-'}
      </td>
      <td className="px-4 py-3">
        {patient.vitals?.weight || '-'} kg
      </td>
      <td className="px-4 py-3">{patient.complaint || '-'}</td>
      <td className="px-4 py-3">
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {patient.assignedDoctor?.name || 'Unassigned'}
        </span>
      </td>
    </tr>
  );
}
