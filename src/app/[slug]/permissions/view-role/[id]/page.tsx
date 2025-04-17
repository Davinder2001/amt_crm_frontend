'use client'

import { useParams } from 'next/navigation'
import { useGetRoleQuery } from '@/slices/roles/rolesApi'

export default function ViewRolePage() {
  const { id } = useParams()
  const { data: wrapped, isLoading, isError } = useGetRoleQuery(id!)

  if (isLoading)  return <div>Loading…</div>
  if (isError || !wrapped?.data) return <div>Failed to load role #{id}</div>

  const role = wrapped.data

  return (
    <div style={{ padding: 20 }}>
      <h1>Role: {role.name} (#{role.id})</h1>
      <p><strong>Company ID:</strong> {role.company_id}</p>

      <h2>Permissions</h2>
      {role.permissions.length > 0 ? (
        <ul>
          {role.permissions.map((perm) => (
            <li key={perm.id}>{perm.name}</li>
          ))}
        </ul>
      ) : (
        <p><em>No permissions assigned.</em></p>
      )}
    </div>
  )
}
