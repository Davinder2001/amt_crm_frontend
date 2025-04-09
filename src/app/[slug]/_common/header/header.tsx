
// 'use client';
// import React from 'react'
// import Profile from './components/profile'
// import SearchBar from '../search/SearchBar';
// import Link from 'next/link';
// import { FaRegBell, FaBars } from 'react-icons/fa';
// import { useCompany } from '@/utils/Company';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';

// interface headerProps {
//   handleToggleSidebar: () => void;
//   openMenu: () => void;
//   isMobile: boolean;
// }

// const Header: React.FC<headerProps> = ({ handleToggleSidebar, openMenu, isMobile }) => {
//   const { companySlug } = useCompany();
//   const { title } = useBreadcrumb();

//   return (

//     <div className='header'>
//      <div className='desktop-header'>
//      {isMobile ? (
//         <FaBars size={20} style={{ cursor: 'pointer' }} onClick={openMenu} />
//       ) : (
//         <FaBars size={20} style={{ cursor: 'pointer' }} onClick={handleToggleSidebar} />
//       )}
//       <h1>{title}</h1>
//       <div className="nav-container">
//         <SearchBar />
//         <Link href={`/${companySlug}/notifications`}> <FaRegBell size={20} color='#009693' /> </Link>
//         <Profile />
//       </div>
//      </div>
//      <div className='mobile-searchbar'>
//      <SearchBar />

//      </div>

//     </div>
//   )
// }

// export default Header










'use client';
import React, { useEffect, useState } from 'react';
import Profile from './components/profile';
import SearchBar from '../search/SearchBar';
import Link from 'next/link';
import { FaRegBell, FaBars } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

interface headerProps {
  handleToggleSidebar: () => void;
  openMenu: () => void;
  isMobile: boolean;
}

const Header: React.FC<headerProps> = ({ handleToggleSidebar, openMenu, isMobile }) => {
  const { companySlug } = useCompany();
  const { title } = useBreadcrumb();

  // State to manage sticky class
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const mainContent = document.querySelector('.main-content');  // Get the .main-content element

    const handleScroll = () => {
      if (mainContent) {
        // Get the scroll position of the .main-content element
        const scrollPosition = mainContent.scrollTop;

        // Calculate 1vh in pixels (1% of the viewport height)
        const threshold = window.innerHeight * 0.01;

        // Apply sticky class if scroll position is greater than 1% of viewport height
        if (scrollPosition > threshold) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    // Add scroll event listener to .main-content
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className={`header ${isSticky ? 'sticky' : ''}`}>
      
        {isMobile ? (
          <FaBars size={20} style={{ cursor: 'pointer' }} onClick={openMenu} />
        ) : (
          <FaBars size={20} style={{ cursor: 'pointer' }} onClick={handleToggleSidebar} />
        )}
        <h1 className='header-title'>{title}</h1>
        <div className="nav-container">
          <SearchBar />
          <Link href={`/${companySlug}/notifications`}>
            <FaRegBell size={20} color='#009693' />
          </Link>
          <Profile />
        </div>
      </div>
      
  );
};

export default Header;