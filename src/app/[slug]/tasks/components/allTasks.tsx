'use client';

import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/slices/tasks/taskApi';
import { FaEdit, FaPlus, FaTasks, FaTrash } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useCompany } from '@/utils/Company';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import TaskForm from './TaskForm';


interface AllTasksProps {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  currentTaskId: number | null;
  setIsAddModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setCurrentTaskId: (id: number | null) => void;
}

const AllTasks: React.FC<AllTasksProps> = ({
  isAddModalOpen,
  isEditModalOpen,
  currentTaskId,
  setIsAddModalOpen,
  setIsEditModalOpen,
  setCurrentTaskId,
}) => {
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

  const handleEditClick = (id: number) => {
    setCurrentTaskId(id);
    setIsEditModalOpen(true);
  };

  if (tasksLoading) return <LoadingState />;
  if (tasksError) return (
    <EmptyState
      icon="alert"
      title="Failed to load tasks"
      message="We encountered an error while loading tasks. Please try again later."
    />
  );
  if (!tasks?.data || tasks.data.length === 0) (
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
  );

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
            className="table-e-d-v-buttons edit-button"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(task.id);
            }}
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

  return (
    <>
      <ToastContainer />
      {tasks?.data && tasks.data.length > 0 ? (
        <ResponsiveTable
          data={tasks.data}
          columns={columns}
          onDelete={handleDelete}
          onView={(id) => window.location.href = `/${companySlug}/tasks/view-task/${id}`}
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

export default AllTasks;