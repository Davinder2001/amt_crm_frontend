'use client';

import React from 'react';
import {
  useGetAllQuotationsQuery,
  useGenerateQuotationPdfMutation,
} from '@/slices/quotation/quotationApi';

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

  return (
    <div className="quotation-wrapper">
      <h2>All Quotations</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p>Failed to load quotations.</p>}

      {(data ?? []).length > 0 ? (
        <table className="quotation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((quotation) => (
              <tr key={quotation.id}>
                <td>{quotation.id}</td>
                <td>{quotation.customer_name}</td>
                <td>{quotation.items?.length ?? 0}</td>
                <td>
                  <button onClick={() => handleDownload(quotation.id || 0)}>
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
