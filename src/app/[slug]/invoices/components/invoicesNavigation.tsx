import Link from 'next/link'
import React from 'react'

const InvoicesNavigation = () => {
  return (
    <>
        <nav className='invoice-nav-section'>
            <ul  className='invoice-nav-buttons'>
                <li>
                    < Link href="invoices/new-invoice" className='buttons'>Add Invoices</Link>
                </li>
                <li>
                    <Link href="invoices/customers" className='buttons' >All Customers</Link>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default InvoicesNavigation