'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import {
  useGetTasksQuery,
  useApproveHistoryMutation,
  useRejectHistoryMutation,
} from '@/slices/tasks/taskApi';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { toast } from 'react-toastify';

// Define the Task type locally since it is not exported from taskApi
type Task = {
  id: number | string;
  name: string;
  description: string;
  assigned_by_name?: string;
  assigned_to_name?: string;
  assigned_role?: string;
  company_id?: number | string;
  company_name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  // Add other fields as needed based on your API response
};

function TaskViewPage() {
  const { id } = useParams();
  const { setTitle } = useBreadcrumb();

  const { data: tasks } = useGetTasksQuery();
  const [approveHistory, { isLoading: isApproving }] = useApproveHistoryMutation();
  const [rejectHistory, { isLoading: isRejecting }] = useRejectHistoryMutation();

  useEffect(() => {
    setTitle('View Task');
  }, [setTitle]);

  const task = tasks?.data.find((task) => task.id.toString() === id);

  if (!task) {
    return <p className="p-4 text-center">No task found with ID: {id}</p>;
  }

  const handleApprove = async () => {
    try {
      await approveHistory(task.id).unwrap();
      toast.success('Task approved successfully');
    } catch (err) {
      console.error("Approve Error:", err);
      toast.error('Error approving task');
    }
  };

  const handleReject = async () => {
    try {
      await rejectHistory({ id: task.id }).unwrap();
      toast.success('Task rejected');
    } catch (err) {
      console.error("Reject Error:", err);
      toast.error('Error rejecting task');
    }
  };

  const columns: {
    label: string;
    key?: keyof Task;
    render?: (t: Task) => React.ReactNode;
  }[] = [
    { label: 'Task Name', key: 'name' },
    { label: 'Description', key: 'description' },
    { label: 'Assigned By', key: 'assigned_by_name' },
    { label: 'Assigned To', key: 'assigned_to_name' },
    { label: 'Assigned Role', key: 'assigned_role' },
    { label: 'Company ID', key: 'company_id' },
    { label: 'Company Name', key: 'company_name' },
    {
      label: 'Start Date',
      render: (t: Task) => t.start_date?.replace('T', ' ').slice(0, 16),
    },
    {
      label: 'End Date',
      render: (t: Task) => t.end_date?.replace('T', ' ').slice(0, 16),
    },
    { label: 'Status', key: 'status' },
    {
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="px-3 py-1 rounded bg-green-500 text-white text-sm"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
          <button
            onClick={handleReject}
            disabled={isRejecting}
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
          >
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      ),
    },
  ];

  // Since we're showing one row, wrap the task in an array
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Task Details</h2>
      <ResponsiveTable data={[task]} columns={columns} />
    </div>
  );
}

export default TaskViewPage;
