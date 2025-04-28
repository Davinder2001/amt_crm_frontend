'use client';
import React, { useState } from 'react';
import { useCreatePredefinedTaskMutation } from '@/slices/tasks/taskApi';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [createTask, { isLoading }] = useCreatePredefinedTaskMutation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assigned_by: '',
    assigned_to: '',
    company_id: '',
    recurrence_type: 'daily',
    recurrence_start_date: '',
    recurrence_end_date: '',
    notify: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(formData).unwrap();
      router.push('/recurring-tasks');
    } catch (error) {
      console.error('Creation failed', error);
    }
  };

  return (
    <div className="Recurring-form-wrapper">
      <h2>Create Recurring Task</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input name="name" placeholder="Task Name" value={formData.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="assigned_by" placeholder="Assigned By (User ID)" value={formData.assigned_by} onChange={handleChange} required />
        <input name="assigned_to" placeholder="Assigned To (User ID)" value={formData.assigned_to} onChange={handleChange} required />
        <input name="company_id" placeholder="Company ID" value={formData.company_id} onChange={handleChange} required />

        <select name="recurrence_type" value={formData.recurrence_type} onChange={handleChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <input type="date" name="recurrence_start_date" value={formData.recurrence_start_date} onChange={handleChange} required />
        <input type="date" name="recurrence_end_date" value={formData.recurrence_end_date} onChange={handleChange} />

        <label>
          <input type="checkbox" name="notify" checked={formData.notify} onChange={handleChange} /> Notify
        </label>

        <button type="submit" className='buttons' disabled={isLoading}>Create</button>
      </form>

    </div>
  );
};

export default Page;
