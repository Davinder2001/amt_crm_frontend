'use client';
import React, { useState } from 'react';
import HrHroSection from './(hrHome)/HrHroSection';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaUserCheck, FaMoneyBillWave } from 'react-icons/fa';
import InviteEmployeeForm from './components/InviteEmployeeForm';
import Modal from '@/components/common/Modal';
import { useCompany } from '@/utils/Company';

const Page: React.FC = () => {
  const router = useRouter();
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const { companySlug } = useCompany();

  return (
    <>
      <div className='hr_navigation'>

        <TableToolbar
          actions={[
            {
              label: 'Status View',
              icon: <FaUserCheck />,
              onClick: () => router.push(`/${companySlug}/hr/status-view`),
            },
            {
              label: 'Employee Salary',
              icon: <FaMoneyBillWave />,
              onClick: () => router.push(`/${companySlug}/hr/employee-salary`),
            },
            // {
            //   label: 'Invite Employee',
            //   icon: <FaUserPlus />,
            //   onClick: () => setInviteModalOpen(true),
            // },
            {
              label: 'Add Employee',
              icon: <FaUserPlus />,
              onClick: () => router.push(`/${companySlug}/hr/add-employee`),
            },
          ]}
          introKey='hr_intro'
        />
      </div>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Employee"
        width="400px"
      >
        <InviteEmployeeForm onClose={() => setInviteModalOpen(false)} />
      </Modal>
      <HrHroSection />
    </>
  );
};

export default Page;