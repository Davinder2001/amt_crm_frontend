'use client';
import { useFetchAttenancesQuery } from '@/slices/attendance/attendance';
import Image from 'next/image';
import React from 'react';


function AttendancesList() {
  const { data } = useFetchAttenancesQuery();
  const attendanceList = data?.attendance || [];


  return (
    <div className='employee-attendence-view'>
      {attendanceList.length > 0 ? (
        <table border={1} cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>User Id</th>
              <th>Attendance Date</th>
              <th>Clock In</th>
              <th>Clock In Image</th>
              <th>Clock Out</th>
              <th>Clock Out Image</th>
              <th>Status</th>
              <th>Approval Status</th>
  
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((attendance) => (
              <tr key={attendance.id}>
                <td>{attendance.id}</td>
                <td>{attendance.user.name}</td>
                <td>{attendance.user.uid}</td>
                <td>{attendance.attendance_date}</td>
                <td>{attendance.clock_in}</td>
                <td>
                  {attendance.clock_in_image && (
                    <img
                      src={`${attendance.clock_in_image}`}
                      alt="Clock In"
                      width={50}
                      height={50}
                    />
                  )}
                </td>
                <td>{attendance.clock_out}</td>
                <td>
                  {attendance.clock_out_image && (
                  <Image
                    alt="Preview"
                    src={`${attendance.clock_out_image}`}
                    width={100}
                    height={100}
                    unoptimized
                  />
                )}
                </td>
                <td className='user-status'>
                <div
                    className="status"
                    style={{
                        backgroundColor:
                            attendance.status === 'present' ? '#009693' :
                            attendance.status === 'leave' ? 'yellow' :
                            attendance.status === 'absent' ? 'red' :
                            'gray',
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
                            attendance.approval_status === 'approved' ? '#009693' :
                            attendance.approval_status === 'pending' ? 'yellow' :
                            attendance.approval_status === 'unapproved' ? 'red' :
                            'gray',
                        color: attendance.approval_status === 'pending' ? 'black' : 'white'
                    }}
                >
                    {attendance.approval_status}
                </div>
            </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendances available.</p>
      )}
    </div>
  );
}

export default AttendancesList;
