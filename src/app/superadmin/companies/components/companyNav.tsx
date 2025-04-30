import Link from 'next/link'
import React from 'react'

const CompanyNav = () => {
  return (
    <>
        <nav>
            <div className='Scompany-nav-outer'>
            <ul>
                <li className='buttons'>
                    <Link href='/superadmin/companies'>All Companies</Link>
                </li>
                <li className='buttons'>
                    <Link href='/superadmin/companies/pending'>Pending Companies</Link>
                </li>
            </ul>
            </div>
        </nav>
    </>
  )
}

export default CompanyNav