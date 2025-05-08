import Link from 'next/link'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

const InvoicesNavigation = () => {
  return (
    <>
        <nav className='invoice-nav-section'>
            <ul  className='invoice-nav-buttons'>
                <li>
                    < Link href="invoices/new-invoice" className='buttons'> <FaPlus/>Add Invoices</Link>
                </li>
                <li>
                    <Link href="invoices/customers" className='buttons' >All Customers</Link>
                </li>
                <li>
                    <Link href="invoices/credits" className='buttons' >Credits</Link>
                </li>
                <li>
                    <Link href="invoices/qutations" className='buttons' >Qutations</Link>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default InvoicesNavigation