"use client";
import React from "react";
import Link from "next/link";
import { useFetchProfileQuery } from "@/slices/auth/authApi";

const Sidebar = () => {
  const { companySlug, isFetching } = useFetchProfileQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      companySlug: data?.user?.company_slug,
      isFetching,
    }),
  });

  if (isFetching) return <p className="text-gray-500">Loading...</p>;
  if (!companySlug) return <p className="text-red-500">No company data found</p>;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          {[
            { name: "Dashboard", path: "dashboard" },
            { name: "Store", path: "store" },
            { name: "HR", path: "hr" },
            { name: "Permissions", path: "permissions" },
            { name: "Settings", path: "settings" },
            { name: "Task", path: "tasks" },
            { name: "Profile", path: "profile" },
          ].map(({ name, path }) => (
            <li key={path}>
              <Link
                href={`/${companySlug}/${path}`}
                className="block p-2 rounded hover:bg-gray-700"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
