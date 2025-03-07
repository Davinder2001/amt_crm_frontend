"use client";
import React from "react";
import Link from "next/link";
import { useFetchProfileQuery } from "@/slices/auth/authApi";

const Sidebar = () => {
    const { data: profile, isFetching } = useFetchProfileQuery();

    // Get the company_slug from authenticated user
    const companySlug = profile?.user?.company_slug;

    if (isFetching) return <p>Loading...</p>; // Show loading state
    if (!companySlug) return <p>No company data found</p>; // Handle missing data

    return (
        <div>
            <ul>
                <li>
                    <Link href={`/${companySlug}/dashboard`}>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href={`/${companySlug}/store`}>
                        Store
                    </Link>
                </li>
                <li>
                    <Link href={`/${companySlug}/hr`}>
                        HR
                    </Link>
                </li>
                <li>
                    <Link href={`/${companySlug}/permissions`}>
                        Permissions
                    </Link>
                </li>
                <li>
                    <Link href={`/${companySlug}/settings`}>
                        Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
