'use client';
import { useCompany } from '@/utils/Company'
import React from 'react'

function CompanyDetails() {
    const { companySlug } = useCompany();
    return (
        <>
            <h1>{companySlug}</h1>
        </>
    )
}

export default CompanyDetails