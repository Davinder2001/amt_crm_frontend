'use client';

import React, { useState } from 'react';
import { useGetMyTasksQuery, useFetchSelectedCompanyQuery, useMarkTaskAsWorkingMutation, useFetchNotificationsQuery } from '@/slices';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaPaperPlane, FaReply } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import SubmitTaskComponent from './SubmitTaskComponent';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const Page = () => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetMyTasksQuery();
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;
  const [markTaskAsWorking, { isLoading: isMarking }] = useMarkTaskAsWorkingMutation();
  const { refetch: refetchNotifications } = useFetchNotificationsQuery();
  const [isSubmitTaskOpen, setIsSubmitTaskOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  const tasks = data?.data || [];

  const handleSubmitTask = (taskId: number) => {
    setCurrentTaskId(taskId);
    setIsSubmitTaskOpen(true);
  };

  const handleCheckTask = async (taskId: number) => {
    try {
      await markTaskAsWorking(taskId).unwrap();
      refetchNotifications();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  // Define columns with proper typing
  const columns = [
    {
      label: 'Task Name',
      key: 'name' as keyof Task,
    },
    {
      label: 'Description',
      render: (task: Task) => task.description || 'N/A',
    },
    {
      label: 'Start Date',
      render: (task: Task) => task.start_date || '—',
    },
    {
      label: 'End Date',
      render: (task: Task) => task.end_date || '—',
    },
    {
      label: 'Status',
      render: (task: Task) => (
        <span className="text-green-700 capitalize">{task.status}</span>
      ),
    },
    {
      label: 'Action',
      render: (task: Task) => (
        <>
          {task.status === 'pending' ?
            <button
              type='button'
              onClick={() => handleCheckTask(task.id)}
              disabled={isMarking}
              className="task-button"
            >
              <FaCheckCircle />
              {isMarking ? 'Updating...' : 'Start'}
            </button> : task.status === 'submitted' ?

              <button
                type='button'
                className="task-button"
                style={{ cursor: 'not-allowed', backgroundColor: 'gray' }}
                disabled={true}
              >
                Submitted
              </button>
              :

              <button
                type='button'
                onClick={() => handleSubmitTask(task.id)}
                className="task-button"
              >
                <FaReply />
                Follow Up
              </button>
          }
        </>
      ),
    },
  ];

  if (isLoading) return <LoadingState />;
  if (error) {
    return (
      <EmptyState
        icon="alert"
        title="Failed to Load Tasks"
        message="Something went wrong while fetching your working tasks."
      />
    );
  }


  return (
    <>
      {tasks.length === 0 ? (
        <EmptyState
          icon={<FaPaperPlane className="empty-state-icon" />}
          title="No Working Tasks"
          message="You're all caught up! No pending tasks at the moment."
        />
      ) : (
        <ResponsiveTable<Task>
          data={tasks}
          columns={columns}
          onView={(id) => router.push(`/${companySlug}/tasks/task-timeline/${id}`)}
        />
      )}


      {/*submit Task Modal */}
      <Modal
        isOpen={isSubmitTaskOpen}
        onClose={() => setIsSubmitTaskOpen(false)}
        title={`Submit Task ${currentTaskId}`}
        width="800px"
      >
        <SubmitTaskComponent
          taskId={currentTaskId!}
          onSuccess={() => {
            setIsSubmitTaskOpen(false);
            refetch();
          }}
        />
      </Modal>
      <style>{`
       .task-button {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default Page;