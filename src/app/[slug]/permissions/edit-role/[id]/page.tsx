'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetRolesQuery, useUpdateRoleMutation } from '@/slices/roles/rolesApi';
import { useFetchPermissionsQuery } from '@/slices/permissions/permissionApi';

interface Permission {
  id: number;
  name: string;
}

interface PermissionGroup {
  group: string;
  permissions: Permission[];
}

const EditRolePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: role, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery(id);
  const { data: permissionsApiResponse, isLoading: permissionsLoading, error: permissionsError } = useFetchPermissionsQuery();

  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const [name, setName] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    if (role) {
      setName(role.name);
      setCompanyId(role.company_id);
      setSelectedPermissions(role.permissions?.map((perm: Permission) => perm.name) || []);
    }
  }, [role]);

  useEffect(() => {
    if (permissionsApiResponse && permissionsApiResponse.length > 0) {
      setActiveTab(permissionsApiResponse[0].group); // Set first group as default tab
    }
  }, [permissionsApiResponse]);

  const handlePermissionChange = (permissionName: string) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionName)
        ? prevSelected.filter((name) => name !== permissionName)
        : [...prevSelected, permissionName]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      await updateRole({
        id: Number(id),
        name,
        permissions: selectedPermissions,
        company_id: companyId,
      }).unwrap();

      toast.success('Role updated successfully!');
      router.push('/roles');
    } catch (err) {
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as { data: { message: string } };
        toast.error(error.data.message || 'Failed to update role. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  if (rolesLoading || permissionsLoading) {
    return <p>Loading role and permissions...</p>;
  }

  if (rolesError || permissionsError || !role) {
    return <p>Error fetching role or permissions data.</p>;
  }

  return (
    <div style={{ padding: '24px' }}>
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

        {/* Dynamic Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {permissionsApiResponse?.map((group: PermissionGroup, index: number) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveTab(group.group)}
              style={{
                padding: '10px 16px',
                backgroundColor: activeTab === group.group ? '#0070f3' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {group.group}
            </button>
          ))}
        </div>

        {/* Permissions for Selected Tab */}
        <div style={{ marginBottom: '24px' }}>
          {permissionsApiResponse
            ?.filter((group: PermissionGroup) => group.group === activeTab)
            .map((group: PermissionGroup, index: number) => (
              <div key={index}>
                <h3 style={{ marginBottom: '10px' }}>{group.group} Permissions</h3>
                {group.permissions.map((permission) => (
                  <label key={permission.id} style={{ display: 'block', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.name)}
                      onChange={() => handlePermissionChange(permission.name)}
                      style={{ marginRight: '6px' }}
                    />
                    {permission.name}
                  </label>
                ))}
              </div>
            ))}
        </div>

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
