'use client';

import React, { useState } from 'react';
import { useCreateTaskMutation } from '@/slices/tasks/taskApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchUsersQuery } from '@/slices/users/userApi'; // Adjust the import path as needed
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';

const Page: React.FC = () => {
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState(''); // Will store user id as string
  const [deadline, setDeadline] = useState('');
  const router = useRouter();
  const {companySlug} = useCompany();

  const [createTask, { isLoading, error }] = useCreateTaskMutation();
  const { data: usersData, isLoading: usersLoading, error: usersError } = useFetchUsersQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask = {
      name,
      assigned_to: Number(assignedTo),
      deadline,
    };

    try {
      await createTask(newTask).unwrap();
      toast.success('Task created successfully');
      setName('');
      setAssignedTo('');
      setDeadline('');
      router.push(`/${companySlug}/tasks`)
    } catch (err) {
      console.error('Failed to create task:', err);
      toast.error('Error creating task');
    }
  };

  return (
    <>
      <ToastContainer />
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Task Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="assignedTo">Assigned To:</label>
          {usersLoading ? (
            <p>Loading users...</p>
          ) : usersError ? (
            <p>Error loading users</p>
          ) : (
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Select a user</option>
              {usersData?.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Task...' : 'Add Task'}
        </button>
        {error && <p>Error: {JSON.stringify(error)}</p>}
      </form>
    </>
  );
};

export default Page;
