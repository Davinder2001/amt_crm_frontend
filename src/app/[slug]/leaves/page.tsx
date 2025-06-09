'use client';
import React from 'react';
import { useFetchBalanceLeaveQuery } from '@/slices/attendance/attendance';

const LeavesPage = () => {
  const { data, isLoading, isError } = useFetchBalanceLeaveQuery();

  if (isLoading) return <p className="text-center py-4">Loading leave balance...</p>;
  if (isError || !data) return <p className="text-center py-4 text-red-500">Failed to load leave balance.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Leave Balance Summary</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border text-left">Leave Type</th>
              <th className="px-4 py-2 border text-left">Frequency</th>
              <th className="px-4 py-2 border text-center">Total Allowed</th>
              <th className="px-4 py-2 border text-center">Used</th>
              <th className="px-4 py-2 border text-center">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {data.leaves.map((leave, index) => (
              <tr key={leave.leave_id} className="text-sm">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">{leave.leave_type}</td>
                <td className="px-4 py-2 border">{leave.frequency}</td>
                <td className="px-4 py-2 border text-center">{leave.total_allowed}</td>
                <td className="px-4 py-2 border text-center">{leave.used}</td>
                <td className="px-4 py-2 border text-center">{leave.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavesPage;
