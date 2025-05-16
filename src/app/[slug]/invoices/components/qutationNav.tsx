"use client";

import Link from 'next/link'
import React from 'react'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'
import { useCompany } from '@/utils/Company';

const QutationNav = () => {
  const { companySlug } = useCompany();

  return (
    <>
      <nav className='invoice-nav-section'>
        <Link href={`/${companySlug}/invoices`} className='back-button'>
          <FaArrowLeft size={20} color='#fff' />
        </Link>
        <ul className='invoice-nav-buttons'>
          <li>
            <Link href="qutations/add" className="qutation-button">
              <span>
                <FaPlus className="icon" />
                <span>Generate Qutation</span>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default QutationNav