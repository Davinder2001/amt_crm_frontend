// 'use client';
// import { useFetchAttenancesQuery } from '@/slices/attendance/attendance';
// import Image from 'next/image';
// import React from 'react';


// function AttendancesList() {
//   const { data } = useFetchAttenancesQuery();
//   const attendanceList = data?.attendance || [];


//   return (
//     <div className='employee-attendence-view'>
//       {attendanceList.length > 0 ? (
//         <table border={1} cellPadding="10" cellSpacing="0">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>User Id</th>
//               <th>Attendance Date</th>
//               <th>Clock In</th>
//               <th>Clock In Image</th>
//               <th>Clock Out</th>
//               <th>Clock Out Image</th>
//               <th>Status</th>
//               <th>Approval Status</th>
  
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceList.map((attendance) => (
//               <tr key={attendance.id}>
//                 <td>{attendance.id}</td>
//                 <td>{attendance.user.name}</td>
//                 <td>{attendance.user.uid}</td>
//                 <td>{attendance.attendance_date}</td>
//                 <td>{attendance.clock_in}</td>
//                 <td>
//                   {attendance.clock_in_image && (
//                     <Image
//                       src={`${attendance.clock_in_image}`}
//                       alt="Clock In"
//                       width={50}
//                       height={50}
//                     />
//                   )}
//                 </td>
//                 <td>{attendance.clock_out}</td>
//                 <td>
//                   {attendance.clock_out_image && (
//                   <Image
//                     alt="Preview"
//                     src={`${attendance.clock_out_image}`}
//                     width={100}
//                     height={100}
//                     unoptimized
//                   />
//                 )}
//                 </td>
//                 <td className='user-status'>
//                 <div
//                     className="status"
//                     style={{
//                         backgroundColor:
//                             attendance.status === 'present' ? '#009693' :
//                             attendance.status === 'leave' ? 'yellow' :
//                             attendance.status === 'absent' ? 'red' :
//                             'gray',
//                         color: attendance.status === 'leave' ? 'black' : 'white'
//                     }}
//                 >
//                     {attendance.status}
//                 </div>
//             </td>

//             <td className='approval-status'>
//                 <div
//                     className="status"
//                     style={{
//                         backgroundColor:
//                             attendance.approval_status === 'approved' ? '#009693' :
//                             attendance.approval_status === 'pending' ? 'yellow' :
//                             attendance.approval_status === 'unapproved' ? 'red' :
//                             'gray',
//                         color: attendance.approval_status === 'pending' ? 'black' : 'white'
//                     }}
//                 >
//                     {attendance.approval_status}
//                 </div>
//             </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No attendances available.</p>
//       )}
//     </div>
//   );
// }

// export default AttendancesList;

















'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchAttenancesQuery} from '@/slices/attendance/attendance';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaEye } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const AttendancesList: React.FC = () => {
  const router = useRouter();
  const { data: attendanceData, error, isLoading } = useFetchAttenancesQuery();
  // const [deleteAttendance] = useDeleteAttendanceMutation();
  const attendanceList: any[] = attendanceData?.attendance ?? [];

  if (isLoading) return <p>Loading attendances...</p>;
  if (error) return <p>Error fetching attendances.</p>;
  if (attendanceList.length === 0) return <p>No attendances found.</p>;

  const update = (attendance: any) => {
    router.push(`/attendance/edit/${attendance.id}`);
  };

  const view = (attendance: any) => {
    router.push(`/attendance/view/${attendance.id}`);
  };

  // const handleDelete = async (id: number) => {
  //   if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
  //   try {
  //     await deleteAttendance(id).unwrap();
  //     toast.success('Attendance record deleted successfully!');
  //   } catch (err: unknown) {
  //     if (err && typeof err === 'object' && 'data' in err) {
  //       const error = err as { data: { message: string } };
  //       toast.error(error?.data?.message || 'Failed to delete attendance.');
  //     } else {
  //       toast.error('Failed to delete attendance. Please try again.');
  //     }
  //   }
  // };

  const columns = [
    {
      label: 'Sr. No',
      render: (_: any, index: number) => index + 1,
    },
    { label: 'ID', key: 'id' as keyof typeof attendanceList[0] },
    { label: 'Name', key: 'user.name' as keyof typeof attendanceList[0] },
    { label: 'User ID', key: 'user.uid' as keyof typeof attendanceList[0] },
    { label: 'Attendance Date', key: 'attendance_date' as keyof typeof attendanceList[0] },
    { label: 'Clock In', key: 'clock_in' as keyof typeof attendanceList[0] },
    { label: 'Clock Out', key: 'clock_out' as keyof typeof attendanceList[0] },
    {
      label: 'Status',
      render: (attendance: any) => (
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
      ),
    },
    {
      label: 'Approval Status',
      render: (attendance: any) => (
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
      ),
    },
    {
      label: 'Action',
      render: (attendance: any) => (
        <div className="store-t-e-e-icons">
          {/* <span onClick={() => handleDelete(attendance.id)}><FaTrash /></span> */}
          <span onClick={() => update(attendance)}><FaEdit /></span>
          <span onClick={() => view(attendance)}><FaEye /></span>
        </div>
      ),
    },
  ];

  return <ResponsiveTable data={attendanceList} columns={columns} />;
};

export default AttendancesList;
