'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFileInvoice, FaPlus, FaUsers, FaMoneyBill } from "react-icons/fa";
import { useLazyDownloadInvoicePdfQuery } from "@/slices";
import ResponsiveTable from "@/components/common/ResponsiveTable";
import { useCompany } from "@/utils/Company";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import TableToolbar from "@/components/common/TableToolbar";
import { toast } from 'react-toastify';
import { FaTriangleExclamation } from "react-icons/fa6";

interface allInvoicesProps {
  invoices: Invoice[];
  isLoadingInvoices: boolean;
  isError: boolean;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  counts: number;
}

const COLUMN_STORAGE_KEY = 'visible_columns_invoice';

const AllInvoices: React.FC<allInvoicesProps> = ({ invoices, isLoadingInvoices, isError, pagination, onPageChange, onPerPageChange, counts }) => {
  const [triggerDownload] = useLazyDownloadInvoicePdfQuery();
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
  const handleShareInvoice = async (invoice: Invoice) => {
    try {
      const result = await triggerDownload(invoice.id).unwrap();

      const file = new File([result], `invoice_${invoice.invoice_number}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Invoice #${invoice.invoice_number}`,
          text: `Invoice for ${invoice.client_name}\nTotal: ₹${invoice.final_amount}`,
          files: [file],
        });
      } else {
        console.warn("Share not supported, falling back to download.");
        handleDownloadPdf(invoice.id);
      }
    } catch (err: unknown | DOMException) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        console.error("Share failed:", err);
        handleDownloadPdf(invoice.id);
      }
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
          <button className="buttons" onClick={() => handleShareInvoice(invoice)}>
            Share
          </button>
        </div>
      ),
    },
  ];


  if (isLoadingInvoices) return <LoadingState />;
  if (isError) return <EmptyState
    icon={<FaTriangleExclamation className="empty-state-icon" />}
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
        introKey="invoice_intro"
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
          // {
          //   label: 'Credits',
          //   icon: <FaCreditCard />,
          //   onClick: () => router.push(`/${companySlug}/invoices/credits`),
          // },
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
          pagination={pagination}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          counts={counts}
          // onEdit={(id) => router.push(`/${companySlug}/invoices/edit-invoice/${id}`)}
          onView={(id) => router.push(`/${companySlug}/invoices/${id}`)}
          cardView={(invoice) => (
            <>
              <div className="card-row">
                <h5>{invoice.invoice_number}</h5>
                <p>{invoice.client_name}</p>
              </div>
              <div className="card-row">
                <p>Date: {invoice.invoice_date}</p>
                <p>Total: ₹{invoice.final_amount}</p>
              </div>
            </>
          )}
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