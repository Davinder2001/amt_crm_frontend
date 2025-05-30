'use client';

import React, { useMemo } from 'react';
import {
  useGetAllQuotationsQuery,
  useGenerateQuotationPdfMutation,
} from '@/slices/quotation/quotationApi';
import { FaDownload } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import { Quotation } from '@/slices/quotation/quotationApi'; // Import type

const AllQuotations = () => {
  const { data, isLoading, error } = useGetAllQuotationsQuery();
  const [generatePdf] = useGenerateQuotationPdfMutation();
  const router = useRouter();
  const { companySlug } = useCompany();

  const handleDownload = async (id: number) => {
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
  };

  const quotations: Quotation[] = useMemo(() => {
    return (data ?? []).slice().reverse(); // Newest first
  }, [data]);

  const columns = useMemo(() => [
    {
      label: 'Sr. No.',
      render: (_: Quotation, index: number) => index + 1,
    },
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
          className=" buttons flex items-center gap-1 text-blue-600 hover:underline"
          onClick={() => handleDownload(item.id!)}
        >
          <FaDownload />
          Download PDF
        </button>
      ),
    },
  ], [generatePdf]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Failed to load quotations.</p>;

  return (
    <div className="all-quotations-page">
      {quotations.length > 0 ? (
        <ResponsiveTable
          data={quotations}
          columns={columns}
          onView={(id) => router.push(`/${companySlug}/invoices/qutations/${id}`)}
        />
      ) : (
        <p>No quotations found.</p>
      )}
    </div>
  );
};

export default AllQuotations;
