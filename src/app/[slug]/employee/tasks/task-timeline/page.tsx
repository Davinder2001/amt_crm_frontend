'use client';

import React from 'react';
import { useGetWorkingTasksQuery } from '@/slices/tasks/taskApi';
import { useRouter } from 'next/navigation';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';

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
  const { data, isLoading, error } = useGetWorkingTasksQuery();
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  const tasks = data?.data || [];

  const handleSubmitTask = (taskId: number) => {
    router.push(`/${companySlug}/employee/tasks/submit-task/${taskId}`);
  };

  // Define columns with proper typing
  const columns = [
    {
      label: '#',
      render: (task: Task, index: number) => index + 1,
    },
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
          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200 transition"
        >
          <FaPaperPlane className="w-4 h-4 mr-1" />
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
          onView={(id) => router.push(`/${companySlug}/employee/tasks/task-timeline/${id}`)}
        />
      )}
    </div>
  );
};

export default Page;