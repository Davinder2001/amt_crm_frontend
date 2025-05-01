// 'use client';
// import React from 'react';
// import { FaBars } from 'react-icons/fa';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import ProfileIcon from './profileIcon';

// const SuperAdminHeader: React.FC = () => {
//   const { title } = useBreadcrumb();

//   return (
//     <div className="header sticky">
//       <FaBars size={20} style={{ cursor: 'pointer' }} />
//       <h1 className="header-title">{title}</h1>
//       <div className="nav-container">
//         <ProfileIcon />
//       </div>

//       <style jsx>{`
//         .header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0.75rem 1.5rem;
//           background-color: #ffffff;
//           border-bottom: 1px solid #e5e7eb;
//           position: sticky;
//           top: 0;
//           z-index: 10;
//         }

//         .header-title {
//           font-size: 1.25rem;
//           font-weight: 600;
//           color: #333;
//           margin-left: 1rem;
//           flex-grow: 1;
//         }

//         .nav-container {
//           display: flex;
//           align-items: center;
//           gap: 1.25rem;
//         }

//         @media (max-width: 768px) {
//           .header {
//             flex-wrap: wrap;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SuperAdminHeader;






















'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaRegBell, FaBars } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Image from 'next/image';
import { logo } from '@/assets/useImage';
import { useRouter } from 'next/navigation';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';
import SearchBar from '@/app/[slug]/_common/search/SearchBar';
import Profile from '@/app/[slug]/_common/header/components/profile';

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
      {!isMobile && <FaBars size={20} style={{ cursor: 'pointer' }} onClick={handleToggleSidebar} />}
      <h1 className="header-title">{title}</h1>
      <div className="nav-container relative flex items-center gap-4">
        <SearchBar />

        {/* Notification Icon with Unread Count */}
        <Link href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/notifications`} className="relative">
          <FaRegBell size={22} color="#009693" />
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
