// 'use client';
// import React, { useEffect, useState } from 'react';
// import Profile from './components/profile';
// import SearchBar from '../search/SearchBar';
// import Link from 'next/link';
// import { FaRegBell, FaBars } from 'react-icons/fa';
// import { useCompany } from '@/utils/Company';
// // import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import Image from 'next/image';
// import { logo } from '@/assets/useImage';
// import { useRouter } from 'next/navigation';
// import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';
// // import GoogleTranslate from "@/components/common/GoogleTranslate";


// interface headerProps {
//   handleToggleSidebar: () => void;
//   openMenu: () => void;
//   isMobile: boolean;
// }

// const Header: React.FC<headerProps> = ({ handleToggleSidebar, openMenu, isMobile }) => {
//   const { companySlug, userType } = useCompany();
//   // const { title } = useBreadcrumb();
//   const router = useRouter();

//   // State to manage sticky class
//   const [isSticky, setIsSticky] = useState(false);

//   // ✅ Fetch notifications
//   const { data } = useFetchNotificationsQuery();

//   // ✅ Calculate unread count
//   // If data has a 'notifications' array property, use it; otherwise, adjust as needed
//   const notifications = Array.isArray(data) ? data : data?.notifications || [];
//   const unreadCount = notifications.filter((notification: Notification) => notification.read_at === null).length;

//   useEffect(() => {
//     const mainContent = document.querySelector('.main-content');

//     const handleScroll = () => {
//       if (mainContent) {
//         const scrollPosition = mainContent.scrollTop;
//         const threshold = window.innerHeight * 0.01;
//         setIsSticky(scrollPosition > threshold);
//       }
//     };

//     if (mainContent) {
//       mainContent.addEventListener('scroll', handleScroll);
//     }

//     return () => {
//       if (mainContent) {
//         mainContent.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, []);

//   return (
//     <div className={`header ${isSticky ? 'sticky' : ''}`}>
//       {isMobile && (
//         <Image
//           src={logo.src}
//           alt="logo"
//           width={30}
//           height={30}
//           onClick={() =>
//             router.push(
//               userType === 'employee'
//                 ? `/${companySlug}/employee/dashboard`
//                 : `/${companySlug}/dashboard`
//             )
//           }
//         />
//       )}
//       {!isMobile && <FaBars size={20} style={{ cursor: 'pointer' }} onClick={handleToggleSidebar} />}
//       {/* <h1 className="header-title">{title}</h1> */}
//       <div className="nav-container relative flex items-center gap-4">
//         <SearchBar />

//         {/* Notification Icon with Unread Count */}
//         <Link href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/notifications`} className="notification-icon"
//         >
//           <FaRegBell size={22} />
//           {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
//         </Link>
//         {/* <GoogleTranslate /> */}

//         <Profile />
//       </div>
//       {isMobile && (
//         <FaBars size={20} style={{ cursor: 'pointer' }} onClick={openMenu} className="m-toggle" />
//       )}
//     </div>
//   );
// };

// export default Header;










'use client';
import React, { useEffect, useRef, useState } from 'react';
import Profile from './components/profile';
import Link from 'next/link';
import { FaRegBell, FaBars, FaPlus, FaQuestionCircle, FaTasks } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import Image from 'next/image';
import { logo } from '@/assets/useImage';
import { useRouter } from 'next/navigation';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';
import SearchBar from '../search/SearchBar';
import Modal from '@/components/common/Modal';
import TaskForm from '../../tasks/components/TaskForm';

interface headerProps {
  handleToggleSidebar: () => void;
  openMenu: () => void;
  isMobile: boolean;
}

const Header: React.FC<headerProps> = ({ handleToggleSidebar, openMenu, isMobile }) => {
  const { companySlug, userType } = useCompany();
  const router = useRouter();
  const quickAddRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isOpenNewTask, setIsOpenNewTask] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const { data, refetch: refetchNotifications } = useFetchNotificationsQuery();
  const notifications = Array.isArray(data) ? data : data?.notifications || [];
  const unreadCount = notifications.filter((notification: Notification) => notification.read_at === null).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setShowQuickAdd(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const quickAddItems = [
    { label: 'New Task', action: () => setIsOpenNewTask(true), icon: <FaTasks size={14} /> },
  ];

  return (
    <>
      <div className={`header ${isSticky ? 'sticky' : ''}`}>
        <div className="header-left">
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
          {!isMobile && (
            <button className="sidebar-toggle" onClick={handleToggleSidebar}>
              <FaBars size={20} />
            </button>
          )}
        </div>

        <div className="header-center">
          <SearchBar />
        </div>

        <div className="header-right">
          <div className="header-actions">
            {!isMobile && (
              <>
                <div className="quick-add-container" ref={quickAddRef}>
                  <button
                    className="quick-add-button"
                    onMouseEnter={() => setShowQuickAdd(true)}
                    onMouseLeave={() => setShowQuickAdd(false)}
                  >
                    <FaPlus />
                    <span>Quick Add</span>
                  </button>
                  {showQuickAdd && (
                    <div
                      className="quick-add-menu"
                      onMouseEnter={() => setShowQuickAdd(true)}
                      onMouseLeave={() => setShowQuickAdd(false)}
                    >
                      {quickAddItems.map((item, index) => (
                        <button
                          key={index}
                          className="quick-add-item"
                          onClick={item.action}
                        >
                          <span className="quick-add-icon">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="help-button" onClick={() => router.push('/help')}>
                  <FaQuestionCircle />
                </button>
              </>
            )}

            <Link
              href={`/${companySlug}${userType === 'employee' ? '/employee' : ''}/notifications`}
              className="notification-icon"
            >
              <FaRegBell size={22} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </Link>

            <Profile />
          </div>

          {isMobile && (
            <button className="mobile-menu-toggle" onClick={openMenu}>
              <FaBars size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isOpenNewTask}
        onClose={() => setIsOpenNewTask(false)}
        title="Add New Task"
        width="800px"
      >
        <TaskForm
          mode="add"
          onSuccess={() => {
            setIsOpenNewTask(false);
            refetchNotifications();
          }}
        />
      </Modal>
    </>
  );
};

export default Header;