import Link from 'next/link'
import React from 'react'

const InvoicesNavigation = () => {
  return (
    <>
        <nav>
            <ul>
                <li>
                    <Link href="invoices/new-invoice">Add Invoices</Link>
                </li>
                <li>
                    <Link href="invoices/all-customers">All Customers</Link>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default InvoicesNavigation