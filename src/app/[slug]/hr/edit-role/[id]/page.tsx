'use client';
import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetRolesQuery, useUpdateRoleMutation } from '@/slices/roles/rolesApi';
import { useFetchPermissionsQuery } from '@/slices/permissions/permissionApi';
import HrNavigation from '../../components/hrNavigation';

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    company_id: string;
}

interface Permission {
    id: number;
    name: string;
}

const EditRolePage: React.FC = () => {
    const { id } = useParams() as { id: string };
    const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery(undefined);
    const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useFetchPermissionsQuery();
    const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
    const router = useRouter();

    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [companyId, setCompanyId] = useState('');
    
    // For managing tabs
    const [selectedTab, setSelectedTab] = useState<'user' | 'other'>('user');

    useEffect(() => {
        if (rolesData) {
            const role = rolesData.find((role: Role) => role.id.toString() === id);
            if (role) {
                setName(role.name);
                setCompanyId(role.company_id);
                setSelectedPermissions(role.permissions.map((perm: Permission) => perm.name));
            }
        }
    }, [rolesData, id]);

    if (rolesLoading || permissionsLoading) return <p>Loading role and permissions...</p>;
    if (rolesError || permissionsError) return <p>Error fetching role or permissions data.</p>;

    const handlePermissionChange = (permissionName: string) => {
        setSelectedPermissions((prevSelected) =>
            prevSelected.includes(permissionName)
                ? prevSelected.filter((name) => name !== permissionName)
                : [...prevSelected, permissionName]
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await updateRole({
                name,
                permissions: selectedPermissions,
                company_id: companyId,
            }).unwrap();
            toast.success('Role updated successfully!');
        } catch (err: any) {
            console.error('Failed to update role', err);
            toast.error('Failed to update role. Please try again.');
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <HrNavigation />
            <h1>Edit Role</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                    <input
                        type="text"
                        placeholder="Role Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <input
                        type="text"
                        placeholder="Company ID"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Tab Navigation */}
                <div style={{ marginBottom: '12px' }}>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('user')}
                        style={{
                            padding: '10px',
                            marginRight: '10px',
                            backgroundColor: selectedTab === 'user' ? '#0070f3' : '#ccc',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        User Permissions
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('other')}
                        style={{
                            padding: '10px',
                            backgroundColor: selectedTab === 'other' ? '#0070f3' : '#ccc',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Other Permissions
                    </button>
                </div>

                {/* Conditional Rendering Based on Tab */}
                {selectedTab === 'user' && (
                    <div style={{ marginBottom: '12px' }}>
                        <label>User Permissions:</label>
                        <div>
                            {permissionsData ? (
                                ((permissionsData as unknown) as Permission[]).map((permission: Permission) => (
                                    <label key={permission.id} style={{ display: 'block', marginBottom: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(permission.name)}
                                            onChange={() => handlePermissionChange(permission.name)}
                                        />
                                        {permission.name}
                                    </label>
                                ))
                            ) : (
                                <p>No user permissions available</p>
                            )}
                        </div>
                    </div>
                )}

                {selectedTab === 'other' && (
                    <div style={{ marginBottom: '12px' }}>
                        <label>Other Permissions:</label>
                        <div>
                            {/* Empty for now, can add future functionality */}
                            <p>No other permissions available yet</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isUpdating}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: isUpdating ? '#ccc' : '#0070f3',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    {isUpdating ? 'Updating...' : 'Update Role'}
                </button>
            </form>
        </div>
    );
};

export default EditRolePage;
