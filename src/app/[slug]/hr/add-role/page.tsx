'use client';

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreateRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchPermissionsQuery } from "@/slices/permissions/permissionApi";
import HrNavigation from "../components/hrNavigation";

// Define a more specific error response structure
interface ErrorResponse {
  data?: {
    message?: string;
    errors?: {
      [key: string]: string[];
    };
  };
  message?: string;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface PermissionsResponse {
  permissions: Permission[];
}

const Page: React.FC = () => {
  // Fetch permissions using the RTK Query hook
  const { data, isLoading: isFetching, error } = useFetchPermissionsQuery();
  const fetchedPermissions: Permission[] = (data as PermissionsResponse)?.permissions || []; // Safely extract permissions

  const [createRole, { isLoading }] = useCreateRoleMutation();

  // State for new role inputs.
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // State for managing tabs.
  const [selectedTab, setSelectedTab] = useState<'user' | 'other'>('user');

  // Handle creating a new role.
  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRoleName.trim() === "") {
      toast.error("Role name is required");
      return;
    }

    try {
      // Sending the new role to the API
      const response = await createRole({
        name: newRoleName,
        permissions: selectedPermissions,
      }).unwrap();

      toast.success(response.message || 'Role created successfully');
      setNewRoleName(""); // Reset role name input
      setSelectedPermissions([]); // Reset permissions selection
    } catch (err: unknown) {
      // Handle error and check for type
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as ErrorResponse; // Type assertion
        toast.error(error?.data?.message || "Error creating role");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (isFetching) {
    return <div>Loading permissions...</div>;
  }

  if (error) {
    return <div>Error loading permissions</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
      <HrNavigation />
      <h2 className="text-2xl font-bold mb-4">Create a Role</h2>
      <form onSubmit={handleCreateRole}>
        {/* Role Name Input */}
        <label className="block mb-2 font-medium">Role Name:</label>
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Enter role name"
          className="w-full p-2 mb-3 border rounded-md"
          required
        />

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
            <div className="mb-4">
              {fetchedPermissions.map((perm) => (
                <label key={perm.id} className="flex items-center space-x-2 mb-2">
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
          <div style={{ marginBottom: '12px' }}>
            <label>Other Permissions:</label>
            <div className="mb-4">
              {/* Empty for now, can add future functionality */}
              <p>No other permissions available yet.</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Role"}
        </button>
      </form>
    </div>
  );
};

export default Page;
