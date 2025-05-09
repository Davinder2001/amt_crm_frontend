'use client';

import React from 'react';
import { useGetPredefinedTasksQuery, useDeletePredefinedTaskMutation } from '@/slices/tasks/taskApi';
import { FaPlus } from 'react-icons/fa';

// You can adjust or import this type from your models
interface PredefinedTask {
  id: number;
  name: string;
  description: string;
  recurrence_type: string;
  recurrence_start_date: string;
  recurrence_end_date?: string;
  notify: boolean;
}

const Page = () => {
  const { data, isLoading, error, refetch } = useGetPredefinedTasksQuery();
  const [deleteTask] = useDeletePredefinedTaskMutation();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this recurring task?')) {
      try {
        await deleteTask(id).unwrap();
        refetch();
      } catch {
        alert('Delete failed!');
      }
    }
  };

  const handleAdd = () => {
    window.location.href = 'recurring-tasks/create';
  };

  return (
    <div className="recurring-wrapper">
      <div className="header">
        <h2>Recurring Tasks</h2>
        <button className="add-btn buttons" onClick={handleAdd}>
          <FaPlus /> Add
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Failed to load tasks.</p>}

      {data?.length > 0 ? (
        <table className="task-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Notify</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((task: PredefinedTask) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.recurrence_type}</td>
                <td>{new Date(task.recurrence_start_date).toLocaleDateString()}</td>
                <td>{task.recurrence_end_date ? new Date(task.recurrence_end_date).toLocaleDateString() : '—'}</td>
                <td>{task.notify ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => window.location.href = `recurring-tasks/${task.id}/edit`}>Edit</button>
                  <button onClick={() => handleDelete(task.id)} style={{ color: 'red', marginLeft: '8px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !isLoading && <p>No recurring tasks found.</p>
      )}
    </div>
  );
};

export default Page;
