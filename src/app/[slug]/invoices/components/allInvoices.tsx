'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import {
  useFetchInvoicesQuery,
  useLazyDownloadInvoicePdfQuery,
  useSendInvoiceToWhatsappMutation
} from "@/slices/invoices/invoice";
import ResponsiveTable from "@/components/common/ResponsiveTable";
import { toast } from "react-toastify";
import { useCompany } from "@/utils/Company";
import Loader from "@/components/common/Loader";

const AllInvoices = () => {
  const { data, isLoading, isError } = useFetchInvoicesQuery();
  const [triggerDownload] = useLazyDownloadInvoicePdfQuery();
  const [sendToWhatsapp, { isLoading: sending }] = useSendInvoiceToWhatsappMutation();
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

  const handleSendWhatsapp = async (invoiceId: number) => {
    try {
      const res = await sendToWhatsapp(invoiceId).unwrap() as unknown as { pdf_base64: string; filename: string; whatsapp_url: string };

      const byteCharacters = atob(res.pdf_base64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const file = new File([blob], res.filename, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Invoice",
          text: "Please find your invoice attached.",
          files: [file],
        });
        toast.success("Shared via WhatsApp or other app.");
      } else {
        // Fallback to opening WhatsApp Web with prefilled message
        window.open(res.whatsapp_url, "_blank");
        toast.info("Opened WhatsApp Web for manual sharing.");
      }
    } catch (err) {
      console.error("WhatsApp share error:", err);
      toast.error("Failed to share invoice.");
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
          <button className="buttons" onClick={() => handleDownloadPdf(invoice.id)}>
            Download
          </button>
          <button
            className="buttons"
            onClick={() => handleSendWhatsapp(invoice.id)}
            title="Send to WhatsApp"
            disabled={sending}
          >
            <FaWhatsapp size={18} style={{ marginRight: 4 }} /> WhatsApp
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <p>Failed to load invoices.</p>;
  if (invoices.length === 0) return <p>No invoices found.</p>;

  return (
    <ResponsiveTable
      data={invoices}
      columns={columns}
      onDelete={(id) => console.log(id, 'deleted successfully')}
      onEdit={(id) => router.push(`/${companySlug}/invoices/edit-invoice/${id}`)}
      onView={(id) => router.push(`/${companySlug}/invoices/view/${id}`)}
    />
  );
};

export default AllInvoices;
