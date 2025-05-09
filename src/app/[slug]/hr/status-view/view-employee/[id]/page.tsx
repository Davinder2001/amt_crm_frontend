// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useFetchEmployeByIdQuery } from '@/slices/employe/employe';
// import HrNavigation from '../../../components/hrNavigation';
// import Image from 'next/image';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import { useDeleteEmployeMutation } from '@/slices/employe/employe';
// import { useCompany } from '@/utils/Company';
// import ConfirmDialog from '@/components/common/ConfirmDialog';

// const ViewUserPage: React.FC = () => {
//   const { setTitle } = useBreadcrumb();
//   const [deleteEmployee] = useDeleteEmployeMutation();
//   const [showConfirm, setShowConfirm] = useState(false);
//   const { companySlug } = useCompany();
//   const router = useRouter();

//   useEffect(() => {
//     setTitle('Employee Profile');
//   }, [setTitle]);

//   const { id } = useParams() as { id: string };
//   const {
//     data,
//     error: usersError,
//     isLoading: usersLoading,
//   } = useFetchEmployeByIdQuery(Number(id));

//   const user = data;

//   useEffect(() => {
//     if (usersError) {
//       toast.error('Failed to fetch user data');
//     }
//   }, [usersError]);

//   if (usersLoading) return <p>Loading user data...</p>;
//   if (!user) return <p>User not found</p>;

//   const firstLetter = user?.name?.[0]?.toUpperCase();

//   const handleDelete = async () => {
//     try {
//       await deleteEmployee(Number(id)).unwrap();
//       setShowConfirm(false);
//       router.push(`/${companySlug}/hr`);
//     } catch (err) {
//       console.error('Error deleting item:', err);
//     }
//   };

//   return (

//     <div className="container employ-prpofile-container">
//       <HrNavigation />

//       <div className="profile-card">
//         <div className="profile-mage-wrapper">
//           {user?.profile_picture ? (
//             <Image
//               src={user.profile_picture}
//               alt={user.name}
//               className="profile-image"
//               width={100}
//               height={100}
//             />
//           ) : (
//             <h1>{firstLetter}</h1>
//           )}
//         </div>

//         <div className="profile-info">
//           <h2 style={{ textTransform: 'capitalize' }}>{user.name}</h2>
//           <div className='employ-details-wraper'>
//             <p className="employee-meta">
//               Role: {user.roles?.[0]?.name || 'N/A'} | Employee ID: <strong>{user.id}</strong>
//             </p>
//             <p className="employee-meta">
//               Company: {user.company_name || 'N/A'} | Status: {user.user_status}
//             </p>
//             <p className="bio">This is a detailed employee profile view.</p>
//           </div>
//           <div className="info-row">
//             <span><strong>Mobile:</strong> {user.number || 'N/A'}</span>
//             <span><strong>Email:</strong> {user.email}</span>
//             <span><strong>Birth Date:</strong> {user.employee_details?.dob || 'N/A'}</span>
//             <span><strong>City:</strong> {user.employee_details?.address || 'N/A'}</span>
//             <span><strong>Current Salary:</strong> ₹{user.employee_details?.currentSalary || 'N/A'}</span>
//             <span><strong>Salary:</strong> ₹{user.employee_details?.salary || 'N/A'}</span>
//             <span><strong>Joining Date:</strong> {user.employee_details?.joiningDate || 'N/A'}</span>
//             <span><strong>Department:</strong> {user.employee_details?.department || 'N/A'}</span>
//             <span><strong>Work Location:</strong> {user.employee_details?.workLocation || 'N/A'}</span>
//           </div>
//         </div>
//       </div>

//       <div className="info-sections">
//         <div className="info-card">
//           <h3>Personal Information</h3>
//           <p><strong>Nationality:</strong> {user.employee_details?.nationality || 'N/A'}</p>
//           <p><strong>Religion:</strong> {user.employee_details?.religion || 'N/A'}</p>
//           <p><strong>Marital Status:</strong> {user.employee_details?.maritalStatus || 'N/A'}</p>
//           <p><strong>Passport No:</strong> {user.employee_details?.passportNo || 'N/A'}</p>
//           <p><strong>Emergency Contact:</strong> {user.employee_details?.emergencyContact || 'N/A'}</p>
//           <p><strong>Emergency Relation:</strong> {user.employee_details?.emergencyContactRelation || 'N/A'}</p>
//           <p><strong>Medical Info:</strong> {user.employee_details?.medicalInfo || 'N/A'}</p>
//           <p><strong>Joining Type:</strong> {user.employee_details?.joiningType || 'N/A'}</p>
//           <p><strong>Previous Employer:</strong> {user.employee_details?.previousEmployer || 'N/A'}</p>
//         </div>

//         <div className="info-card">
//           <h3>Bank Information</h3>
//           <p><strong>Bank Name:</strong> {user.employee_details?.bankName || 'N/A'}</p>
//           <p><strong>Account No:</strong> {user.employee_details?.accountNo || 'N/A'}</p>
//           <p><strong>IFSC Code:</strong> {user.employee_details?.ifscCode || 'N/A'}</p>
//           <p><strong>Pan No:</strong> {user.employee_details?.panNo || 'N/A'}</p>
//           <p><strong>UPI Id:</strong> {user.employee_details?.upiId || 'N/A'}</p>
//           <p><strong>Address Proof:</strong> {user.employee_details?.addressProof || 'N/A'}</p>
//         </div>
//       </div>

//       <div className='employ-prpofile-btn-container'>

//       <button
//   onClick={() => router.push(`/${companySlug}/hr/status-view/EditUserPage/${id}`)}
//   className="buttons"
// >
//   Edit Profile
// </button>

