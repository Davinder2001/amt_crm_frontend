import React from "react";
import {
  useFetchInvoicesQuery,
  useLazyDownloadInvoicePdfQuery,
} from "@/slices/invoices/invoice";

const AllInvoices = () => {
  const { data, isLoading, isError } = useFetchInvoicesQuery();
  const [downloadInvoicePdf] = useLazyDownloadInvoicePdfQuery();

  const handleDownloadPdf = async (invoiceId: number) => {
    try {
      const response = await downloadInvoicePdf(invoiceId).unwrap();
      const url = URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${invoiceId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF", error);
      alert("Failed to download invoice PDF.");
    }
  };

  const handleViewPdf = async (invoiceId: number) => {
    try {
      const response = await downloadInvoicePdf(invoiceId).unwrap();
      const url = URL.createObjectURL(response);
      window.open(url);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to view PDF", error);
      alert("Failed to view invoice PDF.");
    }
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
              <th className="p-2 border">Items</th>
              <th className="p-2 border">PDF</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((invoice, index) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{invoice.invoice_number}</td>
                <td className="p-2 border">{invoice.client_name}</td>
                <td className="p-2 border">{invoice.invoice_date}</td>
                <td className="p-2 border">₹{invoice.total_amount}</td>
                <td className="p-2 border">
                  {invoice.items.map((item) => item.item_id).join(", ")}
                </td>
                <td className="p-2 border">
                  <div className="invoice-v-d-button-container space-x-2">
                    <button
                      onClick={() => handleViewPdf(invoice.id)}
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
