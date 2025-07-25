'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCreateTaskMutation, useUpdateTaskMutation, useFetchNotificationsQuery } from '@/slices';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import DatePickerField from '@/components/common/DatePickerField';

interface TaskFormProps {
    mode: 'add' | 'edit';
    taskId?: number;
    onSuccess: () => void;
    tasksData?: TasksResponse;
}

interface FormState {
    name: string;
    assignedTo: string;
    role: string;
    startDate: Date | null;
    endDate: Date | null;
    notify: boolean;
    description: string;
    attachments: File[];
}

const TaskForm: React.FC<TaskFormProps> = ({ mode, taskId, onSuccess, tasksData }) => {
    const { data: usersData } = useFetchUsersQuery();
    const { refetch: refetchNotifications } = useFetchNotificationsQuery();
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

    const [formData, setFormData] = useState<FormState>({
        name: '',
        assignedTo: '',
        role: '',
        startDate: null,
        endDate: null,
        notify: true,
        description: '',
        attachments: [],
    });

    const toBackendDate = (date: Date | null): string =>
        date ? date.toISOString() : '';

    useEffect(() => {
        if (mode === 'edit' && taskId && tasksData?.tasks) {
            const taskToEdit = tasksData.tasks.find((t) => t.id === Number(taskId));
            if (taskToEdit) {
                setFormData({
                    name: taskToEdit.name || '',
                    assignedTo: String(taskToEdit.assigned_to_id || ''),
                    role: taskToEdit.assigned_role || '',
                    startDate: taskToEdit.start_date ? new Date(taskToEdit.start_date) : null,
                    endDate: taskToEdit.end_date ? new Date(taskToEdit.end_date) : null,
                    notify: taskToEdit.notify ?? true,
                    description: taskToEdit.description || '',
                    attachments: [],
                });
            }
        }
    }, [mode, taskId, tasksData]);

    useEffect(() => {
        if (formData.assignedTo && Array.isArray(usersData?.users)) {
            const selectedUser = usersData.users.find(
                (user) => user.id.toString() === formData.assignedTo
            );
            if (selectedUser) {
                const roleName =
                    Array.isArray(selectedUser.roles) && selectedUser.roles[0]?.name
                        ? selectedUser.roles[0].name
                        : String(selectedUser.roles || '');
                setFormData((prev) => ({
                    ...prev,
                    role: roleName,
                }));
            }
        }
    }, [formData.assignedTo, usersData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (selectedFiles.length > 6) {
            toast.error('You can only select up to 6 files.');
            // Clear the input so user can reselect
            e.target.value = '';
            return;
        }

        setFormData((prev) => ({
            ...prev,
            attachments: selectedFiles,
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('assigned_to', formData.assignedTo);
        payload.append('assigned_role', formData.role);
        payload.append('start_date', toBackendDate(formData.startDate));
        payload.append('end_date', toBackendDate(formData.endDate));
        payload.append('notify', formData.notify ? 'true' : 'false');
        payload.append('description', formData.description);

        formData.attachments.forEach((file) => {
            payload.append('attachments[]', file);
        });

        try {
            if (mode === 'add') {
                await createTask(payload).unwrap();
                toast.success('Task created successfully');
            } else if (mode === 'edit' && taskId) {
                await updateTask({ id: taskId, formData: payload }).unwrap();
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
                        {Array.isArray(usersData?.users) &&
                            usersData.users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="form-group task-field-hide">
                    <label>Assign Task to Role</label>
                    <input type="text" value={formData.role} readOnly />
                </div>

                <div className="form-group">
                    <DatePickerField
                        label="Start Date"
                        selectedDate={formData.startDate ? formData.startDate.toISOString() : null}
                        onChange={(date: string) =>
                            setFormData((prev) => ({
                                ...prev,
                                startDate: date ? new Date(date) : null,
                            }))
                        }
                        minDate={new Date()}
                        placeholder="Select end date and time"
                    />
                </div>
                <div className="form-group">
                    <DatePickerField
                        label="End Date"
                        selectedDate={formData.endDate ? formData.endDate.toISOString() : null}
                        onChange={(date: string) =>
                            setFormData((prev) => ({
                                ...prev,
                                endDate: date ? new Date(date) : null,
                            }))
                        }
                        minDate={new Date()}
                        placeholder="Select end date and time"
                    />
                </div>

                <div className="form-group">
                    <label>Upload Attachments (Images/Videos)</label>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={formData.attachments.length >= 6}
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
                    <button
                        type="button"
                        onClick={onSuccess}
                        className="cancel-button buttons cancel-btn"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={mode === 'add' ? isCreating : isUpdating}
                        className="save-button buttons"
                    >
                        {mode === 'add'
                            ? isCreating
                                ? 'Saving...'
                                : 'Save'
                            : isUpdating
                                ? 'Updating...'
                                : 'Update Task'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm;
