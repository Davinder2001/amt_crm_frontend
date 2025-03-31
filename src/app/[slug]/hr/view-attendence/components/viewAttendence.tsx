'use client';
import { useFetchAttenancesQuery } from '@/slices/attendance/attendance';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useApproveAttendanceMutation, useRejectAttendanceMutation } from '@/slices/attendance/attendance';
import Image from 'next/image';

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
      const response = (await approveAttendance(attendanceId).unwrap()) as unknown as MutationResponse;
      toast.success(response.message);
      refetch();
    } catch {
      toast.error('Error approving attendance.');
    }
  };

  const handleReject = async (attendanceId: number) => {
    try {
      const response = (await rejectAttendance(attendanceId).unwrap()) as unknown as MutationResponse;
      toast.success(response.message);
      refetch();
    } catch {
      toast.error('Error rejecting attendance.');
    }
  };

  return (
    <div className='hr-attendence-table'>
      {attendanceList.length > 0 ? (
        <table border={1} cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>User Id</th>
              <th>Attendance Date</th>
              <th>Clock In</th>
              <th>Clock In Image</th>
              <th>Clock Out</th>
              <th>Clock Out Image</th>
              <th>Status</th>
              <th>Approval Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((attendance: Attendance, index: number) => (
              <tr key={attendance.id}>
                <td>{index + 1}</td>
                <td>{attendance.user.name}</td>
                <td>{attendance.user.uid}</td>
                <td>{attendance.attendance_date}</td>
                <td>{attendance.clock_in}</td>
                <td>
                  {attendance.clock_in_image && (
                    <Image
                      alt="Clock In"
                      src={attendance.clock_in_image}
                      width={100}
                      height={100}
                      unoptimized
                    />
                  )}
                </td>
                <td>{attendance.clock_out}</td>
                <td>
                  {attendance.clock_out_image && (
                    <Image
                      src={attendance.clock_out_image}
                      alt="Clock Out"
                      width={100}
                      height={100}
                    />
                  )}
                </td>
                <td className='user-status'>
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
                      color: attendance.status === 'leave' ? 'black' : 'white'
                    }}
                  >
                    {attendance.status}
                  </div>
                </td>
                <td className='approval-status'>
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
                      color: attendance.approval_status === 'pending' ? 'black' : 'white'
                    }}
                  >
                    {attendance.approval_status}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleApprove(attendance.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(attendance.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendances available.</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default ViewAttendence;
