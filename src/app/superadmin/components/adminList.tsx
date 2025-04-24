'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFetchAdminsQuery, useUpdateAdminStatusMutation } from '@/slices/superadminSlices/adminManagement/adminManageApi';

const statusOptions = ['active', 'blocked'];

const AdminList = () => {
    const { data, isLoading, error } = useFetchAdminsQuery();
    const [updateAdminStatus] = useUpdateAdminStatusMutation();

    const handleStatusChange = (id: string, status: string) => {
        updateAdminStatus({ id, status });
    };
    const router = useRouter();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">All Admins</h1>

            {isLoading && <p>Loading...</p>}
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
                        {data?.admins?.map((admin: any, index: number) => (
                            <tr key={admin.id} className="hover:bg-gray-50">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{admin.uid}</td>
                                <td className="border p-2">{admin.name}</td>
                                <td className="border p-2">{admin.email}</td>
                                <td className="border p-2">{admin.number}</td>
                                <td className="border p-2">
                                    {admin.roles?.map((role: any) => role.company_id).join(', ') || '-'}
                                </td>
                                <td className="border p-2">
                                    {admin.email_verified_at ? 'Yes' : 'No'}
                                </td>
                                <td className="border p-2">
                                    <select
                                        value={admin.user_status}
                                        onChange={(e) => handleStatusChange(admin.id, e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => router.push(`/superadmin/admins/view-admin/${admin.id}`)}>
                                        View    
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
