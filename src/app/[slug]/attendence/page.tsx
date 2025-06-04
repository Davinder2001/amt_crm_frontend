'use client';
import React, { useEffect, useState } from 'react'
import AttendancesList from './components/AttendancesList'
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import Navigation from './components/Navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import Modal from '@/components/common/Modal';
import ApplyForLeave from './components/ApplyForLeave';

function Page() {
  const { setTitle } = useBreadcrumb();

  // Modal states
  const [isAttandanceOpen, setIsAttandanceOpen] = useState(false);
  const [isApplyForLeaveOpen, setIsApplyForLeaveOpen] = useState(false);

  useEffect(() => {
    setTitle('Attendances');
  }, [setTitle]);
  const { companySlug } = useCompany();
  return (
    <>
      <Link href={`/${companySlug}/tasks`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <Navigation
        setIsAttandanceOpen={setIsAttandanceOpen}
        setIsApplyForLeaveOpen={setIsApplyForLeaveOpen}
      />
      <AttendancesList
        isAttandanceOpen={isAttandanceOpen}
        setIsAttandanceOpen={setIsAttandanceOpen}
      />

      <Modal
        isOpen={isApplyForLeaveOpen}
        onClose={() => setIsApplyForLeaveOpen(false)}
        title="Apply for Leave"
        width="999px"
      >
        <ApplyForLeave
          onSuccess={() => {
            setIsApplyForLeaveOpen(false);
          }}
        />
      </Modal>

    </>
  )
}

export default Page