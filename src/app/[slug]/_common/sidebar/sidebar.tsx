// "use client";
// import React from "react";
// import Link from "next/link";
// import { useFetchProfileQuery } from "@/slices/auth/authApi";

// const Sidebar = () => {
//     const { data: profile, isFetching } = useFetchProfileQuery();

//     // Get the company_slug from authenticated user
//     const companySlug = profile?.user?.company_slug;

//     if (isFetching) return <p>Loading...</p>; // Show loading state
//     if (!companySlug) return <p>No company data found</p>; // Handle missing data

//     return (
//         <div>
//             <ul>
//                 <li>
//                     <Link href={`/${companySlug}/dashboard`}>
//                         Dashboard
//                     </Link>
//                 </li>
//                 <li>
//                     <Link href={`/${companySlug}/store`}>
//                         Store
//                     </Link>
//                 </li>
//                 <li>
//                     <Link href={`/${companySlug}/hr`}>
//                         HR
//                     </Link>
//                 </li>
//                 <li>
//                     <Link href={`/${companySlug}/permissions`}>
//                         Permissions
//                     </Link>
//                 </li>
//                 <li>
//                     <Link href={`/${companySlug}/settings`}>
//                         Settings
//                     </Link>
//                 </li>
//             </ul>
//         </div>
//     );
// };

// export default Sidebar;








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
