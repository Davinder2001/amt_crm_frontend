'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import TableToolbar from '@/components/common/TableToolbar';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';

const QutationNav: React.FC = () => {
  const { companySlug } = useCompany();
  const router = useRouter();

  return (
    <div className="quotation-toolbar-wrapper">
      <Link href={`/${companySlug}/invoices`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>
      <TableToolbar
        actions={[
          {
            label: 'Generate Quotation',
            icon: <FaPlus />,
            onClick: () => router.push(`/${companySlug}/qutations/add`),
          },
        ]}
      />
    </div>
  );
};

export default QutationNav;
