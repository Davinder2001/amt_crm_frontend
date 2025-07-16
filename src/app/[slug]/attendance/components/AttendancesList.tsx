'use client';
import React from 'react';
import {
  useFetchMyAttenancesQuery,
  Attendance,
} from '@/slices/attendance/attendanceApi';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaClipboardList } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import AddAttendanceForm from './AddAttendanceForm';
import { FaTriangleExclamation } from 'react-icons/fa6';

interface AttendanceProps {
  isAttandanceOpen: boolean;
  setIsAttandanceOpen: (open: boolean) => void;
}

const AttendancesList: React.FC<AttendanceProps> = ({ isAttandanceOpen, setIsAttandanceOpen }) => {
  const { data: attendanceData, error, isLoading, refetch } = useFetchMyAttenancesQuery();

  const attendanceList: Attendance[] = Array.isArray(attendanceData?.attendance)
    ? attendanceData.attendance
    : [];

  let content;

  if (isLoading) {
    content = <LoadingState />;
  } else if (error) {
    content = (
      <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to load attendance"
        message="We encountered an error while loading your attendance records. Please try again later."
      />
    );
  } else if (attendanceList.length === 0) {
    content = (
      <EmptyState
        icon={<FaClipboardList className="empty-state-icon" />}
        title="No attendance records found"
        message="You don't have any attendance records yet. Attendance data will appear here once marked."
      />
    );
  } else {
    const columns: {
      label: string;
      key?: keyof Attendance;
      render?: (row: Attendance, index?: number) => React.ReactNode;
    }[] = [
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
                    ? 'green'
                    : attendance.status === 'leave'
                      ? 'yellow'
                      : attendance.status === 'absent'
                        ? 'red'
                        : 'gray',
                color: attendance.status === 'leave' ? 'black' : 'white',
                padding: '6px 12px',
                margin: '4px',
                borderRadius: '4px',
                display: 'inline-block',
                fontWeight: '500',
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
                    ? 'green'
                    : attendance.approval_status === 'pending'
                      ? 'orange'
                      : attendance.approval_status === 'unapproved'
                        ? 'red'
                        : 'gray',
                color: attendance.approval_status === 'pending' ? 'black' : 'white',
                padding: '6px 12px',
                margin: '4px',
                borderRadius: '4px',
                fontWeight: 500,
                display: 'inline-block',
                fontSize: '14px',
              }}

            >
              {attendance.approval_status}
            </div>
          ),
        },
      ];

    content =
      <>

        <ResponsiveTable data={attendanceList} columns={columns} />
      </>

      ;
  }

  return (
    <>
      {content}
      <Modal
        isOpen={isAttandanceOpen}
        onClose={() => setIsAttandanceOpen(false)}
        title="Add Attendance"
        width="800px"
      >
        <AddAttendanceForm
          onSuccess={() => {
            setIsAttandanceOpen(false);
            refetch();
          }}
        />
      </Modal>
    </>
  );
};

export default AttendancesList;