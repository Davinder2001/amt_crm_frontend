// 'use client';

// import React from 'react';
// import {
//   useGetAllQuotationsQuery,
//   useGenerateQuotationPdfMutation,
// } from '@/slices/quotation/quotationApi';
// import { FaDownload } from 'react-icons/fa';

// const AllQuotations = () => {
//   const { data, isLoading, error } = useGetAllQuotationsQuery();
//   const [generatePdf] = useGenerateQuotationPdfMutation();

//   const handleDownload = async (id: number) => {
//     try {
//       const blob = await generatePdf(id).unwrap();
//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `quotation-${id}.pdf`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       alert('Download failed!');
//     }
//   };

//   const quotations = (data ?? []).slice().reverse(); // 🆕 Reverse order: newest first

//   return (
//     <div className="quotation-wrapper">
//       {isLoading && <p>Loading...</p>}
//       {error && <p>Failed to load quotations.</p>}

//       {quotations.length > 0 ? (
//         <table className="quotation-table w-full border-collapse mt-4 text-sm">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="border px-4 py-2">Sr. No.</th>
//               <th className="border px-4 py-2">Customer Name</th>
//               <th className="border px-4 py-2">Customer Number</th>
//               <th className="border px-4 py-2">Items</th>
//               <th className="border px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {quotations.map((quotation, index) => (
//               <tr key={quotation.id}>
//                 <td className="border px-4 py-2">{index + 1}</td>
//                 <td className="border px-4 py-2">{quotation.customer_name}</td>
//                 <td className="border px-4 py-2">{quotation.customer_number}</td>
//                 <td className="border px-4 py-2">{quotation.items?.length ?? 0}</td>
//                 <td className="border px-4 py-2">
//                   <button
//                     className="quotations-download-btn flex items-center gap-1 text-blue-600 hover:underline"
//                     onClick={() => handleDownload(quotation.id || 0)}
//                   >
//                     <FaDownload />
//                     Download PDF
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         !isLoading && <p>No quotations found.</p>
//       )}
//     </div>
//   );
// };

// export default AllQuotations;


















// 'use client';

// import React, { useMemo } from 'react';
// import {
//   useGetAllQuotationsQuery,
//   useGenerateQuotationPdfMutation,
// } from '@/slices/quotation/quotationApi';
// import { FaDownload } from 'react-icons/fa';
// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import Loader from '@/components/common/Loader';
// import { useRouter } from 'next/navigation';
// import { useCompany } from '@/utils/Company';

// const AllQuotations = () => {
//   const { data, isLoading, error } = useGetAllQuotationsQuery();
//   const [generatePdf] = useGenerateQuotationPdfMutation();
//   const router = useRouter();
//   const { companySlug } = useCompany();

//   const handleDownload = async (id: number) => {
//     try {
//       const blob = await generatePdf(id).unwrap();
//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `quotation-${id}.pdf`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       alert('Download failed!');
//     }
//   };

//   const quotations = useMemo(() => {
//     return (data ?? []).slice().reverse(); // Newest first
//   }, [data]);

//   const columns = useMemo(() => [
//     {
//       label: 'Sr. No.',
//       render: (_: any, index: number) => index + 1,
//     },
//     {
//       label: 'Customer Name',
//       render: (item: any) => item.customer_name || '-',
//     },
//     {
//       label: 'Customer Number',
//       render: (item: any) => item.customer_number || '-',
//     },
//     {
//       label: 'Items',
//       render: (item: any) => item.items?.length ?? 0,
//     },
//     {
//       label: 'Actions',
//       render: (item: any) => (
//         <button
//           className="flex items-center gap-1 text-blue-600 hover:underline"
//           onClick={() => handleDownload(item.id)}
//         >
//           <FaDownload />
//           Download PDF
//         </button>
//       ),
//     },
//   ], [generatePdf]);

//   if (isLoading) return <Loader />;
//   if (error) return <p className="text-red-500">Failed to load quotations.</p>;

//   return (
//     <div className="all-quotations-page">
//       {quotations.length > 0 ? (
//         <ResponsiveTable
//           data={quotations}
//           columns={columns}
//           onView={(id) => router.push(`/${companySlug}/invoices/qutations/${id}`)}

//         />
//       ) : (
//         <p>No quotations found.</p>
//       )}
//     </div>
//   );
// };

// export default AllQuotations;

















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
          className="flex items-center gap-1 text-blue-600 hover:underline"
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
