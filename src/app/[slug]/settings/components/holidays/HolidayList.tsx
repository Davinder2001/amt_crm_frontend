'use client';
import React, { useState } from 'react';
import {
    useFetchHolidaysQuery,
    useCreateHolidayMutation,
} from '@/slices/company/companyApi';
import HolidayItem from './HolidayItem';
import HolidayForm from './HolidayForm';
import EmptyState from '@/components/common/EmptyState';
import { FaPlus, FaCalendar } from 'react-icons/fa';
import { Button } from '@mui/material';

const HolidayList = () => {
    const { data, isLoading, error, refetch } = useFetchHolidaysQuery();
    const [createHoliday] = useCreateHolidayMutation();
    const [showForm, setShowForm] = useState(false);

    const handleCreate = async (holiday: CreateHolidayPayload) => {
        try {
            await createHoliday(holiday).unwrap();
            setShowForm(false);
            refetch();
        } catch (e) {
            console.error('Failed to create holiday', e);
        }
    };

    const handleCancel = () => setShowForm(false);

    const noHolidays = !isLoading && !error && (!data?.data || data.data.length === 0);

    return (
        <div className="holiday-list">
            {!noHolidays && (
                <div className="add-holiday-btn">
                    <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm}>
                        Add Holiday
                    </button>
                </div>
            )}

            {showForm && (
                <div className="form-wrapper">
                    <HolidayForm onSubmit={handleCreate} onCancel={handleCancel} />
                </div>
            )}

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
                        <Button
                            className="buttons"
                            onClick={() => setShowForm(true)}
                            startIcon={<FaPlus />}
                        >
                            Add Holiday
                        </Button>
                    }
                />
            )}

            <div className="holiday-items">
                {Array.isArray(data?.data) &&
                    data.data.map((holiday) => (
                        <div key={holiday.id} className="holiday-item">
                            <HolidayItem holiday={holiday} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default HolidayList;
