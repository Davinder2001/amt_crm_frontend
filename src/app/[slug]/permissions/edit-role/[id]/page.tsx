'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetRolesQuery, useUpdateRoleMutation } from '@/slices/roles/rolesApi';
import { useFetchPermissionsQuery } from '@/slices/permissions/permissionApi';
import 'react-toastify/dist/ReactToastify.css';

interface Permission {
  id: number;
  name: string;
}
interface PermissionGroup {
  group: string;
  permissions: Permission[];
}

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
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Update failed');
    }
    
  };

  if (roleLoading || permLoading) return <p>Loading…</p>;
  if (roleError || permError || !role) return <p>Couldn’t load data.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Edit role</h1>

      <form onSubmit={handleSubmit}>
        <input
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Role name"
        />

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {permissionGroups?.map((g) => (
            <button
              key={g.group}
              type="button"
              onClick={() => setActiveTab(g.group)}
              style={{
                padding: '8px 14px',
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: g.group === activeTab ? '#0070f3' : '#aaa',
                color: '#fff',
              }}
            >
              {g.group}
            </button>
          ))}
        </div>

        {permissionGroups
          ?.filter((g) => g.group === activeTab)
          .map((g) => (
            <div key={g.group} style={{ marginBottom: 24 }}>
              <h3>{g.group} permissions</h3>
              {g.permissions.map((p) => (
                <label key={p.id} style={{ display: 'block', marginBottom: 6 }}>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(p.name)}
                    onChange={() => togglePermission(p.name)}
                    style={{ marginRight: 6 }}
                  />
                  {p.name}
                </label>
              ))}
            </div>
          ))}

        <button
          disabled={saving}
          style={{
            width: '100%',
            padding: 12,
            background: saving ? '#888' : '#0070f3',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {saving ? 'Updating…' : 'Update role'}
        </button>
      </form>
    </div>
  );
}
