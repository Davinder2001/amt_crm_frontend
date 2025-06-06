'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { FaFileInvoice, FaPlus, FaWhatsapp } from "react-icons/fa";
import {
  useLazyDownloadInvoicePdfQuery,
  useSendInvoiceToWhatsappMutation
} from "@/slices/invoices/invoice";
import ResponsiveTable from "@/components/common/ResponsiveTable";
import { toast } from "react-toastify";
import { useCompany } from "@/utils/Company";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";

interface allInvoicesProps {
  invoices: Invoice[];
  isLoadingInvoices: boolean;
  isError: boolean;
}

const AllInvoices: React.FC<allInvoicesProps> = ({ invoices, isLoadingInvoices, isError }) => {
  const [triggerDownload] = useLazyDownloadInvoicePdfQuery();
  const [sendToWhatsapp, { isLoading: sending }] = useSendInvoiceToWhatsappMutation();
  const router = useRouter();
  const { companySlug } = useCompany();


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

    { label: "Invoice No.", key: "invoice_number" as keyof Invoice },
    { label: "Client", key: "client_name" as keyof Invoice },
    { label: "Date", key: "invoice_date" as keyof Invoice },
    {
      label: "Total (₹)",
      render: (invoice: Invoice) => `₹${invoice.final_amount}`,
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

  if (isLoadingInvoices) return <LoadingState />;
  if (isError) return <EmptyState
    icon="alert"
    title="Failed to load invoices"
    message="We encountered an error while loading your invoices. Please try again later."
  />;

  if (invoices.length === 0) return (
    <EmptyState
      icon={<FaFileInvoice className="empty-state-icon" />}
      title="No invoices found"
      message="You haven't created any invoices yet. Get started by creating your first invoice."
      action={
        <button
          className="buttons"
          onClick={() => router.push(`/${companySlug}/invoices/new-invoice`)}
        >
          <FaPlus size={18} /> Add New Invoice
        </button>
      }
    />
  );

  return (
    <ResponsiveTable
      data={invoices}
      columns={columns}
      storageKey="invoice_table_page"
      onDelete={(id) => console.log(id, 'deleted successfully')}
      onEdit={(id) => router.push(`/${companySlug}/invoices/edit-invoice/${id}`)}
      onView={(id) => router.push(`/${companySlug}/invoices/${id}`)}
    />
  );
};

export default AllInvoices;
