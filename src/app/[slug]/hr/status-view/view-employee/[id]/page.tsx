// 'use client';

// import React, { useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useFetchEmployesQuery } from '@/slices/employe/employe';
// import HrNavigation from '../../../components/hrNavigation';

// const ViewUserPage: React.FC = () => {
//   const { id } = useParams() as { id: string };
//   const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchEmployesQuery();



//   useEffect(() => {
//     if (usersError) {
//       toast.error('Failed to fetch user data');
//     }
//   }, [usersError]);

//   if (usersLoading) return <p>Loading user data...</p>;

//   const user = usersData?.employees.find((user: Employee) => user.id.toString() === id);

//   if (!user) {
//     return <p>User not found</p>;
//   }

//   return (
//     <div style={{ padding: '24px' }}>
//       <HrNavigation />
//       <h1>View Employee</h1>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Field</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>Name</td>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
//           </tr>
//           <tr>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>Email</td>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
//           </tr>
//           <tr>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>Phone Number</td>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.number}</td>
//           </tr>
//           <tr>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>Company Name</td>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.company_name}</td>
//           </tr>
//           <tr>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>Role</td>
//             <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//               {user.roles?.[0]?.name || 'No role assigned'}
//             </td>
//           </tr>
//           {user.meta && (
//             <>
//               <tr>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>Date Of Hire</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                   {user.meta.dateOfHire || 'N/A'}
//                 </td>
//               </tr>
//               <tr>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>Joining Date</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                   {user.meta.joiningDate || 'N/A'}
//                 </td>
//               </tr>
//               <tr>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>Shift Timings</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                   {user.meta.shiftTimings || 'N/A'}
//                 </td>
//               </tr>
//             </>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewUserPage;

















'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchEmployesQuery } from '@/slices/employe/employe';
import HrNavigation from '../../../components/hrNavigation';
import Image from 'next/image';

const ViewUserPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchEmployesQuery();

  useEffect(() => {
    if (usersError) {
      toast.error('Failed to fetch user data');
    }
  }, [usersError]);

  if (usersLoading) return <p>Loading user data...</p>;

  const user = usersData?.employees.find((user: Employee) => user.id.toString() === id);
  const firstLetter = user?.name[0].toUpperCase();

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="container">
      <HrNavigation />
      {/* Profile Section */}
      <div className="profile-card">
        <div className="profile-mage-wrapper">
          {firstLetter ?
            <h1>{firstLetter}</h1>
            :
            <Image
              src={user.profile_picture || 'https://via.placeholder.com/100'}
              alt={user.name}
              className="profile-image"
              width={100}
              height={100}
            />
          }
        </div>
        <div className="profile-info">
          <h2 style={{textTransform: 'capitalize'}}>{user.name}</h2>
          <p className="employee-meta">Manager | Employee ID: <strong>{user.id}</strong></p>
          <p className="bio">Lorem Ipsum is a dummy text used in design and publishing.</p>
          <div className="info-row">
            <span><strong>Mobile:</strong> {user.number || 'N/A'}</span>
            <span><strong>Email:</strong> {user.email}</span>
            <span><strong>Birth Date:</strong> {user.meta?.dateOfHire || 'N/A'}</span>
            <span><strong>City:</strong> {user.meta?.city || 'N/A'}</span>
            <span><strong>Current Salary:</strong> ₹{user.salary || 'N/A'}</span>
            <span><strong>Joining Date:</strong> {user.meta?.joiningDate || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Personal & Bank Information Sections */}
      <div className="info-sections">
        {/* Personal Info */}
        <div className="info-card">
          <h3>Personal Information</h3>
          <p><strong>Nationality:</strong> {user.meta?.nationality || 'N/A'}</p>
          <p><strong>Religion:</strong> {user.meta?.religion || 'N/A'}</p>
          <p><strong>Marital Status:</strong> {user.meta?.maritalStatus || 'N/A'}</p>
          <p><strong>Passport No:</strong> {user.meta?.passportNumber || 'N/A'}</p>
          <p><strong>Emergency Contact:</strong> {user.meta?.emergencyContact || 'N/A'}</p>
          <p><strong>Join Date & Time:</strong> {user.meta?.joiningDate || 'N/A'}</p>
        </div>

        {/* Bank Info */}
        <div className="info-card">
          <h3>Bank Information</h3>
          <p><strong>Bank Name:</strong> {user.meta?.bankName || 'N/A'}</p>
          <p><strong>Account No:</strong> {user.meta?.accountNumber || 'N/A'}</p>
          <p><strong>IFSC Code:</strong> {user.meta?.ifscCode || 'N/A'}</p>
          <p><strong>Pan No:</strong> {user.meta?.panNumber || 'N/A'}</p>
          <p><strong>UPI Id:</strong> {user.meta?.upiId || 'N/A'}</p>
          <p><strong>Current Salary:</strong> ₹{user.salary || 'N/A'}</p>
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          margin: auto;
        }
        .profile-card {
          display: flex;
          background: #f9fbfc;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        .profile-mage-wrapper{
        max-width: 100px;
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color:rgba(0, 150, 147, 0.06);
        border-radius: 50%;
        margin-right: 20px;
        }
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-info {
          flex-grow: 1;
        }
        .employee-meta {
          font-size: 14px;
          color: #777;
        }
        .bio {
          font-size: 14px;
          color: #555;
          margin-top: 5px;
        }
        .info-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 20px;
          font-size: 14px;
          color: #333;
          margin-top: 8px;
        }
        .info-row span{
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color:rgba(0, 150, 147, 0.06);
        padding: 5px;
        }
        .info-sections {
          display: flex;
          gap: 20px;
        }
        .info-card {
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          flex: 1;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .info-card h3 {
          margin-bottom: 10px;
          font-size: 16px;
        }
        .info-card p {
          font-size: 14px;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default ViewUserPage;
