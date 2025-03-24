'use client'
import React, { useEffect } from "react";
import ChangePassword from "./components/changePassword";
import { useFetchProfileQuery } from "@/slices/auth/authApi";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";

const Page = () => {
  const { data, isLoading, isError } = useFetchProfileQuery();
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Profile'); // Update breadcrumb title
  }, [setTitle]);

  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Failed to load profile.</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>ID:</strong> {data?.user.id}</p>
      <p><strong>Name:</strong> {data?.user.name}</p>
      <p><strong>Number:</strong> {data?.user.number}</p>
      <p><strong>Company:</strong> {data?.user.company_name} ({data?.user.company_slug})</p>

      {data?.user.meta && (
        <div>
          <h2>Additional Info</h2>
          {Object.entries(data.user.meta).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace("_", " ")}:</strong>{" "}
              {typeof value === "object" ? JSON.stringify(value) : value}
            </p>
          ))}
        </div>
      )}



<>
<ChangePassword/>
</>


    </div>

      


  );
};

export default Page;
