'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetTasksQuery, useUpdateTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchUsersQuery } from '@/slices/users/userApi'; // Import for fetching users
import { Task } from '@/slices/tasks/taskApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTask: React.FC = () => {
  const { id } = useParams();

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useGetTasksQuery();
  const { data: usersData, isLoading: usersLoading, error: usersError } = useFetchUsersQuery();

  const [updateTask, { isLoading: isUpdating, error: updateError }] = useUpdateTaskMutation();

  const [taskData, setTaskData] = useState<Partial<Task>>({
    name: '',
    assigned_to_name: '',
    deadline: '',
  });

  useEffect(() => {
    if (tasks && tasks.data) {
      const taskToEdit = tasks.data.find((t: Task) => t.id === Number(id));
      if (taskToEdit) {
        setTaskData({
          name: taskToEdit.name,
          assigned_to_name: taskToEdit.assigned_to_name,
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    console.log("Selected user:", newValue);
    setTaskData((prev) => ({
      ...prev,
      assigned_to_name: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedTask = await updateTask({ id: Number(id), ...taskData }).unwrap();
      console.log("Updated Task:", updatedTask);
      setTaskData({
        name: updatedTask.name,
        assigned_to_name: updatedTask.assigned_to_name,
        deadline: updatedTask.deadline,
      });
      toast.success('Task updated successfully');
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Error updating task');
    }
  };

  if (tasksLoading || usersLoading) return <p>Loading...</p>;
  if (tasksError) return <p>Error loading task details.</p>;
  if (usersError) return <p>Error loading users.</p>;

  return (
    <>
      <ToastContainer />
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
          <label htmlFor="assigned_to_name">Assigned To:</label>
          <select
            id="assigned_to_name"
            name="assigned_to_name"
            value={taskData.assigned_to_name || ''}
            onChange={handleSelectChange}
            required
          >
            <option value="">Select a user</option>
            {usersData?.users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
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
