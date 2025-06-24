// 'use client';

// import React, { useState } from 'react';
// import {
//     useFetchHolidaysQuery,
//     useCreateHolidayMutation,
//     useUpdateHolidayMutation,
//     useDeleteHolidayMutation,
// } from '@/slices/company/companyApi';

// import HolidayForm from './HolidayForm';
// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import Modal from '@/components/common/Modal';
// import EmptyState from '@/components/common/EmptyState';

// import { FaPlus, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import ConfirmDialog from '@/components/common/ConfirmDialog';
// import TableToolbar from '@/components/common/TableToolbar';
// const HolidayList = () => {
//     const { data, isLoading, error, refetch } = useFetchHolidaysQuery();
//     const [createHoliday] = useCreateHolidayMutation();
//     const [updateHoliday] = useUpdateHolidayMutation();
//     const [deleteHoliday] = useDeleteHolidayMutation();

//     const holidays = data?.data ?? [];
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState<number | null>(null);
//     const [showForm, setShowForm] = useState(false);
//     const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);

//     const handleCreate = async (holiday: CreateHolidayPayload) => {
//         try {
//             await createHoliday(holiday).unwrap();
//             toast.success('Holiday created successfully');
//             setShowForm(false);
//             refetch();
//         } catch {
//             toast.error('Failed to create holiday');
//         }
//     };

//     // Accepts CreateHolidayPayload to match HolidayForm's onSubmit type
//     const handleUpdate = async (holiday: UpdateHolidayPayload) => {
//         if (!editHoliday) return;
//         try {
//             await updateHoliday({ ...holiday, id: editHoliday.id }).unwrap();
//             toast.success('Holiday updated successfully');
//             setEditHoliday(null);
//             refetch();
//         } catch {
//             toast.error('Failed to update holiday');
//         }
//     };

//     const handleDelete = (id: number) => {
//         setItemToDelete(id);
//         setShowDeleteConfirm(true);
//     };

//     const handleConfirmDelete = async () => {
//         if (itemToDelete !== null) {
//             try {
//                 await deleteHoliday(itemToDelete).unwrap();
//             } catch (error) {
//                 console.error("Failed to delete this Holiday:", error);
//             } finally {
//                 setShowDeleteConfirm(false);
//                 setItemToDelete(null);
//             }
//         }
//     };

//     const columns = [
//         { label: 'Name', key: 'name' as keyof Holiday },
//         { label: 'Company Id', key: 'company_id' as keyof Holiday },
//         { label: 'Day', key: 'day' as keyof Holiday },
//         { label: 'Type', key: 'type' as keyof Holiday },
//         {
//             label: 'Actions',
//             render: (holiday: Holiday) => (
//                 <div className="action-buttons">
//                     <button
//                         className="icon-button edit-button"
//                         onClick={() => setEditHoliday(holiday)}
//                         title="Edit"
//                     >
//                         <FaEdit />
//                     </button>
//                     <button
//                         className="icon-button delete-button"
//                         onClick={() => handleDelete(holiday.id)}
//                         title="Delete"
//                     >
//                         <FaTrash />
//                     </button>
//                 </div>
//             ),
//         },
//     ];

//     const noHolidays = !isLoading && !error && holidays.length === 0;

//     return (
//         <div className="holiday-list">

//             <TableToolbar
//                 actions={[
//                     {
//                         label: 'Add Holiday',
//                         icon: <FaPlus />,
//                         onClick: () => setShowForm(true),
//                     }
//                 ]}
//             />

//             <Modal
//                 isOpen={showForm || editHoliday !== null}
//                 onClose={() => {
//                     setShowForm(false);
//                     setEditHoliday(null);
//                 }}
//                 title={showForm ? 'Add Holiday' : 'Edit Holiday'}
//             >
//                 <HolidayForm
//                     onSubmit={async (data) => {
//                         if (showForm) {
//                             await handleCreate(data);
//                         } else {
//                             await handleUpdate({ ...data, id: editHoliday!.id });
//                         }
//                     }}
//                     onCancel={() => {
//                         setShowForm(false);
//                         setEditHoliday(null);
//                     }}
//                     initialData={editHoliday || undefined}
//                 />
//             </Modal>
//             <ConfirmDialog
//                 isOpen={showDeleteConfirm}
//                 message="Are you sure you want to delete this Holiday ?"
//                 onConfirm={handleConfirmDelete}
//                 onCancel={() => {
//                     setShowDeleteConfirm(false);
//                     setItemToDelete(null);
//                 }}
//                 type="delete"
//             />
//             {isLoading && <p>Loading holidays...</p>}

