'use client';
import React, { useState } from 'react';
import {
  useGetPredefinedTasksQuery,
  useDeletePredefinedTaskMutation,
} from '@/slices/tasks/taskApi';
import { FaPlus } from 'react-icons/fa';

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
        <button className="add-btn buttons" onClick={handleAdd}>
          <FaPlus/> Add
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
    </div>
  );
};

export default Page;
