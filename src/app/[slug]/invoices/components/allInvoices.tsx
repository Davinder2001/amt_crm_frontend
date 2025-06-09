'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFileInvoice, FaPlus, FaWhatsapp, FaUsers, FaCreditCard, FaMoneyBill } from "react-icons/fa";
import {
  useLazyDownloadInvoicePdfQuery,
  useSendInvoiceToWhatsappMutation,
} from "@/slices/invoices/invoice";
import ResponsiveTable from "@/components/common/ResponsiveTable";
import { useCompany } from "@/utils/Company";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import TableToolbar from "@/components/common/TableToolbar";
import { toast } from 'react-toastify';

interface allInvoicesProps {
  invoices: Invoice[];
  isLoadingInvoices: boolean;
  isError: boolean;
}

const COLUMN_STORAGE_KEY = 'visible_columns_invoice';

const AllInvoices: React.FC<allInvoicesProps> = ({ invoices, isLoadingInvoices, isError }) => {
  const [triggerDownload] = useLazyDownloadInvoicePdfQuery();
  const [sendToWhatsapp, { isLoading: sending }] = useSendInvoiceToWhatsappMutation();
  const router = useRouter();
  const { companySlug } = useCompany();
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : ['invoice_number', 'client_name', 'invoice_date', 'final_amount'];
  });

  const allColumns = [
    { label: "Invoice No.", key: "invoice_number" as string },
    { label: "Client", key: "client_name" as string },
    { label: "Date", key: "invoice_date" as string },
    { label: "Total (₹)", key: "final_amount" as string },
  ];

  const tableFilters = [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const
    },
    {
      key: 'invoice_date',
      label: 'Date',
      type: 'multi-select' as const,
      options: [...new Set(invoices.map(invoice => invoice.invoice_date))].filter(Boolean) as string[]
    },
    {
      key: 'client_name',
      label: 'Client',
      type: 'multi-select' as const,
      options: [...new Set(invoices.map(invoice => invoice.client_name))].filter(Boolean) as string[]
    }
  ];

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key];
      localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const onResetColumns = () => {
    const defaultColumns = ['invoice_number', 'client_name', 'invoice_date', 'final_amount'];
    setVisibleColumns(defaultColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(defaultColumns));
  };

  const filterData = (data: Invoice[]): Invoice[] => {
    return data.filter((invoice) => {
      if (filters.search && filters.search.length > 0) {
        const searchTerm = filters.search[0].toLowerCase();
        const visibleFields = allColumns
          .filter(col => visibleColumns.includes(col.key))
          .map(col => col.key);

        const matchesSearch = visibleFields.some(key => {
          const value = String(invoice[key as keyof Invoice] ?? '').toLowerCase();
          return value.includes(searchTerm);
        });

        if (!matchesSearch) return false;
      }

      return Object.entries(filters)
        .filter(([field]) => field !== 'search')
        .every(([field, values]) => {
          if (!values || values.length === 0) return true;

          const invoiceValue = String(invoice[field as keyof Invoice] ?? '').toLowerCase();
          const normalizedValues = values.map(v => v.toLowerCase());

          return normalizedValues.includes(invoiceValue);
        });
    });
  };

  const filteredInvoices = filterData(invoices);

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
        window.open(res.whatsapp_url, "_blank");
        toast.info("Opened WhatsApp Web for manual sharing.");
      }
    } catch (err) {
      console.error("WhatsApp share error:", err);
      toast.error("Failed to share invoice.");
    }
  };

  const columns = [
    ...allColumns
      .filter(col => visibleColumns.includes(col.key))
      .map(col => {
        if (col.key === 'final_amount') {
          return {
            label: col.label,
            render: (invoice: Invoice) => `₹${invoice.final_amount}`,
          };
        }
        return {
          label: col.label,
          key: col.key as keyof Invoice,
        };
      }),
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

  return (
    <>
      <TableToolbar
        filters={tableFilters}
        onFilterChange={(field, value, type) => {
          if (type === 'search') {
            setFilters(prev => ({
              ...prev,
              [field]: value && typeof value === 'string' ? [value] : []
            }));
          } else {
            setFilters(prev => ({
              ...prev,
              [field]: Array.isArray(value) ? value : [value]
            }));
          }
        }}
        columns={allColumns}
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        onResetColumns={onResetColumns}
        actions={[

          ...(invoices.length > 0
            ? [{
              label: 'Add Invoice',
              icon: <FaPlus />,
              onClick: () => router.push(`/${companySlug}/invoices/new-invoice`),
            }]
            : []),
        ]}
        extraLinks={[
          {
            label: 'All Customers',
            icon: <FaUsers />,
            onClick: () => router.push(`/${companySlug}/invoices/customers`),
          },
          {
            label: 'Credits',
            icon: <FaCreditCard />,
            onClick: () => router.push(`/${companySlug}/invoices/credits`),
          },
          {
            label: 'Quotations',
            icon: <FaFileInvoice />,
            onClick: () => router.push(`/${companySlug}/invoices/qutations`),
          },
          {
            label: 'Cash Flow',
            icon: <FaMoneyBill />,
            onClick: () => router.push(`/${companySlug}/invoices/cash-flow`),
          },

        ]}
      />

      {invoices.length > 0 ?
        <ResponsiveTable
          data={filteredInvoices}
          columns={columns}
          storageKey="invoice_table_page"
          cardViewKey="invoice_number"
          onEdit={(id) => router.push(`/${companySlug}/invoices/edit-invoice/${id}`)}
          onView={(id) => router.push(`/${companySlug}/invoices/${id}`)}
        />
        :
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
      }
    </>
  );
};

export default AllInvoices;