'use client';

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCreateRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchPermissionsQuery } from "@/slices/permissions/permissionApi";
import HrNavigation from "../components/hrNavigation";
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
    <div
      className="max-w-2xl mx-auto"
      style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginTop: '40px',
      }}
    >
      <HrNavigation />

      <h2
        style={{
          fontSize: '30px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
        }}
      >
        Create a Role
      </h2>

      <form onSubmit={handleCreateRole}>

        {/* Role Name */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', display: 'block' }}>Role Name:</label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name"
            style={{
              width: '100%',
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
            }}
            required
          />
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
          <button
            type="button"
            onClick={() => setSelectedTab('user')}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: '8px',
              backgroundColor: selectedTab === 'user' ? '#2563EB' : '#E5E7EB',
              color: selectedTab === 'user' ? '#fff' : '#333',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            User Permissions
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('other')}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: '8px',
              backgroundColor: selectedTab === 'other' ? '#2563EB' : '#E5E7EB',
              color: selectedTab === 'other' ? '#fff' : '#333',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Other Permissions
          </button>
        </div>

        {/* Permissions List */}
        {selectedTab === 'user' && (
          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', display: 'block' }}>User Permissions:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {permissions?.map((perm) => (
                <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '16px', color: '#333' }}>{perm.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'other' && (
          <div style={{ marginBottom: '30px' }}>
            <label style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', display: 'block' }}>Other Permissions:</label>
            <p style={{ color: '#555', fontSize: '16px' }}>No other permissions available yet.</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#2563EB',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            border: 'none',
            transition: 'background 0.3s ease',
          }}
          disabled={isLoading}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1E40AF')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          {isLoading ? "Creating..." : "Create Role"}
        </button>
      </form>
    </div>
  );
};

export default Page;
