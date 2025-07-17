'use client';
import React from 'react';
import { FaCalendarTimes } from 'react-icons/fa';
import { useFetchBalanceLeaveQuery } from '@/slices';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';
import { FaTriangleExclamation } from 'react-icons/fa6';

type Leave = {
  id: number;
  leave_type: string;
  leave_id: number;
  frequency: string;
  total_allowed: number;
  used: number;
  remaining: number;
};

const LeavesPage = () => {
  const { data, isLoading, isError } = useFetchBalanceLeaveQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to load leave balances"
        message="Something went wrong while fetching leave data. Please try again later."
      />
    );
  }

  const leavesWithId = data.leaves.map((leave: Omit<Leave, 'id'>) => ({
    ...leave,
    id: leave.leave_id,
  }));

  const noLeaves = leavesWithId.length === 0;

  const columns = [
    { label: 'Leave Type', key: 'leave_type' as keyof Leave },
    { label: 'Frequency', key: 'frequency' as keyof Leave },
    { label: 'Total Allowed', key: 'total_allowed' as keyof Leave },
    { label: 'Used', key: 'used' as keyof Leave },
    { label: 'Remaining', key: 'remaining' as keyof Leave },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">

      {noLeaves ? (
        <EmptyState
          icon={<FaCalendarTimes className="empty-state-icon" />}
          title="No Leave Records Found"
          message="You have no leave data available at the moment."
        />
      ) : (
        <ResponsiveTable
          data={leavesWithId}
          columns={columns}
        />
      )}
    </div>
  );
};

export default LeavesPage;
