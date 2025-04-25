'use client';
import React, { useState } from 'react';
import {
  useGetPredefinedTasksQuery,
  useDeletePredefinedTaskMutation,
} from '@/slices/tasks/taskApi';

const Page = () => {
  const { data, isLoading, error, refetch } = useGetPredefinedTasksQuery();
  const [deleteTask] = useDeletePredefinedTaskMutation();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this recurring task?')) {
      try {
        await deleteTask(id).unwrap();
        refetch();
      } catch (err) {
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
        <button className="add-btn" onClick={handleAdd}>
          + Add
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Failed to load tasks.</p>}

      {data?.tasks?.length > 0 ? (
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
            {data.tasks.map((task: any) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.recurrence_type}</td>
                <td>{task.recurrence_start_date}</td>
                <td>{task.recurrence_end_date || '—'}</td>
                <td>{task.notify ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => {
                    setSelectedId(task.id);
                    setShowModal(true);
                  }}>Edit</button>
                  <button onClick={() => handleDelete(task.id)} style={{ color: 'red' }}>
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

      

      <style jsx>{`
        .recurring-wrapper {
          padding: 24px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .add-btn {
          padding: 8px 16px;
          background-color: #009693;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .task-table {
          width: 100%;
          border-collapse: collapse;
        }
        .task-table th,
        .task-table td {
          border: 1px solid #ccc;
          padding: 10px;
          font-size: 14px;
        }
        .task-table th {
          background-color: #f0f0f0;
        }
        .task-table button {
          margin-right: 8px;
          padding: 4px 8px;
          cursor: pointer;
        }
        
      `}</style>
    </div>
  );
};

export default Page;
