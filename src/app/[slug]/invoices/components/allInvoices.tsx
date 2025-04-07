import React from "react";
import { useFetchInvoicesQuery } from "@/slices/invoices/invoice";

const AllInvoices = () => {
  const { data, isLoading, isError } = useFetchInvoicesQuery();

  const handleViewPdf = (base64: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const handleDownloadPdf = (base64: string, fileName: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "invoice.pdf";
    link.click();
  };

  if (isLoading) return <p>Loading invoices...</p>;
  if (isError) return <p>Failed to load invoices.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
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
            {data?.invoices?.map((invoice, index) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{invoice.invoice_number}</td>
                <td className="p-2 border">{invoice.client_name}</td>
                <td className="p-2 border">{invoice.invoice_date}</td>
                <td className="p-2 border">₹{invoice.total_amount}</td>
                <td className="p-2 border">
                  {invoice.items.map((item) => item.description).join(", ")}
                </td>
                <td className="p-2 border">
                  {invoice.pdf_base64 ? (
                    <div className="flex flex-col gap-1 text-blue-600 underline">
                      <button
                        onClick={() => handleViewPdf(invoice.pdf_base64)}
                        className="hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleDownloadPdf(
                            invoice.pdf_base64,
                            `invoice_${invoice.id}.pdf`
                          )
                        }
                        className="hover:text-blue-800"
                      >
                        Download
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not Generated</span>
                  )}
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
