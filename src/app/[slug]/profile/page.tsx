'use client'
import React from "react";
import ChangePassword from "./components/changePassword";
import { useFetchProfileQuery } from "@/slices/auth/authApi";

const Page = () => {
  const { data, isLoading, isError } = useFetchProfileQuery();

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
            <p key={key}><strong>{key.replace("_", " ")}:</strong> {value}</p>
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
