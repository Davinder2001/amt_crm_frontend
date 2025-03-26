'use client';

import React from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const AllTasks: React.FC = () => {
  const { data: tasks, error: tasksError, isLoading: tasksLoading } = useGetTasksQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { data: selectedCompany, isLoading: profileLoading, error: profileError } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

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
  if (!companySlug) return <p>Company slug not found.</p>;

  return (
    <>
      <ToastContainer />
      <h1 className="tasks-heading">All Tasks</h1>
      {tasks?.data && tasks.data.length > 0 ? (
        <table className="tasks-table">
          <thead className="tasks-thead">
            <tr className="tasks-tr">
              <th className="tasks-th">ID</th>
              <th className="tasks-th">Name</th>
              <th className="tasks-th">Company Name</th>
              <th className="tasks-th">Assigned By Name</th>
              <th className="tasks-th">Assigned To Name</th>
              <th className="tasks-th">Deadline</th>
              <th className="tasks-th">Action</th>
            </tr>
          </thead>
          <tbody className="tasks-tbody">
            {tasks.data.map((task) => (
              <tr key={task.id} className="tasks-tr">
                <td className="tasks-td">{task.id}</td>
                <td className="tasks-td">{task.name}</td>
                <td className="tasks-td">{task.company_name}</td>
                <td className="tasks-td">{task.assigned_by_name}</td>
                <td className="tasks-td">{task.assigned_to_name}</td>
                <td className="tasks-td">{task.deadline}</td>
                <td className="tasks-td">
                  <Link href={`/${companySlug}/tasks/edit-task/${task.id}`}>
                    <FaEdit className="tasks-icon" color="#222" />
                  </Link>
                  <button onClick={() => handleDelete(task.id)} disabled={isDeleting} className="tasks-delete-button">
                    <FaTrash className="tasks-icon" color="#222" />
                  </button>
                  <Link href={`/${companySlug}/tasks/view-task/${task.id}`}>
                    <FaEye className="tasks-icon" color="#222" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-tasks">No tasks available.</p>
      )}
    </>
  );
};

export default AllTasks;
