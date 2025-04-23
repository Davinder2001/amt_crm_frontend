import Link from 'next/link'
import React from 'react'

const CompanyNav = () => {
  return (
    <>
        <nav>
            <ul>
                <li>
                    <Link href='/superadmin/companies'>All Companies</Link>
                </li>
                <li>
                    <Link href='/superadmin/companies/pending'>Pending Companies</Link>
                </li>
                <li>
                    <Link href='/superadmin/companies/admins'>All Admins</Link>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default CompanyNav