'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetSinglePredefinedTaskQuery, useUpdatePredefinedTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const EditRecurringTask: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();

    const { data: taskData, isLoading: taskLoading } = useGetSinglePredefinedTaskQuery(Number(id));
    const { data: usersData } = useFetchUsersQuery();
    const [updateTask, { isLoading }] = useUpdatePredefinedTaskMutation();

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

    useEffect(() => {
        if (taskData) {
            console.log('Fetched Task Data:', taskData);
            setFormData({
                name: taskData.name || '',
                description: taskData.description || '',
                assigned_to: String(taskData.assigned_to || ''),
                recurrence_type: taskData.recurrence_type || 'daily',
                recurrence_start_date: taskData.recurrence_start_date
                    ? new Date(taskData.recurrence_start_date).toISOString().split('T')[0]
                    : '',
                recurrence_end_date: taskData.recurrence_end_date
                    ? new Date(taskData.recurrence_end_date).toISOString().split('T')[0]
                    : '',
                notify: taskData.notify ?? true,
            });
        }
    }, [taskData]);

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
            await updateTask({
                id: Number(id),
                data: {
                    ...formData,
                    notify: formData.notify
                }
            }).unwrap();
            toast.success('Recurring task updated successfully!');
            router.push('/recurring-tasks');
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Failed to update recurring task');
        }
    };

    const renderField = (
        label: string,
        name: string,
        type = "text",
        placeholder = "",
        options?: { value: string, label: string }[]
    ) => {
        return (
            <div className="employee-field">
                <label htmlFor={name}>{label}</label>

                {type === 'date' ? (
                    <DatePicker
                        selected={
                            formData[name as keyof typeof formData]
                                ? new Date(formData[name as keyof typeof formData] as string)
                                : null
                        }
                        onChange={(date) => handleDateChange(date, name)}
                        dateFormat="yyyy-MM-dd"
                        className="date-input"
                        placeholderText={placeholder}
                    />
                ) : type === 'select' && options ? (
                    <select
                        name={name}
                        value={String(formData[name as keyof typeof formData] ?? '')}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
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

    if (taskLoading || !taskData) return <p>Loading task...</p>;

    return (
        <div className="add-employee-form recurring-wrapper">
            <h2>Edit Recurring Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="employee-fields-wrapper">
                    {renderField("Task Name", "name", "text", "Enter task name")}
                    {renderField("Description", "description", "text", "Enter description")}

                    {renderField("Assigned To", "assigned_to", "select", "",
                        usersData?.users?.map((user: { id: number, name: string }) => ({
                            value: String(user.id),
                            label: user.name
                        })) || []
                    )}

                    {renderField("Recurrence Type", "recurrence_type", "select", "", [
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' }
                    ])}

                    {renderField("Start Date", "recurrence_start_date", "date", "YYYY-MM-DD")}
                    {renderField("End Date", "recurrence_end_date", "date", "YYYY-MM-DD (optional)")}

                    <div className="form-group">
                        <label htmlFor="notify">Notification</label>
                        <button
                            type="button"
                            id="notify"
                            onClick={() =>
                                setFormData((prev) => ({ ...prev, notify: !prev.notify }))
                            }
                            className={`toggle-button ${formData.notify ? 'on' : 'off'}`}
                        >
                            {formData.notify ? 'ON 🔔' : 'OFF 🔕'}
                        </button>
                    </div>
                </div>

                <div className="create-employess-action">
                    <button className="form-button" type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Task"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRecurringTask;
