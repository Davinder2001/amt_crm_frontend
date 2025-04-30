// 'use client';

// import React, { useEffect, useState, FormEvent } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useFetchEmployesQuery, useUpdateEmployeMutation } from '@/slices/employe/employe';
// import { useGetRolesQuery } from '@/slices/roles/rolesApi';
// import HrNavigation from '../../../components/hrNavigation';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import { useCompany } from '@/utils/Company';

// const EditUserPage: React.FC = () => {
//   const { setTitle } = useBreadcrumb();

//   useEffect(() => {
//     setTitle('Edit Employee Profile'); // Update breadcrumb title
//   }, [setTitle]);
//   const { id } = useParams() as { id: string };
//   const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchEmployesQuery();
//   const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});

//   const [updateUser, { isLoading: isUpdating }] = useUpdateEmployeMutation();
//   const router = useRouter();  // Only used if you navigate after the update
//   const {companySlug} = useCompany();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [number, setNumber] = useState('');
//   const [role, setRole] = useState<Role | null>(null);
//   const [companyName, setCompanyName] = useState('');

//   useEffect(() => {
//     if (usersData) {
//       const user = usersData.employees.find((user: Employee) => user.id.toString() === id);
//       if (user) {
//         setName(user.name || '');
//         setEmail(user.email || '');
//         setNumber(user.number || '');
//         setCompanyName(user.company_name || '');
//         setRole(user.roles?.[0] || null);
//       }
//     }
//   }, [usersData, id]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateUser({
//         id: parseInt(id, 10),
//         name,
//         email,
//         number,
//         company_name: companyName,
//         roles: role ? [role] : [],
//       }).unwrap();
//       toast.success('User updated successfully!');
//       router.push(`/${companySlug}/hr/status-view`);  // Navigate to the users page after successful update
//     } catch (err: unknown) {
//       if (err && typeof err === 'object' && 'data' in err) {
//         const error = err as { data: { message: string } };
//         toast.error(error?.data?.message || 'Failed to update user. Please try again.');
//       } else {
//         toast.error('An unexpected error occurred.');
//       }
//     }
//   };

//   if (usersLoading) return <p>Loading user data...</p>;
//   if (usersError) return <p>Error fetching user data.</p>;

//   return (
//     <div style={{ padding: '24px' }}>
//       <HrNavigation />
//       <h1>Edit User</h1>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '12px' }}>
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
//           />
//         </div>
//         <div style={{ marginBottom: '12px' }}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
//           />
//         </div>
//         <div style={{ marginBottom: '12px' }}>
//           <input
//             type="text"
//             placeholder="Phone Number"
//             value={number}
//             onChange={(e) => setNumber(e.target.value)}
//             style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
//           />
//         </div>

//         <div style={{ marginBottom: '12px' }}>
//           <label>Select Role:</label>
//           <select
//             value={role?.name || ''}
//             onChange={(e) => {
//               const selectedRole = rolesData?.roles.find((r: Role) => r.name === e.target.value);
//               setRole(selectedRole || null);
//             }}
//             style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
//           >
//             {rolesLoading ? (
//               <option>Loading roles...</option>
//             ) : rolesError ? (
//               <option>Error loading roles</option>
//             ) : rolesData && rolesData.total > 0 ? (
//               <>
//                 <option value="">Select a role</option>
//                 {rolesData.roles.map((roleItem: Role) => (
//                   <option key={roleItem.id} value={roleItem.name}>
//                     {roleItem.name}
//                   </option>
//                 ))}
//               </>
//             ) : (
//               <option value="">No roles available</option>
//             )}
//           </select>
//         </div>
//         <button
//           type="submit"
//           disabled={isUpdating}
//           style={{
//             width: '100%',
//             padding: '12px',
//             background: isUpdating ? '#ccc' : '#0070f3',
//             color: '#fff',
//             border: 'none',
//             cursor: 'pointer',
//           }}
//         >
//           {isUpdating ? 'Updating...' : 'Update'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditUserPage;














'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchEmployesQuery, useUpdateEmployeMutation } from '@/slices/employe/employe';
import { useGetRolesQuery } from '@/slices/roles/rolesApi';
import HrNavigation from '../../../components/hrNavigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useCompany } from '@/utils/Company';

const EditUserPage: React.FC = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Edit Employee Profile');
  }, [setTitle]);

  const { id } = useParams() as { id: string };
  const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchEmployesQuery();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});

  const [updateUser, { isLoading: isUpdating }] = useUpdateEmployeMutation();
  const router = useRouter();
  const { companySlug } = useCompany();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (usersData) {
      const user = usersData.employees.find((user: Employee) => user.id.toString() === id);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setNumber(user.number || '');
        setCompanyName(user.company_name || '');
        setRole(user.roles?.[0] || null);
      }
    }
  }, [usersData, id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        id: parseInt(id, 10),
        name,
        email,
        number,
        company_name: companyName,
        roles: role ? [role] : [],
      }).unwrap();
      toast.success('User updated successfully!');
      router.push(`/${companySlug}/hr/status-view`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as { data: { message: string } };
        toast.error(error?.data?.message || 'Failed to update user. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  if (usersLoading) return <p>Loading user data...</p>;
  if (usersError) return <p>Error fetching user data.</p>;

  return (
    <div className="edit-user-container">
      <HrNavigation />
      <h1 className="edit-user-title">Edit User</h1>
      <form className="edit-user-form-outer" onSubmit={handleSubmit}>
      <div className="edit-user-form">
       <div className="form-group">
       <label className="form-label">Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
        <label className="form-label">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
        <label className="form-label">Phone Number:</label>
          <input
            type="text"
            placeholder="Phone Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Select Role:</label>
          <select
            value={role?.name || ''}
            onChange={(e) => {
              const selectedRole = rolesData?.roles.find((r: Role) => r.name === e.target.value);
              setRole(selectedRole || null);
            }}
            className="form-select"
          >
            {rolesLoading ? (
              <option>Loading roles...</option>
            ) : rolesError ? (
              <option>Error loading roles</option>
            ) : rolesData && rolesData.total > 0 ? (
              <>
                <option value="">Select a role</option>
                {rolesData.roles.map((roleItem: Role) => (
                  <option key={roleItem.id} value={roleItem.name}>
                    {roleItem.name}
                  </option>
                ))}
              </>
            ) : (
              <option value="">No roles available</option>
            )}
          </select>
        </div>
        
        </div>
        <div className='edit-user-form-smt-btn'>
        <button
          type="submit"
          disabled={isUpdating}
          className={`buttons ${isUpdating ? 'button-disabled' : ''}`}
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
