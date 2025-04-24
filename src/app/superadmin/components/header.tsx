'use client';
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import ProfileIcon from './profileIcon';

const SuperAdminHeader: React.FC = () => {
  const { title } = useBreadcrumb();

  return (
    <div className="header sticky">
      <FaBars size={20} style={{ cursor: 'pointer' }} />
      <h1 className="header-title">{title}</h1>
      <div className="nav-container">
        <ProfileIcon />
      </div>

      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          margin-left: 1rem;
          flex-grow: 1;
        }

        .nav-container {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        @media (max-width: 768px) {
          .header {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminHeader;
