'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetRolesQuery, useUpdateRoleMutation } from '@/slices/roles/rolesApi';
import { useFetchPermissionsQuery } from '@/slices/permissions/permissionApi';
import { useCompany } from '@/utils/Company';

interface Permission {
  id: number;
  name: string;
}


const EditRolePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: role, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery(id);

  const {
    data: permissionsApiResponse,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useFetchPermissionsQuery();

  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const [name, setName] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'user' | 'other'>('user');
  const { companySlug } = useCompany();

  useEffect(() => {
    if (role) {
      setName(role.name);
      setCompanyId(role.company_id);
      setSelectedPermissions(role.permissions?.map((perm: Permission) => perm.name) || []);
    }
  }, [role]);

  const permissionsList: Permission[] = permissionsApiResponse
    ? permissionsApiResponse.flatMap((group) =>
      group.permissions.map((perm) => ({
        id: perm.id,
        name: perm.name,
      }))
    )
    : [];

  if (rolesLoading || permissionsLoading) {
    return <p>Loading role and permissions...</p>;
  }

  if (rolesError || permissionsError || !role) {
    return <p>Error fetching role or permissions data.</p>;
  }

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
      router.push(`${companySlug}/employee/roles`);
    } catch (err) {
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as { data: { message: string } };
        toast.error(error.data.message || 'Failed to update role. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

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

        {selectedTab === 'user' && (
          <div style={{ marginBottom: '12px' }}>
            <label>User Permissions:</label>
            <div>
              {permissionsList.map((permission) => (
                <label key={permission.id} style={{ display: 'block', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.name)}
                    onChange={() => handlePermissionChange(permission.name)}
                  />
                  {permission.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'other' && (
          <div style={{ marginBottom: '12px' }}>
            <label>Other Permissions:</label>
            <p>No other permissions available yet</p>
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
