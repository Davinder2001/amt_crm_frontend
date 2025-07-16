'use client'
import React from "react";
import { useFetchSelectedCompanyQuery } from "@/slices";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import { FaTriangleExclamation } from "react-icons/fa6";

const CompanyDetails = () => {
    const { data, isLoading, error } = useFetchSelectedCompanyQuery();

    if (isLoading) return <LoadingState />;
    if (error || !data) return
    <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to fetching company details."
        message="Something went wrong while fetching company details."
    />
        ;

    const company = data.selected_company;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Selected Company</h2>
            <h3>Name: {company?.company_name}</h3>
        </div>
    );
};

export default CompanyDetails;
