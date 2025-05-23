// "use client";
// import React, { useEffect } from 'react'
// import { useParams } from 'next/navigation';
// import { useGetAdminByIdQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';
// import { FaArrowLeft } from 'react-icons/fa';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import Link from 'next/link';


// const ViewAdminPage = () => {
//   const { setTitle } = useBreadcrumb();

//   useEffect(() => {
//     setTitle('Admin Details'); // Update breadcrumb title
//   }, [setTitle]);

//   const { id } = useParams();

//   const { data, isLoading, error } = useGetAdminByIdQuery(id as string);

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading admin.</p>;

//   const admin = data;

//   if (!admin) return <p>No admin data available.</p>;

//   return (
//     <div className="vadmin-container">
//       <div className='view-admin-back-btn'>
//         <Link href="/superadmin/companies" className='back-button'>
//           <FaArrowLeft size={16} color='#fff' />
//         </Link>
//       </div>
//       <div className="Vadmin-inner-container">

//         <div className="admin-card">
//           <p><strong>Name:</strong> {admin.name}</p>
//           <p><strong>Number:</strong> {admin.number}</p>
//           <p><strong>Email:</strong> {admin.email}</p>
//           <p><strong>UID:</strong> {admin.uid}</p>
//           {/* <p><strong>Status:</strong> {admin.user_status}</p> */}
//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               style={{
//                 color: admin.user_status === 'active' ? 'green' : admin.user_status === 'blocked' ? 'red' : 'black',
//                 textTransform: 'capitalize'
//               }}
//             >
//               {admin.user_status}
//             </span>
//           </p>

//           <p><strong>Created At:</strong> {new Date(admin.created_at).toLocaleString()}</p>
//         </div>

//         <h2 className="admin-subtitle">Associated Companies</h2>

//         <div className="company-cards-wrapper">
//           {admin.companies?.length > 0 ? (
//             admin.companies.map((company: Company) => (
//               <div key={company.id} className="company-card">
//                 <h3>{company.name}</h3>
//                 <p><strong>Slug:</strong> {company.slug}</p>
//               </div>
//             ))
//           ) : (
//             <p className="no-companies">No associated companies.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewAdminPage;











"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetAdminByIdQuery } from "@/slices/superadminSlices/adminManagement/adminManageApi";
import { FaArrowLeft } from "react-icons/fa";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import Link from "next/link";
import Image from "next/image";

const ViewAdminPage = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle("Admin Details");
  }, [setTitle]);

  const { id } = useParams();
  const { data, isLoading, error } = useGetAdminByIdQuery(id as string);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading admin.</p>;

  const admin = data?.admin;
  if (!admin) return <p>No admin data available.</p>;

  return (
    <div className="vadmin-container">
      <div className="view-admin-back-btn">
        <Link href="/superadmin/companies" className="back-button">
          <FaArrowLeft size={16} color="#fff" />
        </Link>
      </div>

      <div className="Vadmin-inner-container">
        <div className="admin-card">
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Number:</strong> {admin.number}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>UID:</strong> {admin.uid}</p>
          <p><strong>User Type:</strong> {admin.user_type}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  admin.user_status === "active"
                    ? "green"
                    : admin.user_status === "blocked"
                      ? "red"
                      : "black",
                textTransform: "capitalize",
              }}
            >
              {admin.user_status}
            </span>
          </p>
          <p>
            <strong>Email Verified At:</strong>{" "}
            {admin.email_verified_at
              ? new Date(admin.email_verified_at).toLocaleString()
              : "Not verified"}
          </p>
          {/* <p><strong>Created At:</strong> {new Date(admin.created_at).toLocaleString()}</p>
          <h2 className="admin-subtitle">Roles</h2>
          <div className="roles-wrapper">
            {admin.roles?.length > 0 ? (
              admin.roles.map((role, index) => (
                <div key={index} className="role-card">
                  <p><strong>Name:</strong> {role.name}</p>
                  <p><strong>Company ID:</strong> {role.company_id}</p>
                  <p><strong>Permissions:</strong> {role.permissions.length > 0 ? role.permissions.join(", ") : "None"}</p>
                </div>
              ))
            ) : (
              <p className="no-roles">No roles assigned.</p>
            )}
          </div> */}

          {/* Show profile image if available */}
          {admin.profile_image && (
            <div>
              <strong>Profile Image:</strong>
              <br />
              <Image
                src={admin.profile_image}
                alt="Profile"
                width={100}
                height={100}
                style={{ borderRadius: "8px", marginTop: "8px" }}
              />
            </div>
          )}
        </div>


        <h2 className="admin-subtitle">Associated Companies</h2>
        <div className="company-cards-wrapper">
          {admin.companies?.length > 0 ? (
            admin.companies.map((company) => (
              <div key={company.id} className="company-card">
                <h3>{company.name}</h3>
                <p><strong>Slug:</strong> {company.slug}</p>
              </div>
            ))
          ) : (
            <p className="no-companies">No associated companies.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAdminPage;
