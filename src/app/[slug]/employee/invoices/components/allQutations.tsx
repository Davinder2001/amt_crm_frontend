'use client';

import React, { useMemo } from 'react';
import { useGetAllQuotationsQuery, useGenerateQuotationPdfMutation, Quotation } from '@/slices';
import { FaDownload, FaFileInvoice, FaPlus } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import EmptyState from '@/components/common/EmptyState';
import TableToolbar from '@/components/common/TableToolbar';
import { FaTriangleExclamation } from 'react-icons/fa6';

const AllQuotations = () => {
  const { data, isLoading, error } = useGetAllQuotationsQuery();
  const [generatePdf] = useGenerateQuotationPdfMutation();
  const router = useRouter();
  const { companySlug } = useCompany();

  const handleDownload = React.useCallback(
    async (id: number) => {
      try {
        const blob = await generatePdf(id).unwrap();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotation-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch {
        alert('Download failed!');
      }
    },
    [generatePdf]
  );

  const quotations: Quotation[] = useMemo(() => {
    return (data ?? []).slice().reverse(); // Newest first
  }, [data]);

  const columns = useMemo(() => [
    {
      label: 'Customer Name',
      render: (item: Quotation) => item.customer_name || '-',
    },
    {
      label: 'Customer Number',
      render: (item: Quotation) => item.customer_number || '-',
    },
    {
      label: 'Items',
      render: (item: Quotation) => item.items?.length ?? 0,
    },
    {
      label: 'Actions',
      render: (item: Quotation) => (
        <button
          className="buttons flex items-center gap-1 text-blue-600 hover:underline"
          onClick={() => handleDownload(item.id!)}
        >
          <FaDownload />
          Download PDF
        </button>
      ),
    },
  ], [handleDownload]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to load quotations"
        message="Something went wrong while fetching quotations."
      />
    );
  }

  if (quotations.length === 0) {
    return (
      <EmptyState
        icon={<FaFileInvoice className="empty-state-icon" />}
        title="No Quotations Found"
        message="You haven't added any quotations yet."
        action={
          <button
            className="buttons"
            onClick={() => router.push(`/${companySlug}/employee/invoices/qutations/create`)}
          >
            <FaDownload className="mr-2" />
            Create Quotation
          </button>
        }
      />
    );
  }

  return (
    <div className="all-quotations-page">
      <TableToolbar
        actions={[
          ...(quotations.length > 0
            ? [{ label: 'Generate Quotation', icon: <FaPlus />, onClick: () => router.push(`/${companySlug}/employee/invoices/qutations/add`) }]
            : []),
        ]}
        introKey='quotation_intro'
      />
      <ResponsiveTable
        data={quotations}
        columns={columns}
        onView={(id) => router.push(`/${companySlug}/employee/invoices/qutations/${id}`)}
      />
    </div>
  );
};

export default AllQuotations;
