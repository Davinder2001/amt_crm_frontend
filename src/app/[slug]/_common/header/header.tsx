'use client';
import React, { useEffect, useState } from 'react';
import Profile from './components/profile';
import SearchBar from '../search/SearchBar';
import Link from 'next/link';
import { FaRegBell, FaBars, FaArrowLeft } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import Image from 'next/image';
import { logo } from '@/assets/useImage';
import { usePathname, useRouter } from 'next/navigation';
import { useFetchNotificationsQuery } from '@/slices/notifications/notificationsApi';
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
  const { data } = useFetchNotificationsQuery();

  // ✅ Calculate unread count
  // If data has a 'notifications' array property, use it; otherwise, adjust as needed
  const notifications = Array.isArray(data) ? data : data?.notifications || [];
  const unreadCount = notifications.filter((notification: Notification) => notification.read_at === null).length;

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
                : `/${companySlug}/dashboard`
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
        <GoogleTranslate/>

        {/* Notification Icon with Unread Count */}
        <Link href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/notifications`} className="notification-icon"
        >
          <FaRegBell size={22} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </Link>

        <Profile />
      </div>
      {isMobile && (
        <FaBars size={20} style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={openMenu} className="m-toggle" />
      )}
    </div>
  );
};

export default Header;