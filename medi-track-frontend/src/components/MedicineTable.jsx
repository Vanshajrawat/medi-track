import React from 'react';

export default function MedicineTable({ medicines }) {
  if (!medicines || medicines.length === 0) {
    return <p className="text-gray-600">No medicines recorded.</p>;
  }

  const getTotalDispensed = (medicine) => {
    return medicine.dispensedTo ? medicine.dispensedTo.length : 0;
  };

  const getRemaining = (medicine) => {
    return medicine.quantity - getTotalDispensed(medicine);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-200 text-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">Medicine Name</th>
            <th className="px-4 py-3 text-left">Total Qty</th>
            <th className="px-4 py-3 text-left">Dispensed</th>
            <th className="px-4 py-3 text-left">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{medicine.name}</td>
              <td className="px-4 py-3">{medicine.quantity}</td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {getTotalDispensed(medicine)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {getRemaining(medicine)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
