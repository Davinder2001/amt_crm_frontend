'use client';
import React from 'react'
import Profile from './components/profile'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import SearchBar from '../search/SearchBar';
import Link from 'next/link';
import { FaBell, FaRegBell } from 'react-icons/fa';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';

const Header = () => {
  const { title } = useBreadcrumb();
  const {currentData} = useFetchSelectedCompanyQuery();

  return (
    <div className='header'>
      <h1 style={{margin: 0, fontSize: '25px'}}>{title}</h1>
      <div className="nav-container">
        <SearchBar/>
        <Link href={`/${currentData?.selected_company.company_slug}/notifications`}> <FaRegBell size={20} color='#009693'/> </Link>
        <Profile />
      </div>

      <style jsx>{`
      .header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin: 20px 0px;
      }
      .nav-container{
      display: flex;
      align-items: center;
      flex: 1;
      background-color: #fff;
      border-radius: 50px;
      padding: 5px 10px;
      gap: 20px;
      max-width: 70%;
      width: 100%;
      }
      `}</style>
    </div>
  )
}

export default Header