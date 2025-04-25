'use client';

import React from 'react';
import { useGetPendingTasksQuery, useMarkTaskAsWorkingMutation } from '@/slices/tasks/taskApi';
import { FaCheckCircle } from 'react-icons/fa';

const MyTasks = () => {
  const { data, isLoading, error } = useGetPendingTasksQuery();
  const tasks = data?.data || [];

  const [markTaskAsWorking, { isLoading: isMarking }] = useMarkTaskAsWorkingMutation();

  const handleCheckTask = async (taskId: number) => {
    try {
      const res = await markTaskAsWorking(taskId).unwrap();
      console.log('✅ Task updated:', res);
      // Optionally show a toast message here
    } catch (err) {
      console.error('❌ Failed to update task status:', err);
    }
  };

  if (isLoading) return <p>Loading pending tasks...</p>;
  if (error) return <p>Failed to load tasks.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Pending Tasks</h2>

      {tasks.length === 0 ? (
        <p>No pending tasks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Task Name</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Start Date</th>
                <th className="px-4 py-2 border-b">End Date</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b font-medium">{task.name}</td>
                  <td className="px-4 py-2 border-b">{task.description || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{task.start_date || '—'}</td>
                  <td className="px-4 py-2 border-b">{task.end_date || '—'}</td>
                  <td className="px-4 py-2 border-b capitalize text-yellow-600">{task.status}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      onClick={() => handleCheckTask(task.id)}
                      disabled={isMarking}
                      className="inline-flex items-center px-2 py-1 text-sm text-green-700 bg-green-100 border border-green-300 rounded hover:bg-green-200 transition disabled:opacity-50"
                    >
                      <FaCheckCircle className="w-4 h-4 mr-1" />
                      {isMarking ? 'Processing...' : 'Check'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
