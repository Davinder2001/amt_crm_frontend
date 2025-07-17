'use client';
import React, { useEffect, useState } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';
import POSPage from '../pos/POSPage';

const Page = () => {

  // ✅ Initialize from localStorage immediately (server-safe)
  const [isFullView, setIsFullView] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedView = localStorage.getItem('isFullView');
      return storedView === 'true';
    }
    return false;
  });

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('isFullView', isFullView.toString());
  }, [isFullView]);

  return (
    <>

      <div className={`creat-inv-page ${isFullView ? 'fullView' : 'autoView'}`}>
        <div className="fullView-content">
          <div className='invoice-header-top'>
            <span style={{ display: 'flex' }}>
              {isFullView ? (
                <FaCompress size={20} onClick={() => setIsFullView(false)} />
              ) : (
                <FaExpand size={20} onClick={() => setIsFullView(true)} />
              )}
            </span>
          </div>
          <POSPage />
        </div>
      </div>
      <style>{`
        .fullView {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999999;
        }

        .autoView .fullView-content {
          border-radius: 5px;
        }

        .fullView-content {
          padding: 10px;
          background: #fff;
          width: 100%;
          height: 100%;
          position: relative;
          border: 1px solid #efefef;
        }
      `}</style>
    </>
  );
};

export default Page;