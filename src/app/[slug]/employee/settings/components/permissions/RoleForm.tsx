'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useFetchPermissionsQuery, useCreateRoleMutation, useUpdateRoleMutation, useGetRoleQuery } from '@/slices';
import { toast } from 'react-toastify';
import { Tabs, Tab, Box } from '@mui/material';

interface RoleFormProps {
    mode: 'add' | 'edit';
    roleId?: number;
    onSuccess: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ mode, roleId, onSuccess }) => {
    const { data: permissionGroups = [] } = useFetchPermissionsQuery();
    const [createRole, { isLoading: creating }] = useCreateRoleMutation();
    const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
    const { data: roleData } = useGetRoleQuery(roleId!, { skip: mode !== 'edit' });

    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');

    // Set default tab on load
    useEffect(() => {
        if (permissionGroups.length && !activeTab) {
            setActiveTab(permissionGroups[0].group);
        }
    }, [permissionGroups, activeTab]);

    // Populate values if editing
    useEffect(() => {
        if (mode === 'edit' && roleData) {
            setRoleName(roleData.name);
            setSelectedPermissions(roleData.permissions?.map((p: { name: string }) => p.name) || []);
        }
    }, [roleData, mode]);

    const handleTogglePermission = (perm: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!roleName.trim()) return toast.error('Role name is required');

        try {
            if (mode === 'add') {
                await createRole({
                    name: roleName,
                    permissions: selectedPermissions,
                }).unwrap();
                toast.success('Role created successfully');
            } else {
                await updateRole({
                    id: roleId!,
                    name: roleName,
                    permissions: selectedPermissions,
                }).unwrap();
                toast.success('Role updated successfully');
            }
            onSuccess();
        } catch {
            toast.error(mode === 'add' ? 'Failed to create role' : 'Failed to update role');
        }
    };

    const selectedTabIndex = permissionGroups.findIndex((g) => g.group === activeTab);

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Role Name Input */}
                <div className="roll-name-input">
                    <label>Role Name:</label>
                    <input
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="Enter role name"
                        required
                    />
                </div>

                {/* Permission Group Tabs */}
                <Tabs className='permission-tab-popup'
                    value={selectedTabIndex === -1 ? 0 : selectedTabIndex}
                    onChange={(e, val) => {
                        const selectedGroup = permissionGroups[val]?.group;
                        if (selectedGroup) setActiveTab(selectedGroup);
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'var(--primary-color)',
                            '&.Mui-disabled': {
                                color: '#ccc',
                            },
                            '&.Mui-selected': {
                                color: 'var(--primary-color)',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--primary-color)',
                        },
                    }}
                >
                    {permissionGroups.map((g) => {
                        const total = g.permissions.length;
                        const selected = g.permissions.filter((p) => selectedPermissions.includes(p.name)).length;

                        return (
                            <Tab
                                key={g.group}
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <span>{g.group}</span>
                                        <Box
                                            component="span"
                                            sx={{
                                                backgroundColor: 'var(--primary-color)',
                                                color: '#fff',
                                                borderRadius: '12px',
                                                padding: '2px 8px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {selected}/{total}
                                        </Box>
                                    </Box>
                                }
                            />
                        );
                    })}

                </Tabs>

                {/* Permissions Checkbox List */}
                <div className="permissions-container">
                    {permissionGroups
                        .filter((g) => g.group === activeTab)
                        .flatMap((g) =>
                            g.permissions.map((p) => (
                                <label key={p.id}>
                                    <p className='role-name-select'> {p.name}</p>
                                    <input className='role-checkboxes'
                                        type="checkbox"
                                        checked={selectedPermissions.includes(p.name)}
                                        onChange={() => handleTogglePermission(p.name)}
                                    />

                                </label>
                            ))
                        )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="addrole-btn"
                    disabled={creating || updating}
                >
                    {creating || updating
                        ? mode === 'add'
                            ? 'Creating...'
                            : 'Updating...'
                        : mode === 'add'
                            ? 'Create Role'
                            : 'Update Role'}
                </button>
            </form>
        </>
    );
};

export default RoleForm;
