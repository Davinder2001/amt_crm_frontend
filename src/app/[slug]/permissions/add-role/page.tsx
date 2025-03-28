'use client';

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCreateRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchPermissionsQuery } from "@/slices/permissions/permissionApi";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";

const Page: React.FC = () => {

  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    setTitle('Add Role'); // Update breadcrumb title
  }, [setTitle]);

  const { data} = useFetchPermissionsQuery();
  const permissions = data || [];
  const [createRole, { isLoading }] = useCreateRoleMutation();


  const [newRoleName, setNewRoleName] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'user' | 'other'>('user');

  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRoleName.trim() === "") {
      toast.error("Role name is required");
      return;
    }

    try {
      const response = await createRole({
        name: newRoleName,
        permissions: selectedPermissions,
      }).unwrap();

      toast.success(response.message || 'Role created successfully');
      setNewRoleName("");
      setSelectedPermissions([]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error creating role");
      } else {
        toast.error("Unknown error occurred");
      }
    }
  };

  // if (isFetching) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading permissions...</div>;
  // if (error) return <div style={{ textAlign: 'center', color: 'red', padding: '40px' }}>Error loading permissions</div>;

  return (
    <div className="add-role-form">


      <h2>
        Create a Role
      </h2>

      <form onSubmit={handleCreateRole}>

        {/* Role Name */}
        <div className="roll-name-input">
          <label>Role Name:</label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name"
            required
          />
        </div>

        {/* Tab Navigation */}
          <div className="switch-button">
            <button
              type="button"
              onClick={() => setSelectedTab('user')}
            >
              User Permissions
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('other')}
            >
              Other Permissions
            </button>
          </div>
        <div className="permissions-container">
  {/* Permissions List */}
  {selectedTab === 'user' && (
    <div>
      <label>User Permissions:</label>
      <div>
        {permissions?.map((perm) => (
          <label key={perm.id}>
            <input
              type="checkbox"
              value={perm.name}
              checked={selectedPermissions.includes(perm.name)}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedPermissions((prev) =>
                  prev.includes(value)
                    ? prev.filter((p) => p !== value)
                    : [...prev, value]
                );
              }}
            />
            <span>{perm.name}</span>
          </label>
        ))}
      </div>
    </div>
  )}

  {selectedTab === 'other' && (
    <div>
      <label>Other Permissions:</label>
      <p>No other permissions available yet.</p>
    </div>
  )}

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isLoading}
    onMouseOver={(e) => e.currentTarget}
    onMouseOut={(e) => e.currentTarget}
  >
    {isLoading ? "Creating..." : "Create Role"}
  </button>
</div>

      </form>
    </div>
  );
};

export default Page;
