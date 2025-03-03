import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '@/slices/roles/rolesApi';

interface Role {
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
}

interface Permission {
  id: number;
  name: string;
}

// Manually defined available permissions.
const availablePermissions: Permission[] = [
  { id: 1, name: 'create articles' },
  { id: 2, name: 'edit articles' },
  { id: 3, name: 'delete articles' },
];

const RoleList: React.FC = () => {
  // Fetch roles from the API.
  const { data: roles, isLoading, error } = useGetRolesQuery(undefined);

  // Mutation hooks for CRUD operations.
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  // State for new role inputs.
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRolePermission, setNewRolePermission] = useState<string>('');

  // State for editing a role.
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editingRoleName, setEditingRoleName] = useState<string>('');
  const [editingRolePermission, setEditingRolePermission] = useState<string>('');

  // Handle creating a new role.
  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRoleName.trim() === '') {
      toast.error('Role name is required');
      return;
    }
    try {
      // Send permission as an array (if selected).
      await createRole({
        name: newRoleName,
        permissions: newRolePermission ? [newRolePermission] : [],
      }).unwrap();
      toast.success('Role created successfully');
      setNewRoleName('');
      setNewRolePermission('');
    } catch (err: any) {
      console.error('Error creating role:', err);
      toast.error(err?.data?.message || 'Error creating role');
    }
  };

  // Handle deleting a role.
  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id).unwrap();
      toast.success('Role deleted successfully');
    } catch (err: any) {
      console.error('Error deleting role:', err);
      toast.error(err?.data?.message || 'Error deleting role');
    }
  };

  // Start editing a role.
  const startEditing = (role: Role) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.name);
    // Use the first assigned permission if available.
    setEditingRolePermission(
      role.permissions && role.permissions.length > 0 ? role.permissions[0].name : ''
    );
  };

  // Handle updating a role.
  const handleUpdateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingRoleName.trim() === '') {
      toast.error('Role name cannot be empty');
      return;
    }
    try {
      await updateRole({
        id: editingRoleId as number,
        name: editingRoleName,
        permissions: editingRolePermission ? [editingRolePermission] : [],
      }).unwrap();
      toast.success('Role updated successfully');
      setEditingRoleId(null);
      setEditingRoleName('');
      setEditingRolePermission('');
    } catch (err: any) {
      console.error('Error updating role:', err);
      toast.error(err?.data?.message || 'Error updating role');
    }
  };

  if (isLoading) {
    return <div>Loading roles...</div>;
  }

  if (error) {
    toast.error('Error loading roles');
    return <div>Error loading roles.</div>;
  }

  return (
    <div>
      <h2>Role List</h2>
      {/* Form to create a new role */}
      <form onSubmit={handleCreateRole}>
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="New role name"
        />
        <select
          value={newRolePermission}
          onChange={(e) => setNewRolePermission(e.target.value)}
        >
          <option value="">Select Permission</option>
          {availablePermissions.map((perm) => (
            <option key={perm.id} value={perm.name}>
              {perm.name}
            </option>
          ))}
        </select>
        <button type="submit">Create Role</button>
      </form>

      {/* Display roles in a table */}
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>
              Permissions
            </th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles && roles.length > 0 ? (
            roles.map((role: Role) => (
              <tr key={role.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {role.id}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {editingRoleId === role.id ? (
                    <form onSubmit={handleUpdateRole}>
                      <input
                        type="text"
                        value={editingRoleName}
                        onChange={(e) => setEditingRoleName(e.target.value)}
                      />
                      <select
                        value={editingRolePermission}
                        onChange={(e) =>
                          setEditingRolePermission(e.target.value)
                        }
                      >
                        <option value="">Select Permission</option>
                        {availablePermissions.map((perm) => (
                          <option key={perm.id} value={perm.name}>
                            {perm.name}
                          </option>
                        ))}
                      </select>
                      <button type="submit">Update</button>
                      <button
                        type="button"
                        onClick={() => setEditingRoleId(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    role.name
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {role.permissions && role.permissions.length > 0
                    ? role.permissions.map((perm) => perm.name).join(', ')
                    : 'None'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {editingRoleId !== role.id && (
                    <>
                      <button onClick={() => startEditing(role)}>Edit</button>{' '}
                      <button onClick={() => handleDeleteRole(role.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                style={{ border: '1px solid #ddd', padding: '8px' }}
                colSpan={4}
              >
                No roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;
