'use client';
import React, { useEffect, useState } from 'react';
import Profile from './components/profile';
import SearchBar from '../search/SearchBar';
import Link from 'next/link';
import { FaRegBell, FaBars } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Image from 'next/image';
import { logo } from '@/assets/useImage';
import { useRouter } from 'next/navigation';

interface headerProps {
  handleToggleSidebar: () => void;
  openMenu: () => void;
  isMobile: boolean;
}

const Header: React.FC<headerProps> = ({ handleToggleSidebar, openMenu, isMobile }) => {
  const { companySlug, userType } = useCompany();
  const { title } = useBreadcrumb();
  const router = useRouter();

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
      {isMobile && <Image src={logo.src} alt="logo" width={30} height={30} onClick={() => router.push(
        userType === 'employee'
          ? `/${companySlug}/employee/dashboard`
          : `/`
      )
      }
      />}
      {!isMobile && <FaBars size={20} style={{ cursor: 'pointer' }} onClick={handleToggleSidebar} />}
      <h1 className='header-title'>{title}</h1>
      <div className="nav-container">
        <SearchBar />
        <Link href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/notifications`}>
          <FaRegBell size={20} color='#009693' />
        </Link>
        <Profile />
      </div>
      {isMobile && <FaBars size={20} style={{ cursor: 'pointer' }} onClick={openMenu} className='m-toggle'/>}
    </div>

  );
};

export default Header;