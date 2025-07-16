'use client';
import React, { useState } from 'react'
import AttendancesList from './components/AttendancesList'
import { useRouter } from 'next/navigation';
import { FaCalendarPlus, FaClipboardList, FaPlus } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import Modal from '@/components/common/Modal';
import ApplyForLeave from './components/ApplyForLeave';
import TableToolbar from '@/components/common/TableToolbar';

function Page() {

  // Modal states
  const [isAttandanceOpen, setIsAttandanceOpen] = useState(false);
  const [isApplyForLeaveOpen, setIsApplyForLeaveOpen] = useState(false);
  const router = useRouter();
  const { companySlug } = useCompany();
  return (
    <>
      <TableToolbar
        actions={[
          {
            label: 'Apply for Leave',
            icon: <FaCalendarPlus />,
            onClick: () => setIsApplyForLeaveOpen(true)
          },
          {
            label: 'Leaves',
            icon: <FaClipboardList />,
            onClick: () => router.push(`/${companySlug}/employee/leaves`)
          },
          {
            label: 'Add Attendance',
            icon: <FaPlus />,
            onClick: () => setIsAttandanceOpen(true)
          },
        ]}
        introKey='attendance_into'
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