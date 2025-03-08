'use client';
import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetRolesQuery, useUpdateRoleMutation } from '@/slices/roles/rolesApi';
import { useFetchPermissionsQuery } from '@/slices/permissions/permissionApi'; // Import the permissions API hook

interface Role {
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
  company_id: string;
}

const EditRolePage: React.FC = () => {
  const { id } = useParams() as { id: string }; // Use dynamic routing for the ID
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery(undefined); // Fetch all roles
  const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useFetchPermissionsQuery(); // Fetch all permissions

  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation(); // Mutation to update the role
  const router = useRouter();

  // State to store form data
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Track selected permissions
  const [companyId, setCompanyId] = useState('');

  // Fetch the role and populate the form fields when data is available
  useEffect(() => {
    if (rolesData) {
      const role = rolesData.find((role: Role) => role.id.toString() === id);
      if (role) {
        setName(role.name);
        setCompanyId(role.company_id);
        // Set selected permissions (map the permission IDs)
        setSelectedPermissions(role.permissions.map((perm) => perm.id));
      }
    }
  }, [rolesData, id]);

  // Safely check permissions data
  if (rolesLoading || permissionsLoading) return <p>Loading role and permissions...</p>;
  if (rolesError || permissionsError) return <p>Error fetching role or permissions data.</p>;

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions((prevSelected) => {
      if (prevSelected.includes(permissionId)) {
        return prevSelected.filter((id) => id !== permissionId); // Unselect permission
      } else {
        return [...prevSelected, permissionId]; // Select permission
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Update the role
      await updateRole({
        id: parseInt(id, 10),
        name,
        permissions: selectedPermissions, // Send the array of selected permission IDs
        company_id: companyId,
      }).unwrap();
      toast.success('Role updated successfully!');
      // Redirect to roles list or another page
      router.push('/hr/roles');
    } catch (err: any) {
      console.error('Failed to update role', err);
      toast.error('Failed to update role. Please try again.');
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
          <input
            type="text"
            placeholder="Company ID"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Permissions:</label>
          <div>
  {/* Render checkboxes for each permission */}
  {permissionsData ? (
    permissionsData.map((permission) => (
      <label key={permission.id} style={{ display: 'block', marginBottom: '8px' }}>
        <input
          type="checkbox"
          checked={selectedPermissions.includes(permission.id)} // Check if permission is selected
          onChange={() => handlePermissionChange(permission.id)} // Handle checkbox click
        />
        {permission.name}
      </label>
    ))
  ) : (
    <p>No permissions available</p> // Fallback message if no permissions
  )}
</div>

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
