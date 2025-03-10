'use client';

import React, { useState } from 'react';
import { useCreateTaskMutation } from '@/slices/tasks/taskApi';

const Page: React.FC = () => {
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');

  const [createTask, { isLoading, error }] = useCreateTaskMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask = {
      name,
      assigned_to: Number(assignedTo), 
      deadline, 
    };

    try {
      const result = await createTask(newTask).unwrap();
      setName('');
      setAssignedTo('');
      setDeadline('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <>
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
          <label htmlFor="assignedTo">Assigned To (User ID):</label>
          <input
            id="assignedTo"
            type="number"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          />
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
