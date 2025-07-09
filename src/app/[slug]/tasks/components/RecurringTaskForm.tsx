'use client';
import React, { useEffect, useState } from 'react';
import { useCreatePredefinedTaskMutation, useUpdatePredefinedTaskMutation, useGetSinglePredefinedTaskQuery } from '@/slices';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface RecurringTaskFormProps {
    mode: 'add' | 'edit';
    taskId?: number;
    onSuccess: () => void;
}

const RecurringTaskForm: React.FC<RecurringTaskFormProps> = ({ mode, taskId, onSuccess }) => {

    const [createTask, { isLoading: isCreating }] = useCreatePredefinedTaskMutation();
    const [updateTask, { isLoading: isUpdating }] = useUpdatePredefinedTaskMutation();
    const { data: usersData } = useFetchUsersQuery();
    const { data: taskData, isLoading: taskLoading } = useGetSinglePredefinedTaskQuery(Number(taskId!), {
        skip: mode === 'add' || !taskId,
    });

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
        if (mode === 'edit' && taskData?.task) {
            const task = taskData.task;
            setFormData({
                name: task.name || '',
                description: task.description || '',
                assigned_to: String(task.assigned_to || ''),
                recurrence_type: task.recurrence_type || 'daily',
                recurrence_start_date: task.recurrence_start_date
                    ? new Date(task.recurrence_start_date).toISOString().split('T')[0]
                    : '',
                recurrence_end_date: task.recurrence_end_date
                    ? new Date(task.recurrence_end_date).toISOString().split('T')[0]
                    : '',
                notify: !!task.notify,
            });
        }
    }, [taskData, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDateChange = (date: Date | null, fieldName: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: date ? date.toISOString().split('T')[0] : '',
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            if (mode === 'add') {
                await createTask(formData).unwrap();
                toast.success('Recurring task created successfully!');
            } else {
                await updateTask({
                    id: Number(taskId),
                    data: formData,
                }).unwrap();
                toast.success('Recurring task updated successfully!');
            }
            onSuccess();
        } catch (err) {
            console.error('Task error:', err);
            toast.error(`Failed to ${mode === 'add' ? 'create' : 'update'} task`);
        }
    };

    const renderField = (
        label: string,
        name: string,
        type = 'text',
        placeholder = '',
        options?: { value: string; label: string }[]
    ) => (
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
                    value={String(formData[name as keyof typeof formData])}
                    onChange={handleChange}
                >
                    <option value="">{placeholder || 'Select'}</option>
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

    if (mode === 'edit' && taskLoading) return <p>Loading task...</p>;

    return (
        <div className="recurring-wrapper dsdsd">
            <form onSubmit={handleSubmit}>
                <div className="employee-fields-wrapper">
                    {renderField('Task Name', 'name', 'text', 'Enter task name')}
                    {renderField('Description', 'description', 'text', 'Enter description')}
                    {renderField(
                        'Assigned To',
                        'assigned_to',
                        'select',
                        'Select user',
                        usersData?.users?.map((user: { id: number; name: string }) => ({
                            value: String(user.id),
                            label: user.name,
                        })) || []
                    )}
                    {renderField('Recurrence Type', 'recurrence_type', 'select', 'Select recurrence type', [
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                    ])}
                    {renderField('Start Date', 'recurrence_start_date', 'date', 'Select start date')}
                    {renderField('End Date', 'recurrence_end_date', 'date', 'Select end date')}

                    <div className="form-group">
                        <label htmlFor="notify">Notification</label>
                        <button
                            type="button"
                            id="notify"
                            onClick={() => setFormData(prev => ({ ...prev, notify: !prev.notify }))}
                            className={`toggle-button ${formData.notify ? 'on' : 'off'}`}
                        >
                            {formData.notify ? 'ON 🔔' : 'OFF 🔕'}
                        </button>
                    </div>
                </div>

                <div className="create-employess-action">
                    <button className="form-button" type="submit" disabled={isCreating || isUpdating}>
                        {isCreating || isUpdating
                            ? mode === 'add'
                                ? 'Adding...'
                                : 'Updating...'
                            : mode === 'add'
                                ? 'Add Task'
                                : 'Update Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecurringTaskForm;
