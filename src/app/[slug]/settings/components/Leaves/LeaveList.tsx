'use client';
import React, { useState } from 'react';
import {
    useFetchLeavesQuery,
    useCreateLeaveMutation,
} from '@/slices/company/companyApi';
import LeaveItem from './LeaveItem';
import LeaveForm from './LeaveForm';
import EmptyState from '@/components/common/EmptyState';
import { FaPlus, FaCalendar } from 'react-icons/fa';
import { Button } from '@mui/material';

const LeaveList = () => {
    const { data, isLoading, error, refetch } = useFetchLeavesQuery();
    const [createLeave] = useCreateLeaveMutation();
    const [showForm, setShowForm] = useState(false);

    const handleCreate = async (leave: CreateLeavePayload) => {
        try {
            await createLeave(leave).unwrap();
            setShowForm(false);
            refetch();
        } catch (e) {
            console.error('Failed to create leave', e);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const noLeaves = !isLoading && !error && (!data?.data || data.data.length === 0);

    return (
        <div className="leave-list">
            {!noLeaves && (
                <div className="add-leave-btn">
                    <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm}>
                        Add Leave
                    </button>
                </div>
            )}

            {showForm && (
                <div className="form-wrapper">
                    <LeaveForm onSubmit={handleCreate} onCancel={handleCancel} />
                </div>
            )}

            {isLoading && <p>Loading leaves...</p>}

            {error && (
                <EmptyState
                    icon="alert"
                    title="Failed to load leaves"
                    message="Something went wrong while fetching leaves."
                />
            )}

            {noLeaves && !showForm && (
                <EmptyState
                    icon={<FaCalendar className="empty-state-icon" />}
                    title="No Leaves Found"
                    message="You haven't added any leave policies yet."
                    action={
                        <Button
                            className="buttons"
                            onClick={() => setShowForm(true)}
                            startIcon={<FaPlus />}
                        >
                            Add Leave
                        </Button>
                    }
                />
            )}

            <div className="leave-items">
                {Array.isArray(data?.data) &&
                    data.data.map((leave) => (
                        <div key={leave.id} className="leave-item">
                            <LeaveItem leave={leave} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default LeaveList;
