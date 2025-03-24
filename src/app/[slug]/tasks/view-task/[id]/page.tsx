'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetTasksQuery } from '@/slices/tasks/taskApi';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

function Page() {

  const { id } = useParams(); // Get the dynamic ID from the URL
  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    setTitle(`View Task`); // Update breadcrumb title
  }, [setTitle]);



  const { data: tasks } = useGetTasksQuery();


  // Find the task with the matching ID
  const task = tasks?.data.find((task) => task.id.toString() === id);

  if (!task) {
    return <div>No task found with ID: {id}</div>;
  }

  return (
    <div>
      <div className="task">
        <h2>Task Name: {task.name}</h2>
        <p>Assigned by: {task.assigned_by_name}</p>
        <p>Assigned to: {task.assigned_to_name}</p>
        <p>Company ID: {task.company_name}</p>
        <p>Deadline: {task.deadline}</p>
      </div>
    </div>
  );
}

export default Page;
