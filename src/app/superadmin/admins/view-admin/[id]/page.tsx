"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetAdminByIdQuery } from "@/slices/superadminSlices/adminManagement/adminManageApi";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import Link from "next/link";
import Image from "next/image";
import { adminlogo } from "@/assets/useImage";
import { FaArrowLeft, FaBuilding, FaCalendarAlt, FaCheckCircle, FaEnvelope, FaFingerprint,  FaPhoneAlt, FaUserShield } from "react-icons/fa";

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
        <div className="admin-details-row">
          <div className="modern-admin-card">
            <div className="admin-image-side">
              <Image
                src={admin.profile_image || adminlogo}
                alt="Admin"
                width={120}
                height={120}
                className="admin-avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = adminlogo.src;
                }}
              />
              <span className={`admin-status ${admin.user_status}`}>{admin.user_status}</span>
            </div>

            <div className="admin-info-side-outer">
              <h2>{admin.name}</h2>
              <div className="admin-info-side">
                <div className="admin-field"><FaPhoneAlt /> <span className="view-admin-details"> <strong>Number:</strong> {admin.number}</span></div>
                <div className="admin-field"><FaEnvelope /><span className="view-admin-details"><strong>Email:</strong> {admin.email}</span></div>
                <div className="admin-field"><FaFingerprint /><span className="view-admin-details"><strong>UID:</strong>  {admin.uid}</span></div>
                <div className="admin-field"><FaUserShield /><span className="view-admin-details"><strong>User Type:</strong> {admin.user_type}</span></div>
                <div className="admin-field"><FaCheckCircle /><span className="view-admin-details"><strong>Email Verified:</strong>  {admin.email_verified_at ? new Date(admin.email_verified_at).toLocaleString() : "Not verified"}</span></div>
                <div className="admin-field"><FaCalendarAlt /><span className="view-admin-details"> <strong>Created At:</strong> {new Date(admin.created_at).toLocaleString()}</span></div>
                <div className="admin-field"><FaBuilding /><span className="view-admin-details"><strong>Company ID:</strong>  {admin.company_id || admin.roles?.[0]?.company_id || "Not available"}</span></div>
              </div>
            </div>
          </div>



        </div>



        <div className="company-cards-outer">
          <h2 className="admin-subtitle">Associated Companies</h2>
          <div className="company-cards-wrapper">
            {admin.companies?.length > 0 ? (
              admin.companies.map((company, index) => (
                <div key={company.id} className="company-card">
                  <h3>{index + 1}. {company.name}</h3>
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
