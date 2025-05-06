'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchAdminsQuery, useUpdateAdminStatusMutation } from '@/slices/superadminSlices/adminManagement/adminManageApi';
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
                            
                        </tr>
                    </thead>
                    <tbody>
                        {data?.admins?.map((admin: Admin, index: number) => (
                            <tr key={admin.id} className="hover:bg-gray-50">
                                <td className="border p-2" onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>{index + 1}</td>
                                <td className="border p-2" onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>{admin.uid}</td>
                                <td className="border p-2" onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>{admin.name}</td>
                                <td className="border p-2" onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>{admin.email}</td>
                                <td className="border p-2" onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>{admin.number}</td>
                                <td className="border p-2" onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>
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



















