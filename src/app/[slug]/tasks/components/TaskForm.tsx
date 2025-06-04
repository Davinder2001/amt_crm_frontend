// src/app/[slug]/tasks/TaskForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCreateTaskMutation, useUpdateTaskMutation, useGetTasksQuery } from '@/slices/tasks/taskApi';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';

interface TaskFormProps {
    mode: 'add' | 'edit';
    taskId?: number;
    onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ mode, taskId, onSuccess }) => {
    const { data: usersData } = useFetchUsersQuery();
    const { data: tasksData } = useGetTasksQuery();
    const { refetch: refetchNotifications } = useFetchNotificationsQuery();
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

    const [formData, setFormData] = useState({
        name: '',
        assignedTo: '',
        role: '',
        startDate: '',
        endDate: '',
        notify: true,
        description: '',
    });

    // Load task data in edit mode
    useEffect(() => {
        if (mode === 'edit' && taskId && tasksData?.data) {
            const taskToEdit = tasksData.data.find((t) => t.id === Number(taskId));
            if (taskToEdit) {
                const convertToDatetimeLocal = (dateStr: string) => {
                    const [day, month, year] = dateStr.split('-');
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00`;
                };

                setFormData({
                    name: taskToEdit.name || '',
                    assignedTo: String(taskToEdit.assigned_to_id || ''),
                    role: taskToEdit.assigned_role || '',
                    startDate: taskToEdit.start_date ? convertToDatetimeLocal(taskToEdit.start_date) : '',
                    endDate: taskToEdit.end_date ? convertToDatetimeLocal(taskToEdit.end_date) : '',
                    notify: taskToEdit.notify ?? true,
                    description: taskToEdit.description || '',
                });
            }
        }
    }, [mode, taskId, tasksData]);

    // Update role when assignedTo changes
    useEffect(() => {
        if (formData.assignedTo && Array.isArray(usersData?.users) && usersData.users.length) {
            const selectedUser = usersData.users.find(
                (user) => user.id.toString() === formData.assignedTo
            );
            if (selectedUser) {
                const roleName = Array.isArray(selectedUser.roles) && selectedUser.roles[0]?.name
                    ? selectedUser.roles[0].name
                    : String(selectedUser.roles || '');
                setFormData((prev) => ({
                    ...prev,
                    role: roleName,
                }));
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

        const taskData = {
            name: formData.name,
            assigned_to: formData.assignedTo,
            assigned_role: formData.role,
            start_date: formData.startDate,
            end_date: formData.endDate,
            notify: formData.notify,
            description: formData.description,
        };

        try {
            if (mode === 'add') {
                await createTask(taskData).unwrap();
                toast.success('Task created successfully');
            } else if (mode === 'edit' && taskId) {
                await updateTask({ id: taskId, ...taskData }).unwrap();
                toast.success('Task updated successfully');
            }

            refetchNotifications();
            onSuccess();
        } catch (err) {
            console.error(`Failed to ${mode} task:`, err);
            toast.error(`Error ${mode === 'add' ? 'creating' : 'updating'} task`);
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="add-task-form">
                <div className="form-group">
                    <label>Task Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter task name"
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
                        {Array.isArray(usersData?.users) && usersData.users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Assign Task to Role</label>
                    <input type="text" value={formData.role} readOnly placeholder="" />
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
                        className="datetime-local-input"
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
                        onClick={() => setFormData((prev) => ({ ...prev, notify: !prev.notify }))}
                        className={`toggle-button buttons ${formData.notify ? 'on' : 'off'}`}
                    >
                        {formData.notify ? 'ON 🔔' : 'OFF 🔕'}
                    </button>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onSuccess} className="cancel-button buttons">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={mode === 'add' ? isCreating : isUpdating}
                        className="save-button buttons"
                    >
                        {mode === 'add'
                            ? (isCreating ? 'Saving...' : 'Save')
                            : (isUpdating ? 'Updating...' : 'Update Task')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm;