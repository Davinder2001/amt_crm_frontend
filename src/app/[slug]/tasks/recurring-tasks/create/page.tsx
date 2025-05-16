'use client';
import React, { useState } from 'react';
import { useCreatePredefinedTaskMutation } from '@/slices/tasks/taskApi';
import { useRouter } from 'next/navigation';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateRecurringTask: React.FC = () => {
  const [createTask, { isLoading }] = useCreatePredefinedTaskMutation();
  const { data: usersData } = useFetchUsersQuery();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assigned_to: '',
    recurrence_type: 'daily',
    recurrence_start_date: '',
    recurrence_end_date: '',
    notify: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date: Date | null, fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createTask(formData).unwrap();
      toast.success("Recurring task created successfully!");
      router.push('/recurring-tasks');
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Failed to create recurring task");
    }
  };

  const renderField = (label: string, name: string, type = "text", placeholder = "", options?: { value: string, label: string }[]) => {
    return (
      <div className="employee-field">
        <label htmlFor={name}>{label}</label>

        {type === 'date' ? (
          <DatePicker
            selected={typeof formData[name as keyof typeof formData] === 'string' && formData[name as keyof typeof formData] ? new Date(formData[name as keyof typeof formData] as string) : null}
            onChange={(date) => handleDateChange(date, name)}
            dateFormat="yyyy-MM-dd"
            placeholderText={placeholder}
            className="date-input"
          />
        ) : type === 'select' && options ? (
          <select
            name={name}
            value={String(formData[name as keyof typeof formData])}
            onChange={handleChange}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <input
            type="checkbox"
            name={name}
            checked={formData[name as keyof typeof formData] as boolean}
            onChange={handleChange}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleChange}
            placeholder={placeholder}
          />
        )}

        {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
      </div>
    );
  };

  return (
    <div className="add-employee-form recurring-wrapper">
      <h2>Create Recurring Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="employee-fields-wrapper">
          {renderField("Task Name", "name", "text", "Enter task name")}
          {renderField("Description", "description", "text", "Enter description")}

          {renderField("Assigned To", "assigned_to", "select", "",
            usersData?.users?.map((user: { id: number; name: string }) => ({
              value: String(user.id),
              label: user.name
            })) || []
          )}

          {renderField("Recurrence Type", "recurrence_type", "select", "", [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' }
          ])}

          {renderField("Start Date", "recurrence_start_date", "date", "YYY-MM-DD")}
          {renderField("End Date", "recurrence_end_date", "date", "YYY-MM-DD (optional)")}


          <div className="form-group">
            <label htmlFor="notify">Notification</label>
            <button
              type="button"
              id="notify"
              onClick={() =>
                setFormData((prev) => ({ ...prev, notify: !prev.notify }))
              }
              className={`toggle-button  ${formData.notify ? 'on' : 'off'}`}
            >
              {formData.notify ? 'ON 🔔' : 'OFF 🔕'}
            </button>
          </div>


        </div>

        <div className="create-employess-action">
          <button className="form-button" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecurringTask;