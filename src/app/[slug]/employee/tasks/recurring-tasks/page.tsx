'use client';
import React, { useState } from 'react';
import { useGetPredefinedTasksQuery, useDeletePredefinedTaskMutation } from '@/slices';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FaEdit, FaPlus, FaTrash, FaTasks } from 'react-icons/fa';;
import Modal from '@/components/common/Modal';
import RecurringTaskForm from '../components/RecurringTaskForm';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTriangleExclamation } from 'react-icons/fa6';

interface PredefinedTask {
  id: number;
  name: string;
  description: string;
  recurrence_type: string;
  recurrence_start_date: string;
  recurrence_end_date?: string;
  notify: boolean;
}

const Page = () => {
  const { data, isLoading, error, refetch } = useGetPredefinedTasksQuery() as {
    data?: PredefinedTask[];
    isLoading: boolean;
    error: FetchBaseQueryError | undefined;
    refetch: () => void;
  };
  const [deleteTask] = useDeletePredefinedTaskMutation();

  const [isAddRecurringModalOpen, setIsAddRecurringModalOpen] = useState(false);
  const [isEditRecurringModalOpen, setIsEditRecurringModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const handleEdit = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsEditRecurringModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this recurring task?')) {
      try {
        await deleteTask(id).unwrap();
        toast.success('Recurring task deleted successfully');
        refetch();
      } catch {
        toast.error('Delete failed!');
      }
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return (
    <EmptyState
      icon={<FaTriangleExclamation className='empty-state-icon' />}
      title="Failed to load recurring tasks"
      message="We encountered an error while loading recurring tasks. Please try again later."
    />
  );

  return (
    <>
      <ToastContainer />
      <div className="recurring-wrapper">
        <div className='recurring-task-header'>
          {/* Only show header Add button when there are tasks */}
          {data && data.length > 0 && (
            <button type='button' className="add-btn buttons" onClick={() => setIsAddRecurringModalOpen(true)}>
              <FaPlus /> Add
            </button>
          )}
        </div>

        {data && data.length > 0 ? (
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
              {data.map((task: PredefinedTask) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.recurrence_type}</td>
                  <td>{new Date(task.recurrence_start_date).toLocaleDateString()}</td>
                  <td>{task.recurrence_end_date ? new Date(task.recurrence_end_date).toLocaleDateString() : '—'}</td>
                  <td>{task.notify ? 'Yes' : 'No'}</td>
                  <td>
                    <span onClick={() => handleEdit(task.id)} className='edit-button'><FaEdit /></span>
                    <span onClick={() => handleDelete(task.id)} style={{ color: 'red', marginLeft: '8px' }}>
                      <FaTrash />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={<FaTasks className="empty-state-icon" />}
            title="No recurring tasks found"
            message="You haven't Added any recurring tasks yet. Start by adding your first recurring task."
            action={
              <button
                type='button'
                className="buttons"
                onClick={() => setIsAddRecurringModalOpen(true)}
              >
                <FaPlus size={18} /> Add Recurring Task
              </button>
            }
          />
        )}
      </div>
      <Modal
        isOpen={isAddRecurringModalOpen}
        onClose={() => setIsAddRecurringModalOpen(false)}
        title="Add Recurring Task"
        width="800px"
      >
        <RecurringTaskForm
          mode="add"
          onSuccess={() => {
            setIsAddRecurringModalOpen(false);
            refetch();
          }}
        />
      </Modal>

      <Modal
        isOpen={isEditRecurringModalOpen}
        onClose={() => setIsEditRecurringModalOpen(false)}
        title="Edit Recurring Task"
        width="800px"
      >
        <RecurringTaskForm
          mode="edit"
          taskId={selectedTaskId ?? undefined}
          onSuccess={() => {
            setIsEditRecurringModalOpen(false);
            refetch();
          }}
        />
      </Modal>
    </>
  );
};

export default Page;