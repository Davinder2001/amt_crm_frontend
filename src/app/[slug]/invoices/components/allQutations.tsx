'use client';

import React from 'react';
import {
  useGetAllQuotationsQuery,
  useGenerateQuotationPdfMutation,
} from '@/slices/quotation/quotationApi';
import { FaDownload } from 'react-icons/fa';

const AllQuotations = () => {
  const { data, isLoading, error } = useGetAllQuotationsQuery();
  const [generatePdf] = useGenerateQuotationPdfMutation();

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

  const quotations = (data ?? []).slice().reverse(); // 🆕 Reverse order: newest first

  return (
    <div className="quotation-wrapper">
      {isLoading && <p>Loading...</p>}
      {error && <p>Failed to load quotations.</p>}

      {quotations.length > 0 ? (
        <table className="quotation-table w-full border-collapse mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Sr. No.</th>
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Customer Number</th>
              <th className="border px-4 py-2">Items</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation, index) => (
              <tr key={quotation.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{quotation.customer_name}</td>
                <td className="border px-4 py-2">{quotation.customer_number}</td>
                <td className="border px-4 py-2">{quotation.items?.length ?? 0}</td>
                <td className="border px-4 py-2">
                  <button
                    className="quotations-download-btn flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={() => handleDownload(quotation.id || 0)}
                  >
                    <FaDownload />
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !isLoading && <p>No quotations found.</p>
      )}
    </div>
  );
};

export default AllQuotations;
