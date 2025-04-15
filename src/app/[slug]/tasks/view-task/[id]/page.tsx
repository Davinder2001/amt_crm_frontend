'use client';

import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetTasksQuery } from '@/slices/tasks/taskApi';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

function Page() {
  const { id } = useParams(); // Dynamic route param
  const { setTitle } = useBreadcrumb();

  const { data: tasks } = useGetTasksQuery();

  useEffect(() => {
    setTitle(`View Task`);
  }, [setTitle]);

  // Find the task by ID
  const task = tasks?.data.find((task) => task.id.toString() === id);

  if (!task) {
    return <div>No task found with ID: {id}</div>;
  }

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
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Notification:</strong> {task.notify ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Attachment:</strong> {
          task.attachment_url
            ? <a href={task.attachment_url} target="_blank" rel="noopener noreferrer">Download</a>
            : 'No attachment'
        }</p>
        <p><strong>Created At:</strong> {task.created_at.replace('T', ' ').slice(0, 16)}</p>
        <p><strong>Updated At:</strong> {task.updated_at.replace('T', ' ').slice(0, 16)}</p>
      </div>
    </div>
  );
}

export default Page;
