'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTasksQuery, useUpdateTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import { Task } from '@/slices/tasks/taskApi';

const EditTask: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useFetchProfileQuery();

  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useGetTasksQuery();

  const [updateTask, { isLoading: isUpdating, error: updateError }] =
    useUpdateTaskMutation();

  const [taskData, setTaskData] = useState<Partial<Task>>({
    name: '',
    assigned_to: undefined,
    deadline: '',
  });

  useEffect(() => {
    if (tasks) {
      const taskToEdit = tasks.find((t: Task) => t.id === Number(id));
      if (taskToEdit) {
        setTaskData({
          name: taskToEdit.name,
          assigned_to: taskToEdit.assigned_to,
          deadline: taskToEdit.deadline,
        });
      }
    }
  }, [tasks, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateTask({ id: Number(id), ...taskData }).unwrap();
      router.push(`/${profile?.user?.company_slug}/tasks`);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (profileLoading || tasksLoading) return <p>Loading...</p>;
  if (profileError) return <p>Error loading profile.</p>;
  if (tasksError) return <p>Error loading task details.</p>;

  return (
    <>
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Task Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={taskData.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="assigned_to">Assigned To (User ID):</label>
          <input
            id="assigned_to"
            name="assigned_to"
            type="number"
            value={taskData.assigned_to || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={taskData.deadline || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Task'}
        </button>
        {updateError && <p>Error updating task.</p>}
      </form>
    </>
  );
};

export default EditTask;
