// import React from "react";
// import { useRouter } from "next/navigation";
// import { useFetchInvoicesQuery, useLazyDownloadInvoicePdfQuery } from "@/slices/invoices/invoice";

// const AllInvoices = () => {
//   const { data, isLoading, isError } = useFetchInvoicesQuery();
//   const [triggerDownload] = useLazyDownloadInvoicePdfQuery();
//   const router = useRouter();

//   const handleDownloadPdf = async (invoiceId: number) => {
//     try {
//       const result = await triggerDownload(invoiceId).unwrap();
//       const url = URL.createObjectURL(result);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `invoice_${invoiceId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       setTimeout(() => URL.revokeObjectURL(url), 60000);
//     } catch (err) {
//       console.error("Download error:", err);
//       alert("Failed to fetch the PDF.");
//     }
//   };

//   const handleViewInvoice = (invoiceId: number) => {
//     router.push(`invoices/view/${invoiceId}`);
//   };

//   if (isLoading) return <p>Loading invoices…</p>;
//   if (isError) return <p>Failed to load invoices.</p>;

//   return (
//     <div className="all-invoice-table-container">
//       <div className="overflow-x-auto">
//         <table className="w-full border text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">#</th>
//               <th className="p-2 border">Invoice No.</th>
//               <th className="p-2 border">Client</th>
//               <th className="p-2 border">Date</th>
//               <th className="p-2 border">Total (₹)</th>
//               <th className="p-2 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data?.invoices?.map((invoice, idx) => (
//               <tr key={invoice.id} className="hover:bg-gray-50">
//                 <td className="p-2 border">{idx + 1}</td>
//                 <td className="p-2 border">{invoice.invoice_number}</td>
//                 <td className="p-2 border">{invoice.client_name}</td>
//                 <td className="p-2 border">{invoice.invoice_date}</td>
//                 <td className="p-2 border">₹{invoice.total_amount}</td>
//                 <td className="p-2 border">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleViewInvoice(invoice.id)}
//                       className="buttons"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => handleDownloadPdf(invoice.id)}
//                       className="buttons"
//                     >
//                       Download
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllInvoices;
















import React from "react";
import { useRouter } from "next/navigation";
import { useFetchInvoicesQuery, useLazyDownloadInvoicePdfQuery } from "@/slices/invoices/invoice";
import ResponsiveTable from "@/components/common/ResponsiveTable"; // Make sure this is reusable
import { toast } from "react-toastify";
import { useCompany } from "@/utils/Company";
import Loader from "@/components/common/Loader";

const AllInvoices = () => {
  const { data, isLoading, isError } = useFetchInvoicesQuery();
  const [triggerDownload] = useLazyDownloadInvoicePdfQuery();
  const router = useRouter();
  const { companySlug } = useCompany();

  const invoices = data?.invoices ?? [];

  const handleDownloadPdf = async (invoiceId: number) => {
    try {
      const result = await triggerDownload(invoiceId).unwrap();
      const url = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download invoice PDF.");
    }
  };

  const columns = [
    {
      label: "Sr. No",
      render: (_: Invoice, index: number) => index + 1,
    },
    { label: "Invoice No.", key: "invoice_number" as keyof Invoice },
    { label: "Client", key: "client_name" as keyof Invoice },
    { label: "Date", key: "invoice_date" as keyof Invoice },
    {
      label: "Total (₹)",
      render: (invoice: Invoice) => `₹${invoice.total_amount}`,
    },
    {
      label: "Actions",
      render: (invoice: Invoice) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="buttons"
            onClick={() => handleDownloadPdf(invoice.id)}
          >
            Download
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <p>Failed to load invoices.</p>;
  if (invoices.length === 0) return <p>No invoices found.</p>;

  return <ResponsiveTable data={invoices} columns={columns}
    onDelete={(id) => console.log(id, 'deleted successfully')}
    onEdit={(id) => router.push(`/${companySlug}/invoices/edit-invoice/${id}`)}
    onView={(id) => router.push(`/${companySlug}/invoices/view/${id}`)}
  />;
};

export default AllInvoices;
