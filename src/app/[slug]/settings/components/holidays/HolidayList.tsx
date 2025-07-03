'use client';
import React, { useState } from 'react';
import {
    useFetchHolidaysQuery,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
    useDeleteHolidaysBulkMutation,
} from '@/slices/company/companyApi';

import HolidayForm from './HolidayForm';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';

import { FaPlus, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TableToolbar from '@/components/common/TableToolbar';
import LoadingState from '@/components/common/LoadingState';

const HolidayList = () => {
    const { data, isLoading, error, refetch } = useFetchHolidaysQuery();
    const [createHoliday] = useCreateHolidayMutation();
    const [updateHoliday] = useUpdateHolidayMutation();
    const [deleteHoliday] = useDeleteHolidayMutation();
    const [deleteHolidaysBulk] = useDeleteHolidaysBulkMutation();

    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const holidays = data?.data ?? [];

    const [showForm, setShowForm] = useState(false);
    const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);

    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [, setShowRowCheckboxes] = useState(false);
    const closeBulkPopup = () => {
        setShowBulkSelectPopup(false);
        setBulkType([]);
        setSelectedIds([]);
        setShowRowCheckboxes(false);
    };

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showBulkSelectPopup, setShowBulkSelectPopup] = useState(false);
    const [bulkType, setBulkType] = useState<('weekly' | 'monthly' | 'general')[]>([]);


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

    const handleDelete = (id: number) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete !== null) {
            try {
                await deleteHoliday(itemToDelete).unwrap();
                toast.success('Holiday deleted');
            } catch {
                toast.error('Failed to delete holiday');
            } finally {
                setShowDeleteConfirm(false);
                setItemToDelete(null);
                refetch();
            }
        }
    };

    const handleBulkDelete = async () => {
        if (bulkType.length === 0) {
            toast.info('Please select a holiday type');
            return;
        }

        setIsBulkDeleting(true);
        try {
            await deleteHolidaysBulk({ type: bulkType[0] }).unwrap();
            toast.success(`Deleted ${bulkType[0]} holidays successfully`);
        } catch {
            toast.error('Failed to delete holidays');
        } finally {
            setIsBulkDeleting(false);
            closeBulkPopup();
            await refetch();
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
            <TableToolbar
                actions={[
                    ...(holidays.length > 0
                        ? [
                            {
                                label: 'Bulk Select & Delete',
                                icon: <FaTrash />,
                                onClick: () => setShowBulkSelectPopup(true),
                            },
                            {
                                label: 'Add Holiday',
                                icon: <FaPlus />,
                                onClick: () => setShowForm(true),
                            },
                        ]
                        : []
                    )
                ]}
            />



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

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                }}
                title="Confirm Delete"
            >
                <p>Are you sure you want to delete this holiday?</p>
                <div className="popup-actions" style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                    <button className="buttons delete" onClick={handleConfirmDelete}>Delete</button>
                    <button className="buttons cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                </div>
            </Modal>

            <Modal
                isOpen={showBulkSelectPopup}
                onClose={closeBulkPopup}
                title="Bulk Delete Holidays"
            >
                <div className="bulk-delete-popup">
                    <div className="form-group">
                        <label htmlFor="bulk-type-select">Select Holiday Type</label>
                        <select
                            id="bulk-type-select"
                            value={bulkType[0] || ''}
                            onChange={(e) => {
                                const value = e.target.value as 'weekly' | 'monthly' | 'general';
                                setBulkType(value ? [value] : []);
                                const ids = holidays
                                    .filter(h => h.type === value)
                                    .map(h => h.id);
                                setSelectedIds(ids);
                            }}
                        >
                            <option value="">-- Select Type --</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <p className="selection-info">
                        {selectedIds.length} holidays selected.
                    </p>

                    <div className="popup-actions">
                        <button className="btn delete" onClick={handleBulkDelete} disabled={isBulkDeleting}>
                            {isBulkDeleting ? 'Deleting...' : 'Delete'}
                        </button>

                        <button className="btn cancel" onClick={closeBulkPopup}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>


            {isLoading && <LoadingState/>}

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
                            <button className="buttons" onClick={() => setShowForm(true)}>
                                <FaPlus /> Add Holiday
                            </button>
                        </div>
                    }
                />
            )}

            {holidays.length > 0 && (
                <ResponsiveTable data={holidays} columns={columns} cardViewKey="name" />
            )}
        </div>
    );
};

export default HolidayList;
