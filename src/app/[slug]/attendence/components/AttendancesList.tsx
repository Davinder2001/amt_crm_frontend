'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchAttenancesQuery, Attendance } from '@/slices/attendance/attendance';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaEye } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const AttendancesList: React.FC = () => {
  const router = useRouter();
  const { data: attendanceData, error, isLoading } = useFetchAttenancesQuery();

  const attendanceList: Attendance[] = attendanceData?.attendances ?? [];

  if (isLoading) return <p>Loading attendances...</p>;
  if (error) return <p>Error fetching attendances.</p>;
  if (attendanceList.length === 0) return <p>No attendances found.</p>;

  const update = (attendance: Attendance) => {
    router.push(`/attendance/edit/${attendance.id}`);
  };

  const view = (attendance: Attendance) => {
    router.push(`/attendance/view/${attendance.id}`);
  };

  const columns: {
    label: string;
    key?: keyof Attendance;
    render?: (row: Attendance, index?: number) => React.ReactNode;
  }[] = [
      {
        label: 'Sr. No',
        render: (_: Attendance, index?: number) => (index ?? 0) + 1,
      },
      { label: 'ID', key: 'id' },
      {
        label: 'Name',
        render: (row: Attendance) => row.user?.name ?? '-',
      },
      {
        label: 'User ID',
        render: (row: Attendance) => row.user?.uid ?? '-',
      },
      { label: 'Attendance Date', key: 'attendance_date' },
      { label: 'Clock In', key: 'clock_in' },
      { label: 'Clock Out', key: 'clock_out' },
      {
        label: 'Status',
        render: (attendance: Attendance) => (
          <div
            className="status"
            style={{
              backgroundColor:
                attendance.status === 'present'
                  ? '#009693'
                  : attendance.status === 'leave'
                    ? 'yellow'
                    : attendance.status === 'absent'
                      ? 'red'
                      : 'gray',
              color: attendance.status === 'leave' ? 'black' : 'white',
            }}
          >
            {attendance.status}
          </div>
        ),
      },
      {
        label: 'Approval Status',
        render: (attendance: Attendance) => (
          <div
            className="status"
            style={{
              backgroundColor:
                attendance.approval_status === 'approved'
                  ? '#009693'
                  : attendance.approval_status === 'pending'
                    ? 'yellow'
                    : attendance.approval_status === 'unapproved'
                      ? 'red'
                      : 'gray',
              color: attendance.approval_status === 'pending' ? 'black' : 'white',
            }}
          >
            {attendance.approval_status}
          </div>
        ),
      },
      {
        label: 'Action',
        render: (attendance: Attendance) => (
          <div className="store-t-e-e-icons">
            <span onClick={() => update(attendance)}><FaEdit /></span>
            <span onClick={() => view(attendance)}><FaEye /></span>
          </div>
        ),
      },
    ];

  return (
    <ResponsiveTable
      data={attendanceList}
      columns={columns}
      onDelete={(id: number) => {
        console.log('Delete attendance with ID:', id);
      }}
      onEdit={(id: number) => {
        console.log('Edit attendance with ID:', id);
      }}
      onView={(id: number) => {
        console.log('View attendance with ID:', id);
      }}
    />
  );
};

export default AttendancesList;
