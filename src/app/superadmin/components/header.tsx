'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaRegBell, FaBars, FaArrowLeft } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import Image from 'next/image';
import { logo } from '@/assets/useImage';
import { usePathname, useRouter } from 'next/navigation';
import { useFetchNotificationsQuery } from '@/slices';
import SearchBar from '@/app/[slug]/_common/search/SearchBar';
import Profile from '@/app/[slug]/_common/header/components/profile';
import GoogleTranslate from '@/components/common/GoogleTranslate';

interface headerProps {
  openMenu: () => void;
  isMobile: boolean;
}

const Header: React.FC<headerProps> = ({ openMenu, isMobile }) => {
  const { companySlug, userType } = useCompany();
  const pathname = usePathname();
  const router = useRouter();

  // State to manage sticky class
  const [isSticky, setIsSticky] = useState(false);
  const shouldShowBackButton = !isMobile && !pathname?.toLowerCase().includes('dashboard');

  // ✅ Fetch notifications
  const { data } = useFetchNotificationsQuery(undefined, {
    pollingInterval: 30000, // (Optional) Refresh every 30 sec for live updates
  });

  // ✅ Calculate unread count
  const unreadCount = data?.notifications?.filter((n) => !n.read_at)?.length || 0;

  useEffect(() => {
    const mainContent = document.querySelector('.main-content');

    const handleScroll = () => {
      if (mainContent) {
        const scrollPosition = mainContent.scrollTop;
        const threshold = window.innerHeight * 0.01;
        setIsSticky(scrollPosition > threshold);
      }
    };

    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className={`header ${isSticky ? 'sticky' : ''}`}>
      {isMobile && (
        <Image
          src={logo.src}
          alt="logo"
          width={30}
          height={30}
          onClick={() =>
            router.push(
              userType === 'employee'
                ? `/${companySlug}/employee/dashboard`
                : `/`
            )
          }
        />
      )}
      {shouldShowBackButton ? (
        <span className='back-button' onClick={() => router.back()}>
          <FaArrowLeft />
        </span>
      ) : <span></span>}
      <div className="nav-container relative flex items-center gap-4">
        <SearchBar />
        <GoogleTranslate />

        {/* Notification Icon with Unread Count */}
        <Link href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/notifications`} className="relative">
          <FaRegBell size={22} color="var(--primary-color)" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        <Profile />
      </div>
      {isMobile && (
        <FaBars size={20} style={{ cursor: 'pointer' }} onClick={openMenu} className="m-toggle" />
      )}
    </div>
  );
};

export default Header;
