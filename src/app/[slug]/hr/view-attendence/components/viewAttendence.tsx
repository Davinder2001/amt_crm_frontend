'use client';
import { useFetchAttenancesQuery, useApproveAttendanceMutation, useRejectAttendanceMutation } from '@/slices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Image from 'next/image';
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  number: string;
  uid: string;
}

interface MutationResponse {
  message: string;
}

interface Attendance {
  id: number;
  user_id: number;
  company_id: number;
  attendance_date: string;
  clock_in: string | null;
  clock_in_image: string | null;
  clock_out: string | null;
  clock_out_image: string | null;
  status: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
  user: User;
}

function ViewAttendence() {
  const { data: attendancesResponse, refetch } = useFetchAttenancesQuery();
  const [approveAttendance] = useApproveAttendanceMutation();
  const [rejectAttendance] = useRejectAttendanceMutation();

  const attendanceList: Attendance[] = (attendancesResponse?.attendance || []) as Attendance[];

  const handleApprove = async (attendanceId: number) => {
    try {
      const response = (await approveAttendance(attendanceId).unwrap() as unknown) as MutationResponse;
      toast.success(response.message);
      refetch();
    } catch {
      toast.error('Error approving attendance.');
    }
  };

  const handleReject = async (attendanceId: number) => {
    try {
      const response = (await rejectAttendance(attendanceId).unwrap() as unknown) as MutationResponse;
      toast.success(response.message);
      refetch();
    } catch {
      toast.error('Error rejecting attendance.');
    }
  };

  const columns = [

    {
      label: 'Name',
      render: (row: Attendance) => row.user.name,
    },
    {
      label: 'User ID',
      render: (row: Attendance) => row.user.uid,
    },
    {
      label: 'Attendance Date',
      render: (row: Attendance) => row.attendance_date,
    },
    {
      label: 'Clock In',
      render: (row: Attendance) => row.clock_in || '-',
    },
    {
      label: 'Clock In Image',
      render: (row: Attendance) =>
        row.clock_in_image ? (
          <Image
            alt="Clock In"
            src={row.clock_in_image}
            width={100}
            height={100}
            unoptimized
          />
        ) : (
          '-'
        ),
    },
    {
      label: 'Clock Out',
      render: (row: Attendance) => row.clock_out || '-',
    },
    {
      label: 'Clock Out Image',
      render: (row: Attendance) =>
        row.clock_out_image ? (
          <Image
            alt="Clock Out"
            src={row.clock_out_image}
            width={100}
            height={100}
            unoptimized
          />
        ) : (
          '-'
        ),
    },
    {
      label: 'Status',
      render: (row: Attendance) => {
        const bg =
          row.status === 'present'
            ? 'green'
            : row.status === 'leave'
              ? 'yellow'
              : row.status === 'absent'
                ? 'red'
                : 'gray';

        const color = row.status === 'leave' ? 'black' : 'white';

        return (
          <div
            className="status"
            style={{
              backgroundColor: bg,
              color,
              padding: '4px 10px',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'capitalize', // So "present" -> "Present"
              margin: '2px 0',
            }}
          >
            {row.status}
          </div>
        );
      },
    },
    {
      label: 'Approval Status',
      render: (row: Attendance) => {
        const bg =
          row.approval_status === 'approved'
            ? 'var(--primary-color)'
            : row.approval_status === 'pending'
              ? 'yellow'
              : row.approval_status === 'unapproved'
                ? 'red'
                : 'red';

        const color = row.approval_status === 'pending' ? 'black' : 'white';

        return (
          <div
            className="approval-status"
            style={{
              backgroundColor: bg,
              color,
              padding: '4px 10px',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'capitalize', // Makes "approved" -> "Approved"
              margin: '2px 0',
            }}
          >
            {row.approval_status}
          </div>
        );
      },
    },

    {
      label: 'Action',
      render: (row: Attendance) => (
        <>
          <div className='attendamce-t-btns-outer'>
            <span onClick={() => handleApprove(row.id)} className='approve-btn'>
              Approve
            </span>
            <span onClick={() => handleReject(row.id)} className='reject-btn'>
              Reject
            </span>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="view-attendance">
      {attendanceList.length > 0 ? (
        <ResponsiveTable data={attendanceList} columns={columns} />
      ) : (
        <p>No attendances available.</p>
      )}
    </div>
  );
}

export default ViewAttendence;
