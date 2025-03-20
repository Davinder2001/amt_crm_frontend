'use client';

import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchProfileQuery, useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";

// Define the Role type
interface Role {
  id: number;
  name: string;
  company_id: string;
  permissions: { id: number; name: string }[];
}

const RoleList: React.FC = () => {
  // Remove the router variable since it's not being used
  const { data: rolesData, isLoading, error } = useGetRolesQuery(undefined);
  const [deleteRole] = useDeleteRoleMutation();
  // Fetch company slug
    const { data: selectedCompany, isFetching } = useFetchSelectedCompanyQuery();
    // Extract companySlug from selectedCompany
    const companySlug = selectedCompany?.selected_company?.company_slug;

  // Handle delete role logic
  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
    } catch (err: unknown) {
      // Type narrowing to safely handle the error
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as { data: { message: string } };
        toast.error(error?.data?.message || "Error deleting role");
      } else {
        toast.error("An unexpected error occurred.");
      }
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
        <Link href={`/${companySlug}/hr/add-role`}>Add Role</Link>
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
          {rolesData && rolesData.total > 0 ? (
            rolesData?.roles.map((role: Role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>
                  {role.permissions
                    ? role.permissions.map((perm) => perm.name).join(", ")
                    : "None"}
                </td>
                <td>{role.company_id}</td>
                <td>
                  <Link href={`/${companySlug}/hr/edit-role/${role.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDeleteRole(role.id)}>
                    Delete
                  </button>
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
