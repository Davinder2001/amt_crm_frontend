"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetAdminByIdQuery } from "@/slices/superadminSlices/adminManagement/adminManageApi";
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaFingerprint, FaUserShield, FaCheckCircle, FaCalendarAlt, FaBuilding } from "react-icons/fa";
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
              <span className={`status ${admin.user_status}`}>
                {admin.user_status}
              </span>
            </p>
          </div>
          <div className="admin-details">
            <p> <span className="admin-details-lable-wrapper"> <FaUser style={{ color: "var(--primary-color)" }} /> <strong>Name: </strong> </span> {admin.name}</p>
            <p> <span className="admin-details-lable-wrapper"> <FaPhone style={{ color: "var(--primary-color)" }} /> <strong>Number:</strong></span>   {admin.number}</p>
            <p> <span className="admin-details-lable-wrapper"> <FaEnvelope style={{ color: "var(--primary-color)" }} /> <strong>Email:</strong> </span> {admin.email}</p>
            <p> <span className="admin-details-lable-wrapper"> <FaFingerprint style={{ color: "var(--primary-color)" }} /> <strong>UID:</strong></span>  {admin.uid}</p>
            <p> <span className="admin-details-lable-wrapper"> <FaUserShield style={{ color: "var(--primary-color)" }} /> <strong>User Type:</strong></span>   {admin.user_type}</p>
            <p>
              <span className="admin-details-lable-wrapper"> <FaCheckCircle style={{ color: "var(--primary-color)" }} /> <strong>Email Verified At:</strong>{" "}</span>
              {admin.email_verified_at
                ? new Date(admin.email_verified_at).toLocaleString()
                : "Not verified"}
            </p>
            <p><span className="admin-details-lable-wrapper"> <FaCalendarAlt style={{ color: "var(--primary-color)" }} /> <strong>Created At:</strong></span> {new Date(admin.created_at).toLocaleString()}</p>
            <p><span className="admin-details-lable-wrapper"> <FaBuilding style={{ color: "var(--primary-color)" }} /> <strong>Company ID:</strong> </span> {admin.company_id || admin.roles?.[0]?.company_id || "Not available"}</p>
          </div>
        </div>
        <div className="company-cards-outer">
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
    </div>
  );
};

export default ViewAdminPage;
