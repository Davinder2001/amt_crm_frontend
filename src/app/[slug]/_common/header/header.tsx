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
import { useFetchSelectedCompanyQuery } from '@/slices';


interface headerProps {
  openMenu: () => void;
  isMobile: boolean;
}

const Header: React.FC<headerProps> = ({ openMenu, isMobile }) => {
  const { companySlug, userType } = useCompany();
  const pathname = usePathname();
  const router = useRouter();
  const { data: selectedCompany, isLoading } = useFetchSelectedCompanyQuery();
  const company = selectedCompany?.selected_company;

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

  const renderLogo = (size: number) => {
    const logoUrl = company?.company_logo ?? null;

    if (isLoading) {
      return (
        <div style={{
          width: size,
          height: size,
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
          onClick={() =>
            router.push(
              userType === 'employee'
                ? `/${companySlug}/employee/dashboard`
                : `/${companySlug}/dashboard`
            )
          }
        >
          {/* Shimmer effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            animation: 'shimmer 1.5s infinite',
            transform: 'translateX(-100%)'
          }} />
          <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
        </div>
      );
    }

    return (
      <Image
        src={logoUrl || logo.src}
        alt={logoUrl ? "company logo" : "default logo"}
        width={size}
        height={size}
        onClick={() =>
          router.push(
            userType === 'employee'
              ? `/${companySlug}/employee/dashboard`
              : `/${companySlug}/dashboard`
          )
        }
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <div className={`header ${isSticky ? 'sticky' : ''}`}>
      {isMobile && (
        <>
          {renderLogo(30)}
        </>
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