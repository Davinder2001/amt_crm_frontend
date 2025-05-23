'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCompany } from '@/utils/Company';
import { useCreateTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { FaArrowLeft } from 'react-icons/fa';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';

const Page: React.FC = () => {
  const router = useRouter();
  const { companySlug } = useCompany();

  const [formData, setFormData] = useState({
    name: '',
    assignedTo: '',
    role: '',
    startDate: '',
    endDate: '',
    notify: true,
    description: '',
  });

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: usersData } = useFetchUsersQuery();
  const {refetch: refetchNotifications} = useFetchNotificationsQuery();

  useEffect(() => {
    if (formData.assignedTo && Array.isArray(usersData?.users) && usersData.users.length) {
      const selectedUser = usersData.users.find(
        (user: { id: { toString: () => string; }; }) => user.id.toString() === formData.assignedTo
      );
      if (selectedUser && Array.isArray(selectedUser.roles) && selectedUser.roles.length > 0) {
        const userRole = selectedUser.roles[0].name || '';
        setFormData((prev) => ({ ...prev, role: userRole }));
      } else {
        setFormData((prev) => ({ ...prev, role: '' }));
      }
    }
  }, [formData.assignedTo, usersData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask = {
      name: formData.name,
      assigned_to: formData.assignedTo,
      assigned_role: formData.role,
      start_date: formData.startDate,
      end_date: formData.endDate,
      notify: formData.notify,
      description: formData.description,
    };

    try {

      const www = await createTask(newTask).unwrap();
      toast.success('Task created successfully');
      router.push(`/${companySlug}/employee/tasks`);
      refetchNotifications();
      console.log('werewrwerffwewer', www)
    } catch (err) {
      console.error('Failed to create task:', err);
      toast.error('Error creating task');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <button
        onClick={() => router.back()}
        className="back-button"
      >
        <FaArrowLeft size={20} color="#fff" />
      </button>
      <div className="add-task-form">
        <div className="form-group">
          <label> Task Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter task name'
            required
          />
        </div>

        <div className="form-group">
          <label>Assign Task To</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select a user</option>
            {Array.isArray(usersData?.users) && usersData.users.map((user: UserProfile) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Assign Task to Role</label>
          <input type="text" value={formData.role} readOnly placeholder='' />
        </div>

        <div className="form-group">
          <label>Start Timing</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Timing</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className='datetime-local-input'
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Write description for the task"
          />
        </div>

        <div className="form-group">
          <label>Notification</label>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, notify: !prev.notify }))
            }
            className={`toggle-button buttons ${formData.notify ? 'on' : 'off'}`}
          >
            {formData.notify ? 'ON 🔔' : 'OFF 🔕'}
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => router.back()} className="cancel-button buttons ">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="save-button buttons">
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Page;
