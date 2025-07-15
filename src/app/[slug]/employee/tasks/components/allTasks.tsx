'use client';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetTasksQuery, useDeleteTaskMutation, useFetchNotificationsQuery } from '@/slices';
import { FaEdit, FaPlus, FaTasks, FaTrash } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import TaskForm from './TaskForm';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ResponsiveTable from '@/components/common/ResponsiveTable';

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
  const [deleteTask] = useDeleteTaskMutation();
  const { companySlug } = useCompany();
  const { refetch: refetchNotifications } = useFetchNotificationsQuery();
  const [deleteState, setDeleteState] = useState<{
    id: number | null;
    name: string;
    showDialog: boolean;
  }>({
    id: null,
    name: "",
    showDialog: false
  });

  const confirmDelete = async () => {
    if (deleteState.id === null) return;

    try {
      await deleteTask(deleteState.id).unwrap();
      toast.success('Task deleted successfully');
      refetch();
      refetchNotifications();
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Error deleting task');
    } finally {
      setDeleteState({
        id: null,
        name: "",
        showDialog: false
      });
    }
  };

  const promptDelete = (id: number, name: string) => {
    setDeleteState({
      id,
      name,
      showDialog: true
    });
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

  const noTasks = !tasksLoading && !tasksError && (!tasks?.data || tasks.data.length === 0);

  // Define columns for the responsive table
  const columns = [
    {
      label: 'Task Name',
      key: 'name' as keyof Task,
    },
    {
      label: 'Employee Name',
      key: 'assigned_to_name' as keyof Task,
    },
    {
      label: 'Employee Role',
      key: 'assigned_role' as keyof Task,
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
          <FaEdit onClick={(e) => {
            e.stopPropagation();
            handleEditClick(task.id);
          }} />
          <FaTrash onClick={(e) => {
            e.stopPropagation();
            promptDelete(task.id, task.name);
          }} />
        </div >
      ),
    },
  ];

  return (
    <>
      <ToastContainer />

      <ConfirmDialog
        isOpen={deleteState.showDialog}
        message={`Are you sure you want to delete the task "${deleteState.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteState({
            id: null,
            name: "",
            showDialog: false
          });
        }}
        type="delete"
      />

      {noTasks ? (
        <EmptyState
          icon={<FaTasks className="empty-state-icon" />}
          title="No tasks found"
          message="You haven't Added any tasks yet. Start by assigning your first task."
          action={
            <button
              type='button'
              className="buttons"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus size={18} /> Add New Task
            </button>
          }
        />
      ) : (
        <div className='tasks_list'>
          {tasks?.data && (
            <ResponsiveTable
              data={tasks.data}
              columns={columns}
              onEdit={(id) => handleEditClick(id)}
              onDelete={(id) => {
                const task = tasks.data.find(t => t.id === id);
                if (task) promptDelete(id, task.name);
              }}
              onView={(id) => window.location.href = `/${companySlug}/employee/tasks/view-task/${id}`}
              cardView={(task: Task) => (
                <>
                  <div className="card-row">
                    <h5>{task.name}</h5>
                    <p>Status: {task.status}</p>
                  </div>
                  <div className="card-row">
                    <p>Assigned to: {task.assigned_to_name}</p>
                    <p>Role: {task.assigned_role}</p>
                  </div>
                  <div className="card-row">
                    <p>Dates: {task.start_date} to {task.end_date}</p>
                  </div>
                  <div className="card-row">
                    <p>Assigned by: {task.assigned_by_name}</p>
                  </div>
                </>
              )}
            />
          )}
        </div>
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