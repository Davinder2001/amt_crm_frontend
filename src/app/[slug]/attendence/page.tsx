'use client';
import React, { useState } from 'react'
import AttendancesList from './components/AttendancesList'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarPlus, FaClipboardList, FaUserCheck } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import Modal from '@/components/common/Modal';
import ApplyForLeave from './components/ApplyForLeave';
import TableToolbar from '@/components/common/TableToolbar';

const AttendancePage = () => {

  // Modal states
  const [isAttandanceOpen, setIsAttandanceOpen] = useState(false);
  const [isApplyForLeaveOpen, setIsApplyForLeaveOpen] = useState(false);
  const router = useRouter();
  const { companySlug } = useCompany();
  return (
    <>
      <Link href={`/${companySlug}/tasks`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <TableToolbar
        actions={[
          {
            label: 'Apply for Leave',
            icon: <FaCalendarPlus />,
            onClick: () => setIsApplyForLeaveOpen(true)
          },
          {
            label: 'Add Attendance',
            icon: <FaUserCheck />,
            onClick: () => setIsAttandanceOpen(true)
          },
          {
            label: 'Leaves',
            icon: <FaClipboardList />,
            onClick: () => router.push(`/${companySlug}/leaves`)
          },
        ]}
        introKey='attendence_into'
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

export default AttendancePage;