//       <button
//         onClick={() => setShowConfirm(true)}
//         className="buttons"
//       >
//         Delete Profile
//       </button>
      

//       </div>


//       <ConfirmDialog
//         isOpen={showConfirm}
//         message="Are you sure you want to delete this Profile? This action cannot be undone."
//         onConfirm={handleDelete}
//         onCancel={() => setShowConfirm(false)}
//       />

//     </div>
//   );
// };

// export default ViewUserPage;























'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchEmployeByIdQuery, useDeleteEmployeMutation } from '@/slices/employe/employe';
import HrNavigation from '../../../components/hrNavigation';
import Image from 'next/image';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useCompany } from '@/utils/Company';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const ViewUserPage: React.FC = () => {
  const { setTitle } = useBreadcrumb();
  const [deleteEmployee] = useDeleteEmployeMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const { companySlug } = useCompany();
  const router = useRouter();

  useEffect(() => {
    setTitle('Employee Profile');
  }, [setTitle]);

  const { id } = useParams() as { id: string };
  const {
    data,
    error: usersError,
    isLoading: usersLoading,
  } = useFetchEmployeByIdQuery(Number(id));

  const user = data;
  const employee = user;
  const details = employee;

  useEffect(() => {
    if (usersError) toast.error('Failed to fetch user data');
  }, [usersError]);

  if (usersLoading) return <div className="loading-spinner">Loading...</div>;
  if (!employee) return <div className="not-found">User not found</div>;

  const firstLetter = employee?.name?.[0]?.toUpperCase();

  const handleDelete = async () => {
    try {
      await deleteEmployee(Number(id)).unwrap();
      setShowConfirm(false);
      router.push(`/${companySlug}/hr`);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const formatDate = (date: string | null | undefined) =>
    date ? new Date(date).toLocaleDateString('en-IN') : 'N/A';

  return (
    <div className="employee-profile-container">
      <HrNavigation />
      <div className="employee-profile-inner-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {employee?.profilePicture && employee.profilePicture !== 'http://localhost:8000/' ? (
              <Image
                src={employee.profilePicture}
                alt={employee.name}
                className="avatar-image"
                width={120}
                height={120}
                priority
              />
            ) : (
              <div className="avatar-initial">{firstLetter}</div>
            )}
          </div>

          <div className="profile-header-content">
            <div className="profile-title">
              <h1>{employee.name}</h1>
              <div className="profile-meta">
                <span className="badge role">{employee.roles?.[0]?.name || 'N/A'}</span>
                <span className="badge status">{employee.user_status}</span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                onClick={() => router.push(`/${companySlug}/hr/status-view/edit-employee/${id}`)}
                className="btn primary"
              >
                Edit Profile
              </button>
              <button onClick={() => setShowConfirm(true)} className="btn danger">
                Delete Profile
              </button>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Basic Info */}
          <div className="profile-card basic-info">
            <h2 className="card-title"><i className="icon-user"></i> Basic Information</h2>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Employee ID</span><span className="info-value">{employee.id}</span></div>
              <div className="info-item"><span className="info-label">Company</span><span className="info-value">{employee.company_name || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Mobile</span><span className="info-value">{employee.number || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Email</span><span className="info-value">{employee.email}</span></div>
              <div className="info-item"><span className="info-label">Birth Date</span><span className="info-value">{formatDate(details?.dob)}</span></div>
              <div className="info-item"><span className="info-label">City</span><span className="info-value">{details?.address || 'N/A'}</span></div>
            </div>
          </div>

          {/* Employment Info */}
          <div className="profile-card employment-info">
            <h2 className="card-title"><i className="icon-briefcase"></i> Employment Details</h2>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Department</span><span className="info-value">{details?.department || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Work Location</span><span className="info-value">{details?.workLocation || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Joining Date</span><span className="info-value">{formatDate(details?.joiningDate)}</span></div>
              <div className="info-item"><span className="info-label">Joining Type</span><span className="info-value">{details?.joiningType || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Current Salary</span><span className="info-value">₹{details?.currentSalary || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Salary</span><span className="info-value">₹{details?.salary || 'N/A'}</span></div>
              {details?.shiftTimings && (
                <div className="info-item"><span className="info-label">Shift Timings</span><span className="info-value">{details.shiftTimings}</span></div>
              )}
              {details?.previousEmployer && (
                <div className="info-item"><span className="info-label">Previous Employer</span><span className="info-value">{details.previousEmployer}</span></div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="profile-card personal-info">
            <h2 className="card-title"><i className="icon-id-card"></i> Personal Information</h2>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Nationality</span><span className="info-value">{details?.nationality || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Religion</span><span className="info-value">{details?.religion || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Marital Status</span><span className="info-value">{details?.maritalStatus || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Passport No</span><span className="info-value">{details?.passportNo || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Emergency Contact</span><span className="info-value">{details?.emergencyContact || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Emergency Relation</span><span className="info-value">{details?.emergencyContactRelation || 'N/A'}</span></div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="profile-card financial-info">
            <h2 className="card-title"><i className="icon-credit-card"></i> Financial Information</h2>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Bank Name</span><span className="info-value">{details?.bankName || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Account No</span><span className="info-value">{details?.accountNo || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">IFSC Code</span><span className="info-value">{details?.ifscCode || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Pan No</span><span className="info-value">{details?.panNo || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">UPI Id</span><span className="info-value">{details?.upiId || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Address Proof</span><span className="info-value">{details?.addressProof || 'N/A'}</span></div>
            </div>
          </div>
        </div>

        <ConfirmDialog
          isOpen={showConfirm}
          message="Are you sure you want to delete this employee profile? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};

export default ViewUserPage;
