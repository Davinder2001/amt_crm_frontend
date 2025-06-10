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

    // Accepts CreateHolidayPayload to match HolidayForm's onSubmit type
    const handleUpdate = async (holiday: UpdateHolidayPayload) => {
        if (!editHoliday) return;
        try {
            await updateHoliday({ ...holiday, id: editHoliday.id }).unwrap();
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
        { label: 'Day', key: 'day' as keyof Holiday },
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
                <div className="add-holiday-leave-btn-wrapper">
                    <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm}>
                       <FaPlus/> Add Holiday
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
                    onSubmit={async (data) => {
                        if (showForm) {
                            await handleCreate(data);
                        } else {
                            await handleUpdate({ ...data, id: editHoliday!.id });
                        }
                    }}
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
                        <div className="add-holiday-action">

                        <button className="" onClick={() => setShowForm(true)}>
                          <FaPlus />  Add Holiday
                        </button>
                        </div>
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
