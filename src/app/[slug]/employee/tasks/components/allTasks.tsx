'use client';

import React from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '@/components/common/Loader';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useCompany } from '@/utils/Company';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';

const AllTasks: React.FC = () => {
  const { data: tasks, error: tasksError, isLoading: tasksLoading, refetch } = useGetTasksQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { companySlug } = useCompany();
  const { refetch: refetchNotifications } = useFetchNotificationsQuery();
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id).unwrap();
        toast.success('Task deleted successfully');
        refetch();
        refetchNotifications();
      } catch (err) {
        console.error('Error deleting task:', err);
        toast.error('Error deleting task');
      }
    }
  };

  if (tasksLoading) return <Loader />;
  if (tasksError) return <p>Error fetching tasks.</p>;

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
            href={`/${companySlug}/employee/tasks/edit-task/${task.id}`}
            className="table-e-d-v-buttons edit-button"
            onClick={(e) => e.stopPropagation()}
          >
            <FaEdit />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(task.id);
            }}
            disabled={isDeleting}
            className="table-e-d-v-buttons delete-button"
          >
            <FaTrash  />
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
          onEdit={(id) => window.location.href = `/${companySlug}/employee/tasks/edit-task/${id}`}
          onView={(id) => window.location.href = `/${companySlug}/employee/tasks/view-task/${id}`}
        />
      ) : (
        <p>No tasks available.</p>
      )}
    </>
  );
};

export default AllTasks;