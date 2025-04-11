import { useCompany } from '@/utils/Company'
import Link from 'next/link'
import React from 'react'

const InvoicesNavigation = () => {
    const { companySlug } = useCompany();
    return (
        <>
            <nav className='invoice-nav-section'>
                <ul className='invoice-nav-buttons'>
                    <li>
                        < Link href={`/${companySlug}/employee/invoices/new-invoice`} className='buttons'>Add Invoices</Link>
                    </li>
                    <li>
                        <Link href={`/${companySlug}/employee/invoices/customers`} className='buttons' >All Customers</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default InvoicesNavigation