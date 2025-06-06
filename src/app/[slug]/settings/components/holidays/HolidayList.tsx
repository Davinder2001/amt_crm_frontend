'use client';

import React, { useState } from 'react';
import {
    useFetchHolidaysQuery,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
} from '@/slices/company/companyApi';

import HolidayForm from './HolidayForm';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';

import { FaPlus, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

const HolidayList = () => {
    const { data, isLoading, error, refetch } = useFetchHolidaysQuery();
    const [createHoliday] = useCreateHolidayMutation();
    const [updateHoliday] = useUpdateHolidayMutation();
    const [deleteHoliday] = useDeleteHolidayMutation();

    const holidays = data?.data ?? [];

    const [showForm, setShowForm] = useState(false);
    const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);

    const handleCreate = async (holiday: CreateHolidayPayload) => {
        try {
            await createHoliday(holiday).unwrap();
            toast.success('Holiday created successfully');
            setShowForm(false);
            refetch();
        } catch {
            toast.error('Failed to create holiday');
        }
    };

    const handleUpdate = async (holiday: HolidayPayload) => {
        if (!editHoliday) return;
        try {
            await updateHoliday({ id: editHoliday.id, ...holiday }).unwrap();
            toast.success('Holiday updated successfully');
            setEditHoliday(null);
            refetch();
        } catch {
            toast.error('Failed to update holiday');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this holiday?')) return;
        try {
            await deleteHoliday(id).unwrap();
            toast.success('Holiday deleted successfully');
            refetch();
        } catch {
            toast.error('Failed to delete holiday');
        }
    };

    const columns = [
        { label: 'Name', key: 'name' as keyof Holiday },
        { label: 'Company Id', key: 'company_id' as keyof Holiday },
        { label: 'Date', key: 'date' as keyof Holiday },
        { label: 'Type', key: 'type' as keyof Holiday },
        {
            label: 'Actions',
            render: (holiday: Holiday) => (
                <div className="action-buttons">
                    <button
                        className="icon-button edit-button"
                        onClick={() => setEditHoliday(holiday)}
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="icon-button delete-button"
                        onClick={() => handleDelete(holiday.id)}
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const noHolidays = !isLoading && !error && holidays.length === 0;

    return (
        <div className="holiday-list">
            {!noHolidays && (
                <div className="add-holiday-btn">
                    <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm}>
                        Add Holiday
                    </button>
                </div>
            )}

            <Modal
                isOpen={showForm || editHoliday !== null}
                onClose={() => {
                    setShowForm(false);
                    setEditHoliday(null);
                }}
                title={showForm ? 'Add Holiday' : 'Edit Holiday'}
            >
                <HolidayForm
                    onSubmit={showForm ? handleCreate : handleUpdate}
                    onCancel={() => {
                        setShowForm(false);
                        setEditHoliday(null);
                    }}
                    initialData={editHoliday || undefined}
                />
            </Modal>

            {isLoading && <p>Loading holidays...</p>}

            {error && (
                <EmptyState
                    icon="alert"
                    title="Failed to load holidays"
                    message="Something went wrong while fetching holidays."
                />
            )}

            {noHolidays && !showForm && (
                <EmptyState
                    icon={<FaCalendar className="empty-state-icon" />}
                    title="No Holidays Found"
                    message="You haven't added any holidays yet."
                    action={
                        <Button className="buttons" onClick={() => setShowForm(true)} startIcon={<FaPlus />}>
                            Add Holiday
                        </Button>
                    }
                />
            )}

            {holidays.length > 0 && (
                <ResponsiveTable data={holidays} columns={columns} />
            )}
        </div>
    );
};

export default HolidayList;