//             {error && (
//                 <EmptyState
//                     icon="alert"
//                     title="Failed to load holidays"
//                     message="Something went wrong while fetching holidays."
//                 />
//             )}

//             {noHolidays && !showForm && (
//                 <EmptyState
//                     icon={<FaCalendar className="empty-state-icon" />}
//                     title="No Holidays Found"
//                     message="You haven't added any holidays yet."
//                     action={
//                         <div className="add-holiday-action">

//                             <button className="buttons" onClick={() => setShowForm(true)}>
//                                 <FaPlus />  Add Holiday
//                             </button>
//                         </div>
//                     }
//                 />
//             )}

//             {holidays.length > 0 && (
//                 <ResponsiveTable data={holidays} columns={columns} cardViewKey='name' />
//             )}
//         </div>
//     );
// };

// export default HolidayList;

















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
import TableToolbar from '@/components/common/TableToolbar';

const HolidayList = () => {
    const { data, isLoading, error, refetch } = useFetchHolidaysQuery();
    const [createHoliday] = useCreateHolidayMutation();
    const [updateHoliday] = useUpdateHolidayMutation();
    const [deleteHoliday] = useDeleteHolidayMutation();

    const holidays = data?.data ?? [];

    const [showForm, setShowForm] = useState(false);
    const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);

    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRowCheckboxes, setShowRowCheckboxes] = useState(false);
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
        if (selectedIds.length === 0) {
            toast.info('No holidays selected');
            return;
        }
        try {
            await Promise.all(selectedIds.map(id => deleteHoliday(id).unwrap()));
            toast.success('Selected holidays deleted');
        } catch {
            toast.error('Failed to delete some holidays');
        } finally {
            setShowBulkSelectPopup(false);
            setSelectedIds([]);
            refetch();
        }
    };

    const handleBulkTypeCheckboxChange = (
        type: 'weekly' | 'monthly' | 'general',
        isChecked: boolean
    ) => {
        let newTypes: ('weekly' | 'monthly' | 'general')[] = [];
        if (isChecked) {
            newTypes = [...bulkType, type];
        } else {
            newTypes = bulkType.filter(t => t !== type);
        }
        setBulkType(newTypes);

        // Update selected IDs
        const ids = holidays
            .filter(h => newTypes.includes(h.type))
            .map(h => h.id);
        setSelectedIds(ids);

        // Show/hide row checkboxes based on selection
        setShowRowCheckboxes(newTypes.length > 0);
    };


    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const columns = [
        {
            label: '',
            render: (holiday: Holiday) =>
                showRowCheckboxes ? (
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(holiday.id)}
                        onChange={() => toggleSelect(holiday.id)}
                    />
                ) : null
        },

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
                    {
                        label: 'Add Holiday',
                        icon: <FaPlus />,
                        onClick: () => setShowForm(true),
                    },
                    {
                        label: 'Bulk Select & Delete',
                        icon: <FaTrash />,
                        onClick: () => setShowBulkSelectPopup(true)
                    }
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
                title="Bulk Select Holidays"
            >
                <div className="form-input-lable-wrapper">
                    <label>Select Types</label>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={bulkType.includes('weekly')}
                                onChange={(e) => handleBulkTypeCheckboxChange('weekly', e.target.checked)}
                            />
                            Weekly
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={bulkType.includes('monthly')}
                                onChange={(e) => handleBulkTypeCheckboxChange('monthly', e.target.checked)}
                            />
                            Monthly
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={bulkType.includes('general')}
                                onChange={(e) => handleBulkTypeCheckboxChange('general', e.target.checked)}
                            />
                            General
                        </label>
                    </div>
                </div>

                <p>{selectedIds.length} holidays selected for deletion.</p>
                <div className="popup-actions" style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                    <button className="buttons delete" onClick={handleBulkDelete}>Delete Selected</button>
                    <button className="buttons cancel" onClick={() => setShowBulkSelectPopup(false)}>Cancel</button>
                </div>
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
