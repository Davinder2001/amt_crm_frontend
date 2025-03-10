'use client';

import React from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import { Task } from '@/slices/tasks/taskApi';

const AllTasks: React.FC = () => {
  const { data: tasks, error: tasksError, isLoading: tasksLoading } = useGetTasksQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { data: profile, isLoading: profileLoading, error: profileError } = useFetchProfileQuery();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id).unwrap();
        toast.success('Task deleted successfully');
      } catch (err) {
        console.error('Error deleting task:', err);
        toast.error('Error deleting task');
      }
    }
  };

  if (profileLoading || tasksLoading) return <p>Loading...</p>;
  if (profileError) return <p>Error fetching profile.</p>;
  if (tasksError) return <p>Error fetching tasks.</p>;

  const companySlug = profile?.user?.company_slug;
  if (!companySlug) return <p>Company slug not found.</p>;

  return (
    <>
      <ToastContainer />
      <h1>All Tasks</h1>
      {tasks?.data && tasks.data.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Company Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Assigned By Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Assigned To Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Deadline</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task: Task) => (
              <tr key={task.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.company_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.assigned_by_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.assigned_to_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.deadline}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <Link href={`/${companySlug}/tasks/edit-task/${task.id}`}>
                    <button style={{ marginRight: '8px' }}>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(task.id)} disabled={isDeleting}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks available.</p>
      )}
    </>
  );
};

export default AllTasks;
