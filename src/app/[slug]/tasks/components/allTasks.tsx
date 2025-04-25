'use client';

import React from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const AllTasks: React.FC = () => {
  const { data: tasks, error: tasksError, isLoading: tasksLoading, refetch } = useGetTasksQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { data: selectedCompany, isLoading: profileLoading, error: profileError } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id).unwrap();
        toast.success('Task deleted successfully');
        refetch();
      } catch (err) {
        console.error('Error deleting task:', err);
        toast.error('Error deleting task');
      }
    }
  };

  if (profileLoading || tasksLoading) return <p>Loading...</p>;
  if (profileError) return <p>Error fetching profile.</p>;
  if (tasksError) return <p>Error fetching tasks.</p>;
  if (!companySlug) return <p>Company slug not found.</p>;

  return (
    <>
      <ToastContainer />
      {tasks?.data && tasks.data.length > 0 ? (
        // …inside AllTasks’s return:

        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee Role</th>
              <th>Task Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Assigned By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task) => (
              <tr key={task.id}>
                <td>{task.assigned_to_name}</td>
                <td>{task.assigned_role}</td>
                <td>{task.name}</td>
                <td>{task.start_date}</td>
                <td>{task.end_date}</td>
                <td>{task.assigned_by_name}</td>
                <td>{task.status}</td>
        
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/${companySlug}/tasks/view-task/${task.id}`}
                      className="table-e-d-v-buttons"
                    >
                      <FaEye color="#222" />
                    </Link>
                    <Link
                      href={`/${companySlug}/tasks/edit-task/${task.id}`}
                      className="table-e-d-v-buttons"
                    >
                      <FaEdit color="#222" />
                    </Link>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={isDeleting}
                      className="table-e-d-v-buttons"
                    >
                      <FaTrash color="#222" />
                    </button>
                  </div>
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
