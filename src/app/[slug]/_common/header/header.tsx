'use client';
import React from 'react'
import Profile from './components/profile'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import SearchBar from '../search/SearchBar';
import Link from 'next/link';
import {FaRegBell } from 'react-icons/fa';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';

const Header = () => {
  const { title } = useBreadcrumb();
  const {currentData} = useFetchSelectedCompanyQuery();

  return (
    <div className='header'>
      <h1 >{title}</h1>
      <div className="nav-container">
        <SearchBar/>
        <Link href={`/${currentData?.selected_company.company_slug}/notifications`}> <FaRegBell size={20} color='#009693'/> </Link>
        <Profile />
      </div>

      
    </div>
  )
}

export default Header