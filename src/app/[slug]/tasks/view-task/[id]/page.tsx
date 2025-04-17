'use client'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetTasksQuery, useApproveHistoryMutation, useRejectHistoryMutation } from '@/slices/tasks/taskApi';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

function Page() {
  const { id } = useParams(); // Dynamic route param
  const { setTitle } = useBreadcrumb();

  // Fetch tasks and approval/reject mutations
  const { data: tasks } = useGetTasksQuery();
  const [approveHistory, { isLoading: isApproving }] = useApproveHistoryMutation();
  const [rejectHistory, { isLoading: isRejecting }] = useRejectHistoryMutation();

  useEffect(() => {
    setTitle(`View Task`);
  }, [setTitle]);

  // Find the task by ID
  const task = tasks?.data.find((task) => task.id.toString() === id);

  if (!task) {
    return <div>No task found with ID: {id}</div>;
  }

  const handleApprove = async () => {
    try {
      await approveHistory(task.id).unwrap();
      alert('Task approved successfully');
      // optionally refetch or navigate back
    } catch (err) {
      console.error("Approve Error:", err);
      alert('Error approving task');
    }
  };

  const handleReject = async () => {
    try {
      await rejectHistory({ id: task.id }).unwrap();
      alert('Task rejected');
    } catch (err) {
      console.error("Reject Error:", err);
      alert('Error rejecting task');
    }
  };

  return (
    <div className="view-task-container">
      <h2 className="task-heading">Task Details</h2>
      <div className="task-details">
        <p><strong>Task Name:</strong> {task.name}</p>
        <p><strong>Description:</strong> {task.description || 'N/A'}</p>
        <p><strong>Assigned By:</strong> {task.assigned_by_name}</p>
        <p><strong>Assigned To:</strong> {task.assigned_to_name}</p>
        <p><strong>Assigned Role:</strong> {task.assigned_role}</p>
        <p><strong>Company ID:</strong> {task.company_id}</p>
        <p><strong>Company Name:</strong> {task.company_name || 'N/A'}</p>
        <p><strong>Start Date:</strong> {task.start_date?.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>End Date:</strong> {task.end_date?.replace('T', ' ').slice(0, 16)}</p>
        {/* New Status Field */}
        <p><strong>Status:</strong> {task.status}</p>

        {/* Approve and Reject Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="px-4 py-2 rounded bg-green-500 text-white"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
          <button
            onClick={handleReject}
            disabled={isRejecting}
            className="px-4 py-2 rounded bg-red-500 text-white"
          >
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
