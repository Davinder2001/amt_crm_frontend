'use client';

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useCreateRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchPermissionsQuery } from "@/slices/permissions/permissionApi";
import { useRouter } from "next/navigation";
import { useCompany } from "@/utils/Company";

const Page: React.FC = () => {
  const { data } = useFetchPermissionsQuery();

  // Memoize permissionsData to avoid recalculating on each render
  const permissionsData = useMemo(() => data || [], [data]);

  const [createRole, { isLoading }] = useCreateRoleMutation();
  const router = useRouter();
  const { companySlug } = useCompany();

  const [newRoleName, setNewRoleName] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');

  // Set the default selected tab to the first group after permissions are fetched
  useEffect(() => {
    if (permissionsData.length > 0 && !selectedTab) {
      setSelectedTab(permissionsData[0].group); // Set the first tab by default
    }
  }, [permissionsData, selectedTab]);

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

      if (response.message) {
        toast.success(response.message);
        setNewRoleName("");
        setSelectedPermissions([]);
        router.push(`/${companySlug}/employee/permissions`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error creating role");
      } else {
        toast.error("Unknown error occurred");
      }
    }
  };

  return (
    <div className="add-role-form">
      <h2>Create a Role</h2>

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
          {permissionsData.map((group) => (
            <button
              type="button"
              key={group.group}
              onClick={() => setSelectedTab(group.group)}
              className={selectedTab === group.group ? 'active' : ''}
            >
              {group.group}
            </button>
          ))}
        </div>

        <div className="permissions-container">
          {/* Permissions List */}
          {permissionsData
            .filter((group) => group.group === selectedTab) // Filter permissions based on selected tab
            .map((group) => (
              <div key={group.group}>
                <div>
                  {group.permissions.map((perm) => (
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
            ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            onMouseOver={(e) => e.currentTarget}
            onMouseOut={(e) => e.currentTarget}
            className="addrole-btn"
          >
            {isLoading ? "Creating..." : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
