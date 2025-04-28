'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
// import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetRolesQuery, useUpdateRoleMutation } from '@/slices/roles/rolesApi';
import { useFetchPermissionsQuery } from '@/slices/permissions/permissionApi';
import 'react-toastify/dist/ReactToastify.css';

interface Permission {
  id: number;
  name: string;
}
// interface PermissionGroup {
//   group: string;
//   permissions: Permission[];
// }

export default function EditRolePage() {
  const router = useRouter();
  const { companySlug, id } = useParams() as {
    companySlug: string;
    id: string;
  };

  /* ───────────────────── Role & permissions ───────────────────── */
  const { data: role, isLoading: roleLoading, error: roleError } = useGetRolesQuery( id );
  console.log('role', role);

  const {
    data: permissionGroups,
    isLoading: permLoading,
    error: permError,
  } = useFetchPermissionsQuery();

  const [updateRole, { isLoading: saving }] = useUpdateRoleMutation();
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions?.map((p: Permission) => p.name) || []);
    }
  }, [role]);

  useEffect(() => {
    if (permissionGroups?.length) setActiveTab(permissionGroups[0].group);
  }, [permissionGroups]);

  const togglePermission = (perm: string) =>
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Role name is required');

    try {
      await updateRole({
        companySlug,
        id: Number(id),
        name,
        permissions: selectedPermissions,
      }).unwrap();
      toast.success('Role updated!');
      router.push(`/${companySlug}/permissions/roles`);
    } catch {
      toast.error( 'Update failed');
    }
    
  };

  if (roleLoading || permLoading) return <p>Loading…</p>;
  if (roleError || permError || !role) return <p>Could not load data.</p>;

  return (
    <div className="edit-role-container add-role-form">
<h2>Edit a Role</h2>
  <form onSubmit={handleSubmit} className="edit-role-form">
  <div className="roll-name-input">
    <label>Edit role Name:</label>
    <input
      className="role-input"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Role name"
    />
        </div>

    <div className="switch-button">
      {permissionGroups?.map((g) => (
        <button
          key={g.group}
          type="button"
          onClick={() => setActiveTab(g.group)}
          className={`tab-buttons ${g.group === activeTab ? 'active' : ''}`}
        >
          {g.group}
        </button>
      ))}
    </div>



    {permissionGroups
      ?.filter((g) => g.group === activeTab)
      .map((g) => (
        <div key={g.group} className="permission-group">
          
          <div className="permission-group-header">
            {g.permissions.map((p) => (
            <label key={p.id} className="permission-label">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(p.name)}
                onChange={() => togglePermission(p.name)}
              />
              {p.name}
            </label>
          ))}
          </div>
        </div>
      ))}

    <button
      disabled={saving}
      className={`submit-button addrole-btn ${saving ? 'saving' : ''}`}
    >
      {saving ? 'Updating…' : 'Update role'}
    </button>
  </form>
</div>

  );
}
