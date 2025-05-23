
// "use client";
// import React, { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useGetAdminByIdQuery } from "@/slices/superadminSlices/adminManagement/adminManageApi";
// import { FaArrowLeft } from "react-icons/fa";
// import { useBreadcrumb } from "@/provider/BreadcrumbContext";
// import Link from "next/link";
// import Image from "next/image";
// import { adminlogo } from "@/assets/useImage";

// const ViewAdminPage = () => {
//   const { setTitle } = useBreadcrumb();

//   useEffect(() => {
//     setTitle("Admin Details");
//   }, [setTitle]);

//   const { id } = useParams();
//   const { data, isLoading, error } = useGetAdminByIdQuery(id as string);

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading admin.</p>;

//   const admin = data?.admin;
//   if (!admin) return <p>No admin data available.</p>;

//   return (
//     <div className="vadmin-container">
//       <div className="view-admin-back-btn">
//         <Link href="/superadmin/admins" className="back-button">
//           <FaArrowLeft size={16} color="#fff" />
//         </Link>
//       </div>

//       <div className="Vadmin-inner-container">
//         <div className="admin-card">
//           <p><strong>Name:</strong> {admin.name}</p>
//           <p><strong>Number:</strong> {admin.number}</p>
//           <p><strong>Email:</strong> {admin.email}</p>
//           <p><strong>UID:</strong> {admin.uid}</p>
//           <p><strong>User Type:</strong> {admin.user_type}</p>

//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               style={{
//                 color:
//                   admin.user_status === "active"
//                     ? "green"
//                     : admin.user_status === "blocked"
//                       ? "red"
//                       : "black",
//                 textTransform: "capitalize",
//               }}
//             >
//               {admin.user_status}
//             </span>
//           </p>
//           <p>
//             <strong>Email Verified At:</strong>{" "}
//             {admin.email_verified_at
//               ? new Date(admin.email_verified_at).toLocaleString()
//               : "Not verified"}
//           </p>

//           <p><strong>Created At:</strong> {new Date(admin.created_at).toLocaleString()}</p>
//           <p><strong>Company ID:</strong> {admin.company_id || admin.roles?.[0]?.company_id || "Not available"}</p>
//           <div>
//             <strong>Profile Image:</strong>
//             <br />
//             <Image
//               src={admin.profile_image || adminlogo}
//               alt="Profile"
//               width={100}
//               height={100}
//               style={{ borderRadius: "8px", marginTop: "8px" }}
//               onError={(e) => {
//                 const target = e.target as HTMLImageElement;
//                 target.src = adminlogo.src;
//               }}
//             />
//           </div>


//         </div>


//         <h2 className="admin-subtitle">Associated Companies</h2>
//         <div className="company-cards-wrapper">
//           {admin.companies?.length > 0 ? (
//             admin.companies.map((company) => (
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
import { adminlogo } from "@/assets/useImage";

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
        <Link href="/superadmin/admins" className="back-button">
          <FaArrowLeft size={16} color="#fff" />
        </Link>
      </div>

      <div className="Vadmin-inner-container">
        <div className="admin-card">
          <div className="admin-image-container">
            <Image
              src={admin.profile_image || adminlogo}
              alt="Profile"
              className="admin-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = adminlogo.src;
              }}
            />
            <p>
              {" "}
              <span className={`status ${admin.user_status}`}>
                {admin.user_status}
              </span>
            </p>
          </div>
          <div className="admin-details">
            <p><strong>Name:</strong> {admin.name}</p>
            <p><strong>Number:</strong> {admin.number}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>UID:</strong> {admin.uid}</p>
            <p><strong>User Type:</strong> {admin.user_type}</p>

            <p>
              <strong>Email Verified At:</strong>{" "}
              {admin.email_verified_at
                ? new Date(admin.email_verified_at).toLocaleString()
                : "Not verified"}
            </p>
            <p><strong>Created At:</strong> {new Date(admin.created_at).toLocaleString()}</p>
            <p><strong>Company ID:</strong> {admin.company_id || admin.roles?.[0]?.company_id || "Not available"}</p>
          </div>
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
