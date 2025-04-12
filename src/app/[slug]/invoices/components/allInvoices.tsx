import React from "react";
import { useRouter } from "next/navigation";
import { useFetchInvoicesQuery, useLazyDownloadInvoicePdfQuery } from "@/slices/invoices/invoice";

const AllInvoices = () => {
  const { data, isLoading, isError } = useFetchInvoicesQuery();
  const [triggerDownload] = useLazyDownloadInvoicePdfQuery();
  const router = useRouter();

  const handleDownloadPdf = async (invoiceId: number) => {
    try {
      const result = await triggerDownload(invoiceId).unwrap();

      if (!(result instanceof Blob)) {
        throw new Error("Invalid response: Expected a Blob object.");
      }

      const blob = result;
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${invoiceId}.pdf`;
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to fetch the PDF.");
    }
  };

  const handleViewInvoice = (invoiceId: number) => {
    router.push(`invoices/view/${invoiceId}`);
  };

  if (isLoading) return <p>Loading invoices...</p>;
  if (isError) return <p>Failed to load invoices.</p>;

  return (
    <div className="all-invoice-table-container">
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Invoice No.</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Total (₹)</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.invoices.map((invoice, index) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{invoice.invoice_number}</td>
                <td className="p-2 border">{invoice.client_name}</td>
                <td className="p-2 border">{invoice.invoice_date}</td>
                <td className="p-2 border">₹{invoice.total_amount}</td>

                <td className="p-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="buttons"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(invoice.id)}
                      className="buttons"
                    >
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllInvoices;
