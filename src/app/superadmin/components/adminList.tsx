'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchAdminsQuery, useUpdateAdminStatusMutation } from '@/slices/superadminSlices/adminManagement/adminManageApi';
import { FaEye } from 'react-icons/fa';
import Loader from '@/components/common/Loader';

const statusOptions = ['active', 'blocked'];

const AdminList = () => {
    const { data, isLoading, error } = useFetchAdminsQuery();
    const [updateAdminStatus] = useUpdateAdminStatusMutation();

    const handleStatusChange = (id: string, status: string) => {
        updateAdminStatus({ id, status });
    };
    const router = useRouter();

    return (
        <div className="p-4 allAdmin-table-outer">

            {isLoading && <Loader />}
            {error && <p className="text-red-500">Failed to fetch admins.</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                    <thead className="bg-gray-100 font-semibold">
                        <tr>
                            <th className="border p-2">Sr. No.</th>
                            <th className="border p-2">UID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Number</th>
                            <th className="border p-2">Roles</th>
                            <th className="border p-2">Email Verified</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.admins?.map((admin: Admin, index: number) => (
                            <tr key={admin.id} className="hover:bg-gray-50">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{admin.uid}</td>
                                <td className="border p-2">{admin.name}</td>
                                <td className="border p-2">{admin.email}</td>
                                <td className="border p-2">{admin.number}</td>
                                <td className="border p-2">
                                    {admin.roles?.map((role) => role.company_id).join(', ') || '-'}
                                </td>
                                <td className="border p-2">
                                    {admin.email_verified_at ? 'Yes' : 'No'}
                                </td>
                                <td className="border p-2">
                                    <select
                                        className={`status-select ${admin.user_status}`}
                                        value={admin.user_status}
                                        onChange={(e) => handleStatusChange(String(admin.id), e.target.value)}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>

                                </td>
                                <td className="border p-2 store-t-e-e-icons Scompany-table-action-icon">
                                    <button
                                        onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>
                                        <FaEye />
                                    </button>                </td>
                            </tr>
                        ))}
                        {data?.admins?.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center p-4 text-gray-500">
                                    No admins found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminList;






















// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { FaEye } from 'react-icons/fa';
// import {
//     useFetchAdminsQuery,
//     useUpdateAdminStatusMutation,
// } from '@/slices/superadminSlices/adminManagement/adminManageApi';
// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import TableToolbar from '@/components/common/TableToolbar';

// const statusOptions = ['active', 'blocked'];

// interface Admin {
//     id: number; // Changed from string to number
//     uid: string;
//     name: string;
//     email: string;
//     number: string;
//     roles: { company_id: string }[];
//     email_verified_at: string | null;
//     user_status: string;
// }

// const AdminList = () => {
//     const router = useRouter();
//     const { data, isLoading, error } = useFetchAdminsQuery();
//     const [updateAdminStatus] = useUpdateAdminStatusMutation();

//     const admins: Admin[] = Array.isArray(data?.admins) ? data.admins : [];

//     const [visibleColumns, setVisibleColumns] = useState<string[]>([
//         'uid',
//         'name',
//         'email',
//         'number',
//         'roles',
//         'email_verified_at',
//         'user_status',
//         'actions',
//     ]);

//     const [filters, setFilters] = useState<Record<string, string[]>>({});

//     const handleStatusChange = (id: string, status: string) => {
//         updateAdminStatus({ id, status });
//     };

//     const handleFilterChange = (field: string, value: string, checked: boolean) => {
//         setFilters((prev) => {
//             const current = new Set(prev[field] || []);
//             if (checked) current.add(value);
//             else current.delete(value);
//             return { ...prev, [field]: [...current] };
//         });
//     };

//     const toggleColumn = (key: string) => {
//         setVisibleColumns((prev) =>
//             prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
//         );
//     };

//     const filterData = (data: Admin[]): Admin[] => {
//         return data.filter((admin) => {
//             return Object.entries(filters).every(([field, values]) => {
//                 const itemValue = admin[field as keyof Admin];
//                 if (Array.isArray(values) && values.length > 0) {
//                     return values.includes(String(itemValue));
//                 }
//                 return true;
//             });
//         });
//     };

//     const filteredAdmins = filterData(admins);

//     const allColumns = [
//         { label: 'UID', key: 'uid' as keyof Admin },
//         { label: 'Name', key: 'name' as keyof Admin },
//         { label: 'Email', key: 'email' as keyof Admin },
//         { label: 'Number', key: 'number' as keyof Admin },
//         { label: 'Roles', key: 'roles' as keyof Admin },
//         { label: 'Email Verified', key: 'email_verified_at' as keyof Admin },
//         { label: 'Status', key: 'user_status' as keyof Admin },
//         { label: 'Actions', key: 'actions' as 'actions', className:"store-t-e-e-icons" },
//     ];

//     const columns = allColumns
//         .filter((col) => visibleColumns.includes(col.key))
//         .map((col) => {
//             if (col.key === 'actions') {
//                 return {
//                     label: 'Actions',
//                     render: (admin: Admin) => (
//                         <div className='store-t-e-e-icons'>
//                             <a href={`/superadmin/admins/view-admin/${admin.id}`} >
//                             <FaEye />
//                         </a>
//                         </div>

//                     ),
//                 };
//             }

//             if (col.key === 'roles') {
//                 return {
//                     label: 'Roles',
//                     render: (admin: Admin) =>
//                         admin.roles?.map((r) => r.company_id).join(', ') || '-',
//                 };
//             }

//             if (col.key === 'email_verified_at') {
//                 return {
//                     label: 'Email Verified',
//                     render: (admin: Admin) => (admin.email_verified_at ? 'Yes' : 'No'),
//                 };
//             }

//             if (col.key === 'user_status') {
//                 return {
//                     label: 'Status',
//                     render: (admin: Admin) => (
//                         <select
//                             className={`status-select ${admin.user_status}`}
//                             value={admin.user_status}
//                             onChange={(e) => handleStatusChange(admin.id.toString(), e.target.value)}
//                         >
//                             {statusOptions.map((status) => (
//                                 <option key={status} value={status}>
//                                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                                 </option>
//                             ))}
//                         </select>
//                     ),
//                 };
//             }

//             return col;
//         });

//     if (isLoading) return <p>Loading admins...</p>;
//     if (error) return <p className="text-red-500">Failed to fetch admins.</p>;

//     return (
//         <div className="p-4 allAdmin-table-outer">
//             <TableToolbar
//                 filters={{
//                     user_status: [...new Set(admins.map((a) => a.user_status))],
//                 }}
//                 onFilterChange={handleFilterChange}
//                 columns={allColumns}
//                 visibleColumns={visibleColumns}
//                 onColumnToggle={toggleColumn}
//                 actions={[
//                     { label: 'Add Admin', onClick: () => router.push('/superadmin/admins/add-admin') },
//                 ]}
//             />

//             <ResponsiveTable<Admin> data={filteredAdmins} columns={columns} onDelete={function (id: number): void {
//                 throw new Error('Function not implemented.');
//             }} onEdit={function (id: number): void {
//                 throw new Error('Function not implemented.');
//             }} onView={function (id: number): void {
//                 throw new Error('Function not implemented.');
//             }} />
//         </div>
//     );
// };

// export default AdminList;
