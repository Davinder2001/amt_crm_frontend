'use client';

import React, { useState, useEffect } from 'react';
import { useCreateTaskMutation } from '@/slices/tasks/taskApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { useFetchProfileQuery } from '@/slices/auth/authApi';

const Page: React.FC = () => {
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [role, setRole] = useState('');
  const [notify, setNotify] = useState(true);

  const router = useRouter();
  const { companySlug } = useCompany();

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: usersData } = useFetchUsersQuery();
  const { data: profileData } = useFetchProfileQuery();

  useEffect(() => {
    if (assignedTo && usersData?.users.length) {
      const selectedUser = usersData.users.find((user) => user.id.toString() === assignedTo);
      if (selectedUser) {
        const userRole = selectedUser.roles?.[0]?.name || '';
        setRole(userRole);
      }
    }
  }, [assignedTo, usersData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask = {
      name,
      assigned_to: Number(assignedTo),
      assigned_role: role,
      start_date: startDate,
      end_date: endDate,
      notify,
    };

    try {
      await createTask(newTask).unwrap();
      toast.success('Task created successfully');
      router.push(`/${companySlug}/tasks`);
    } catch (err) {
      console.error('Failed to create task:', err);
      toast.error('Error creating task');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">

        <div className="form-group">
          <label>Employee Name</label>
          <input type="text" value={profileData?.user?.name || ''} readOnly />
        </div>

        <div className="form-group">
          <label>Employee Role</label>
          <input type="text" value={profileData?.user?.roles?.[0]?.name || ''} readOnly />
        </div>

        <div className="form-group">
          <label>Assign Task Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Assign Task To</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
            <option value="">Select a user</option>
            {usersData?.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Assign Task to Role</label>
          <input type="text" value={role} readOnly />
        </div>

        <div className="form-group">
          <label>Start Timing</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Timing</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Notification</label>
          <button
            type="button"
            onClick={() => setNotify(!notify)}
            className={`toggle-button ${notify ? 'on' : 'off'}`}
          >
            {notify ? 'ON 🔔' : 'OFF 🔕'}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={() => router.back()} className="cancel-button">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="save-button">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default Page;
