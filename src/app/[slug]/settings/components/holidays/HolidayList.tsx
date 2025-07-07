'use client';
import React, { useState } from 'react';
import {
    useFetchHolidaysQuery,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
    useDeleteHolidaysBulkMutation,
} from '@/slices';
import HolidayForm from './HolidayForm';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import { FaPlus, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TableToolbar from '@/components/common/TableToolbar';
import LoadingState from '@/components/common/LoadingState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const HolidayList = () => {
    const { data, isLoading, error, refetch } = useFetchHolidaysQuery();
    const [createHoliday] = useCreateHolidayMutation();
    const [updateHoliday] = useUpdateHolidayMutation();
    const [deleteHoliday] = useDeleteHolidayMutation();
    const [deleteHolidaysBulk] = useDeleteHolidaysBulkMutation();

    const holidays = data?.data ?? [];
    const noHolidays = !isLoading && !error && holidays.length === 0;

    // Form and edit state
    const [showForm, setShowForm] = useState(false);
    const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);

    // Delete states
    const [deleteState, setDeleteState] = useState<{
        id: number | null;
        name: string;
        showDialog: boolean;
    }>({
        id: null,
        name: "",
        showDialog: false
    });

    // Bulk delete states
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [bulkType, setBulkType] = useState<('weekly' | 'monthly' | 'general')[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const openAddModal = () => {
        setEditHoliday(null);
        setShowForm(true);
    };

    const openEditModal = (holiday: Holiday) => {
        setEditHoliday(holiday);
        setShowForm(true);
    };

    const closeModal = () => {
        setEditHoliday(null);
        setShowForm(false);
    };

    const closeBulkDelete = () => {
        setShowBulkDelete(false);
        setBulkType([]);
        setSelectedIds([]);
    };

    const handleCreate = async (holiday: CreateHolidayPayload) => {
        try {
            await createHoliday(holiday).unwrap();
            toast.success('Holiday created successfully');
            closeModal();
            refetch();
        } catch (err) {
            toast.error('Failed to create holiday');
            console.error('Create holiday failed:', err);
        }
    };

    const handleUpdate = async (holiday: Omit<UpdateHolidayPayload, 'id'>) => {
        if (!editHoliday) return;
        try {
            await updateHoliday({ ...holiday, id: editHoliday.id }).unwrap();
            toast.success('Holiday updated successfully');
            closeModal();
            refetch();
        } catch (err) {
            toast.error('Failed to update holiday');
            console.error('Update holiday failed:', err);
        }
    };

    const promptDelete = (id: number, name: string) => {
        setDeleteState({
            id,
            name,
            showDialog: true
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteHoliday(id).unwrap();
            toast.success('Holiday deleted successfully');
            refetch();
        } catch (err) {
            toast.error('Failed to delete holiday');
            console.error('Delete holiday failed:', err);
        }
    };

    const confirmDelete = async () => {
        if (deleteState.id) {
            await handleDelete(deleteState.id);
            setDeleteState({
                id: null,
                name: "",
                showDialog: false
            });
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
            closeBulkDelete();
            await refetch();
        } catch (err) {
            toast.error('Failed to delete holidays');
            console.error('Bulk delete failed:', err);
        } finally {
            setIsBulkDeleting(false);
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
                        onClick={() => openEditModal(holiday)}
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="icon-button delete-button"
                        onClick={() => promptDelete(holiday.id, holiday.name)}
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="holiday-list">
            <TableToolbar
                actions={[
                    ...(holidays.length > 0
                        ? [
                            {
                                label: 'Bulk Delete',
                                icon: <FaTrash />,
                                onClick: () => setShowBulkDelete(true),
                            },
                            {
                                label: 'Add Holiday',
                                icon: <FaPlus />,
                                onClick: openAddModal,
                            },
                        ]
                        : []
                    )
                ]}
                introKey='holidays_intro'
            />

            <Modal
                isOpen={showForm}
                onClose={closeModal}
                title={editHoliday ? 'Edit Holiday' : 'Add Holiday'}
            >
                <HolidayForm
                    onSubmit={editHoliday ? handleUpdate : handleCreate}
                    onCancel={closeModal}
                    initialData={editHoliday || undefined}
                />
            </Modal>

            <ConfirmDialog
                isOpen={deleteState.showDialog}
                message={`Are you sure you want to delete the holiday "${deleteState.name}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteState({
                    id: null,
                    name: "",
                    showDialog: false
                })}
                type="delete"
            />

            <Modal
                isOpen={showBulkDelete}
                onClose={closeBulkDelete}
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
                        <button
                            className="buttons delete"
                            onClick={handleBulkDelete}
                            disabled={isBulkDeleting || bulkType.length === 0}
                        >
                            {isBulkDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button className="buttons cancel" onClick={closeBulkDelete}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {isLoading && <LoadingState />}

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
                        <button className="buttons" onClick={openAddModal} type="button">
                            <FaPlus /> Add Holiday
                        </button>
                    }
                />
            )}

            {holidays.length > 0 && (
                <ResponsiveTable
                    data={holidays}
                    columns={columns}
                    onEdit={(id) => {
                        const holiday = holidays.find(h => h.id === id);
                        if (holiday) openEditModal(holiday);
                    }}
                    onDelete={handleDelete}
                    cardView={(holiday: Holiday) => (
                        <>
                            <div className="card-row">
                                <h5>{holiday.name}</h5>
                                <p className="holiday-type">Type: {holiday.type}</p>
                            </div>
                            <div className="card-row">
                                <p>Day: {holiday.day}</p>
                                <p>Company ID: {holiday.company_id}</p>
                            </div>
                        </>
                    )}
                />
            )}
        </div>
    );
};

export default HolidayList;