'use client';

import React from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '@/components/common/Loader';
import ResponsiveTable from '@/components/common/ResponsiveTable';

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

  if (profileLoading || tasksLoading) return <Loader />;
  if (profileError) return <p>Error fetching profile.</p>;
  if (tasksError) return <p>Error fetching tasks.</p>;
  if (!companySlug) return <p>Company slug not found.</p>;

  // Define columns for the responsive table
  const columns = [
    {
      label: 'Employee Name',
      key: 'assigned_to_name' as keyof Task,
    },
    {
      label: 'Employee Role',
      key: 'assigned_role' as keyof Task,
    },
    {
      label: 'Task Name',
      key: 'name' as keyof Task,
    },
    {
      label: 'Start Date',
      key: 'start_date' as keyof Task,
    },
    {
      label: 'End Date',
      key: 'end_date' as keyof Task,
    },
    {
      label: 'Assigned By',
      key: 'assigned_by_name' as keyof Task,
    },
    {
      label: 'Status',
      key: 'status' as keyof Task,
    },
    {
      label: 'Actions',
      render: (task: Task) => (
        <div className='store-t-e-e-icons'>
          <Link
            href={`/${companySlug}/tasks/edit-task/${task.id}`}
            className="table-e-d-v-buttons"
            onClick={(e) => e.stopPropagation()}
          >
            <FaEdit color="#222" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(task.id);
            }}
            disabled={isDeleting}
            className="table-e-d-v-buttons"
          >
            <FaTrash color="#222" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      {tasks?.data && tasks.data.length > 0 ? (
        <ResponsiveTable
          data={tasks.data}
          columns={columns}
          onDelete={handleDelete}
          onEdit={(id) => window.location.href = `/${companySlug}/tasks/edit-task/${id}`}
          onView={(id) => window.location.href = `/${companySlug}/tasks/view-task/${id}`}
        />
      ) : (
        <p>No tasks available.</p>
      )}
    </>
  );
};

export default AllTasks;