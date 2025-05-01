'use client';
import React, { useEffect, useState } from 'react'
// import AddInvoiceFrom from '../components/addInvoiceFrom'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft, FaExpand, FaCompress } from 'react-icons/fa';
import POSPage from '../pos/POSPage';

const Page = () => {
  const { setTitle } = useBreadcrumb();
  const [isFullView, setIsFullView] = useState(false);
  useEffect(() => {
    setTitle('Add Invoices');
  }, [setTitle]);
  const { companySlug } = useCompany();

  return (
    <>
      <Link href={`/${companySlug}/invoices`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      {/* <AddInvoiceFrom /> */}
      <div className={`creat-inv-page ${isFullView ? 'fullView' : 'autoView'}`}>
        <div className="fullView-content">
          <span style={{ display: 'flex', justifyContent: 'flex-end', padding: '0px 10px 10px 0px' }}>
            {isFullView ? (
              <FaCompress size={20} onClick={() => setIsFullView(false)} />
            ) : (
              <FaExpand size={20} onClick={() => setIsFullView(true)} />
            )}
          </span>
          <POSPage />
        </div>
      </div>
      <style jsx>{`
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
  z-index: 10000000000;
}
  .autoView .fullView-content{
  
  border-radius: 8px;
  }
  
.fullView-content {
padding: 10px 0px 0px 0px;
  background: #fff;
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  position: relative;
}

      `}</style>
    </>
  )
}

export default Page