// src/app/[slug]/tasks/page.tsx
'use client';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { FaEdit, FaPlus, FaTasks, FaTrash, FaRegCalendarAlt, FaUserCheck, FaRedo } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import TaskForm from './components/TaskForm';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';

const TasksPage: React.FC = () => {
  const { data: tasks, error: tasksError, isLoading: tasksLoading, refetch } = useGetTasksQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { refetch: refetchNotifications } = useFetchNotificationsQuery();
  const router = useRouter();
  const { companySlug } = useCompany();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

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

  const handleEditClick = (id: number) => {
    setCurrentTaskId(id);
    setIsEditModalOpen(true);
  };

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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(task.id);
            }}
            className="table-e-d-v-buttons edit-button"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(task.id);
            }}
            disabled={isDeleting}
            className="table-e-d-v-buttons delete-button"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  if (tasksLoading) return <LoadingState />;
  if (tasksError) return (
    <EmptyState
      icon="alert"
      title="Failed to load tasks"
      message="We encountered an error while loading tasks. Please try again later."
    />
  );

  return (
    <>
      <ToastContainer />
      <TableToolbar
        actions={[
          {
            label: 'Task Timeline',
            icon: <FaRegCalendarAlt />,
            onClick: () => router.push(`/${companySlug}/tasks/task-timeline`),
          },
          {
            label: 'Add Task',
            icon: <FaPlus />,
            onClick: () => setIsAddModalOpen(true),
          },
          {
            label: 'Attendance',
            icon: <FaUserCheck />,
            onClick: () => router.push(`/${companySlug}/attendence`),
          },
          {
            label: 'Recurring Tasks',
            icon: <FaRedo />,
            onClick: () => router.push(`/${companySlug}/tasks/recurring-tasks`),
          },
        ]}
      />

      {/* Tasks Table or Empty State */}
      {tasks?.data && tasks.data.length > 0 ? (
        <ResponsiveTable
          data={tasks.data}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEditClick}
        />
      ) : (
        <EmptyState
          icon={<FaTasks className="empty-state-icon" />}
          title="No tasks found"
          message="You haven't created any tasks yet. Start by assigning your first task."
          action={
            <button
              className="buttons"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus size={18} /> Add New Task
            </button>
          }
        />
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Task"
        width="800px"
      >
        <TaskForm
          mode="add"
          onSuccess={() => {
            setIsAddModalOpen(false);
            refetch();
            refetchNotifications();
          }}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Task ${currentTaskId}`}
        width="800px"
      >
        {currentTaskId && (
          <TaskForm
            mode="edit"
            taskId={currentTaskId}
            onSuccess={() => {
              setIsEditModalOpen(false);
              refetch();
              refetchNotifications();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default TasksPage;