'use client';
import React, { useState } from 'react';
import {
    useDeleteHolidayMutation,
    useUpdateHolidayMutation,
} from '@/slices';
import HolidayForm from './HolidayForm';

type Props = {
    holiday: Holiday;
};

const HolidayItem: React.FC<Props> = ({ holiday }) => {
    const [editMode, setEditMode] = useState(false);
    const [deleteHoliday] = useDeleteHolidayMutation();
    const [updateHoliday] = useUpdateHolidayMutation();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this holiday?')) {
            deleteHoliday(holiday.id);
        }
    };

    const handleUpdate = async (data: CreateHolidayPayload) => {
        try {
            await updateHoliday({ id: holiday.id, ...data }).unwrap();
            setEditMode(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className="holiday-item">
            {editMode ? (
                <HolidayForm
                    initialData={holiday}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditMode(false)}
                />
            ) : (
                <div className="holiday-details">
                    <p><strong>Name:</strong> {holiday.name}</p>
                    <p><strong>Type:</strong> {holiday.type}</p>

                    <div className="holiday-actions">
                        <button className="Edit-btn" onClick={() => setEditMode(true)}>Edit</button>
                        <button className="Delete-btn" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HolidayItem;
