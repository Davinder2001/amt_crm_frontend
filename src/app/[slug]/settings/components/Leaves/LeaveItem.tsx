'use client';
import React, { useState } from 'react';
import { useDeleteLeaveMutation, useUpdateLeaveMutation } from '@/slices/company/companyApi';
import LeaveForm from './LeaveForm';

type Props = {
    leave: Leave;
};

const LeaveItem: React.FC<Props> = ({ leave }) => {
    const [editMode, setEditMode] = useState(false);
    const [deleteLeave] = useDeleteLeaveMutation();
    const [updateLeave] = useUpdateLeaveMutation();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this leave?')) {
            deleteLeave(leave.id);
        }
    };

    const handleUpdate = async (data: CreateLeavePayload) => {
        try {
            await updateLeave({ id: leave.id, ...data }).unwrap();
            setEditMode(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className="leave-item">
            {editMode ? (
                <LeaveForm initialData={leave} onSubmit={handleUpdate} onCancel={() => setEditMode(false)} />
            ) : (
                <div className="leave-details">
                    <p><strong>Name:</strong> {leave.name}</p>
                    <p><strong>Type:</strong> {leave.type}</p>
                    <p><strong>Frequency:</strong> {leave.frequency}</p>
                    <p><strong>Count:</strong> {leave.count}</p>

                    <div className="leave-actions">
                        <button className="Edit-btn" onClick={() => setEditMode(true)}>Edit</button>
                        <button className="Delete-btn" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveItem;
