"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from 'next/link';
import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";

interface Role {
  id: number;
  name: string;
  company_id: string;
  permissions: { id: number; name: string }[];
}

const RoleList: React.FC = () => {
  const router = useRouter();

  const { data: roles, isLoading, error } = useGetRolesQuery(undefined);

  const [deleteRole] = useDeleteRoleMutation();

  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
    } catch (err: any) {
      console.error("Error deleting role:", err);
      toast.error(err?.data?.message || "Error deleting role");
    }
  };

  if (isLoading) return <div>Loading roles...</div>;
  if (error) {
    toast.error("Error loading roles");
    return <div>Error loading roles.</div>;
  }

  return (
    <div>
      <div>
        <h2>Role List</h2>
        <Link href="hr/add-role">Add Role</Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Company ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles && roles.length > 0 ? (
            roles.map((role: Role & { company_id: string }) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>
                  {role.permissions.length
                    ? role.permissions.map((perm) => perm.name).join(", ")
                    : "None"}
                </td>
                <td>{role.company_id}</td>
                <td>
                  <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No roles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;
