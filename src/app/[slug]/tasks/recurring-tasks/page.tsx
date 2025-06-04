'use client';

import React, { useState } from 'react';
import { useGetPredefinedTasksQuery, useDeletePredefinedTaskMutation } from '@/slices/tasks/taskApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import Modal from '@/components/common/Modal';
import RecurringTaskForm from '../components/RecurringTaskForm';

// You can adjust or import this type from your models
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
  const { companySlug } = useCompany();

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
        refetch();
      } catch {
        alert('Delete failed!');
      }
    }
  };

  return (
    <>
      <div className="recurring-wrapper">

        <Link href={`/${companySlug}/tasks`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
        <button className="add-btn buttons" onClick={() => setIsAddRecurringModalOpen(true)}>
          <FaPlus /> Add
        </button>

        {isLoading && <p>Loading...</p>}
        {error && <p>Failed to load tasks.</p>}

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
                    <span onClick={() => handleEdit(task.id)}><FaEdit /></span>
                    <span onClick={() => handleDelete(task.id)} style={{ color: 'red', marginLeft: '8px' }}>
                      <FaTrash />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !isLoading && <p>No recurring tasks found.</p>
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
