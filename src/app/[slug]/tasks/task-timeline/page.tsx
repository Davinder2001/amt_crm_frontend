'use client';

import React, { useState } from 'react';
import { useGetWorkingTasksQuery } from '@/slices/tasks/taskApi';
import { useRouter } from 'next/navigation';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';
import SubmitTaskComponent from '../submit-task/SubmitTaskComponent';

// Define the Task type based on your API response
type Task = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
};

const Page = () => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetWorkingTasksQuery();
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  // Modal states
  const [isSubmitTaskOpen, setIsSubmitTaskOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);


  const tasks = data?.data || [];

  const handleSubmitTask = (taskId: number) => {
    setCurrentTaskId(taskId);
    setIsSubmitTaskOpen(true);
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
        <button
          onClick={() => handleSubmitTask(task.id)}
          className="buttons"
        >
          <FaPaperPlane />
          Submit Task
        </button>
      ),
    },
  ];

  if (isLoading) return <p>Loading working tasks...</p>;
  if (error) return <p>Failed to load working tasks</p>;

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="back-button"
      >
        <FaArrowLeft size={20} color="#fff" />
      </button>
      {tasks.length === 0 ? (
        <p>No working tasks found.</p>
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
    </div>
  );
};

export default Page;