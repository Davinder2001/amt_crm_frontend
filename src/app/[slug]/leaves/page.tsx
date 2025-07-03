'use client';
import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarTimes } from 'react-icons/fa';
import { useFetchBalanceLeaveQuery } from '@/slices/attendance/attendance';
import { useCompany } from '@/utils/Company';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';

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
  const { companySlug } = useCompany();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon="alert"
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
      <Link
        href={`/${companySlug}/attendence`}
        className="back-button inline-flex items-center gap-2 text-white bg-blue-600 px-3 py-1 rounded"
      >
        <FaArrowLeft size={16} />
      </Link>

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
          cardViewKey="leave_type"
        />
      )}
    </div>
  );
};

export default LeavesPage;
