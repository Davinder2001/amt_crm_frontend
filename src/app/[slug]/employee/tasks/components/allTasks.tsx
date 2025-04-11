'use client';

import React from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const AllTasks: React.FC = () => {
  const { data: tasks, error: tasksError, isLoading: tasksLoading, refetch} = useGetTasksQuery();
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
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Company Name</th>
              <th>Assigned By Name</th>
              <th>Assigned To Name</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task: Task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.name}</td>
                <td>{task.company_name}</td>
                <td>{task.assigned_by_name}</td>
                <td>{task.assigned_to_name}</td>
                <td>{task.deadline}</td>
                <td >
                  
                <button className='table-e-d-v-buttons' onClick={() => handleDelete(task.id)} disabled={isDeleting}>
                    <FaTrash color='#222' />
                  </button>
                  <Link className='table-e-d-v-buttons'  href={`/${companySlug}/employee/tasks/edit-task/${task.id}`}>
                    <FaEdit color='#222' />
                  </Link>
                  
                  <Link className='table-e-d-v-buttons' href={`/${companySlug}/employee/tasks/view-task/${task.id}`}>
                    <FaEye color='#222' />
                  </Link>
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