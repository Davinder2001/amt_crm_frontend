// 'use client';
// import React from 'react'
// import Profile from './components/profile'
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import SearchBar from '../search/SearchBar';
// import Link from 'next/link';
// import {FaRegBell } from 'react-icons/fa';
// import { useCompany } from '@/utils/Company';

// const Header = () => {
//   const { title } = useBreadcrumb();
//   const {companySlug} = useCompany();

//   return (
//     <div className='header'>
//       <h1 >{title}</h1>
//       <div className="nav-container">
//         <SearchBar/>
//         <Link href={`/${companySlug}/notifications`}> <FaRegBell size={20} color='#009693'/> </Link>
//         <Profile />
//       </div>


//     </div>
//   )
// }

// export default Header














'use client';
import React from 'react'
import Profile from './components/profile'
import SearchBar from '../search/SearchBar';
import Link from 'next/link';
import { FaRegBell, FaBars } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

interface headerProps {
  handleToggleSidebar: () => void;
}

const Header: React.FC<headerProps> = ({ handleToggleSidebar }) => {
  const { companySlug } = useCompany();
  const { title } = useBreadcrumb();

  return (
    <div className='header'>
      <FaBars size={20} style={{ cursor: 'pointer' }} onClick={handleToggleSidebar} />
      <h1>{title}</h1>
      <div className="nav-container">
        <SearchBar />
        <Link href={`/${companySlug}/notifications`}> <FaRegBell size={20} color='#009693' /> </Link>
        <Profile />
      </div>
    </div>
  )
}

export default Header