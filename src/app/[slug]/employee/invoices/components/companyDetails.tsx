'use client'
import React from "react";
import { useFetchSelectedCompanyQuery } from "@/slices";

const CompanyDetails = () => {
    const { data, isLoading, isError } = useFetchSelectedCompanyQuery();

    if (isLoading) return <p>Loading company details...</p>;
    if (isError || !data) return <p>Failed to load company details.</p>;

    const company = data.selected_company;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Selected Company</h2>
            <h3>Name: {company?.company_name}</h3>
        </div>
    );
};

export default CompanyDetails;
