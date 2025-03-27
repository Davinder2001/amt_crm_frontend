'use client';
import { useFetchAttenancesQuery } from '@/slices/attendance/attendance';
// import Image from 'next/image';
import React from 'react';

function AttendancesList() {
    const { data: attendances } = useFetchAttenancesQuery();

    const attendanceList = attendances?.attendances;

    console.log('attendances....', attendances);

    return (
        <div>
            {attendanceList ? (
                <table border={1} cellPadding="10" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User Id</th>
                            <th>Company Id</th>
                            <th>Attendance Date</th>
                            <th>Clock In</th>
                            <th>Clock In Image</th>
                            <th>Clock Out</th>
                            <th>Clock Out Image</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceList.map((attendance) => (
                            <tr key={attendance.id}>
                                <td>{attendance.id}</td>
                                <td>{attendance.user_id}</td>
                                <td>{attendance.company_id}</td>
                                <td>{attendance.attendance_date}</td>
                                <td>{attendance.clock_in}</td>
                                <td>
                                    {/* <Image src={attendance.clock_in_image} alt="Clock In" width={50} height={50} /> */}
                                </td>
                                <td>{attendance.clock_out}</td>
                                <td>
                                    {/* <img src={attendance.clock_out_image} alt="Clock Out" width={50} height={50} /> */}
                                </td>
                                <td>{attendance.status}</td>
                                <td>{new Date(attendance.created_at).toLocaleString()}</td>
                                <td>{new Date(attendance.updated_at).toLocaleString()}</td>
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
