'use client';

import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";
import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const RoleList: React.FC = () => {
  const { data: rolesData, isLoading, error } = useGetRolesQuery(undefined);
  const [deleteRole] = useDeleteRoleMutation();
    const { data: selectedCompany } = useFetchSelectedCompanyQuery();
    const companySlug = selectedCompany?.selected_company?.company_slug;

  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
    } catch (err: unknown) {
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
      <div className="navigation-buttons">
        <Link className="navigation-button" href={`/${companySlug}/permissions/add-role`}><FaPlus/>Add Role</Link>
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
                  <Link  href={`/${companySlug}/permissions/edit-role/${role.id}`}>
                    <span><FaEdit color='#222' /></span>
                  </Link>
                  <span onClick={() => handleDeleteRole(role.id)}>
                     <FaTrash color='#222' />
                  </span>
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



























// 'use client';

// import React from "react";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";
// import { useFetchSelectedCompanyQuery } from "@/slices/auth/authApi";
// import { FaTrash } from "react-icons/fa";
// import { useFetchEmployesQuery } from "@/slices/employe/employe";
// import { addRole } from "@/assets/useImage";  // Ensure addRole is correctly exported from the specified path.
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const RoleList: React.FC = () => {
//   const { data: rolesData, isLoading, error } = useGetRolesQuery(undefined);
//   const [deleteRole] = useDeleteRoleMutation();
//   const { data: selectedCompany } = useFetchSelectedCompanyQuery();
//   const companySlug = selectedCompany?.selected_company?.company_slug;
//   const { currentData } = useFetchEmployesQuery();
//   const router = useRouter();

//   // Extract the employee roles
//   const employees = currentData?.employees ?? [];

//   // Calculate the count of users for each role
//   const getRoleUserCount = (roleId: number) => {
//     return employees.filter((emp) =>
//       emp.roles.some((role) => role.id === roleId)
//     ).length;
//   };

//   const handleDeleteRole = async (id: number) => {
//     try {
//       await deleteRole(id).unwrap();
//       toast.success("Role deleted successfully");
//     } catch (err: unknown) {
//       if (err && typeof err === 'object' && 'data' in err) {
//         const error = err as { data: { message: string } };
//         toast.error(error?.data?.message || "Error deleting role");
//       } else {
//         toast.error("An unexpected error occurred.");
//       }
//     }
//   };

//   if (isLoading) return <div>Loading roles...</div>;
//   if (error) {
//     toast.error("Error loading roles");
//     return <div>Error loading roles.</div>;
//   }

//   return (
//     <div className="permissions-page">
//       <h5>Role List</h5>
//       <div className="role-cards-container">
//         {rolesData && rolesData.total > 0 ? (
//           rolesData?.roles.map((role: Role) => {
//             const userCount = getRoleUserCount(role.id);
//             return (
//               <div className="role-card" key={role.id}>
//                 <div className="role-card-header">
//                   <p>Total {userCount} user{userCount !== 1 ? 's' : ''}</p>
//                 </div>
//                 <div className="role-card-actions">
//                   <h3>{role.name}</h3>
//                   <div className="role-action">
//                     <Link href={`/${companySlug}/permissions/edit-role/${role.id}`}>
//                       Edit Role
//                     </Link>
//                     <span onClick={() => handleDeleteRole(role.id)}>
//                       <FaTrash color="#009693" />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div>No roles found.</div>
//         )}

//         <div className="add-role-card">
//           <Image src={addRole.src} alt="Add Role" width={100} height={100} />
//           <div className="add-role-body">
//             <button onClick={() => router.push(`/${companySlug}/add-role`)}>
//               Add Role
//             </button>
//             <p>Add new role, if it doesn't exist.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleList;
