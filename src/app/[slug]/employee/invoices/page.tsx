'use client';;
import React, { useState } from 'react'
import AllInvoices from './components/allInvoices';
import { useFetchInvoicesQuery } from '@/slices';
import { INVOICES_COUNT } from '@/utils/Company';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';

function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(INVOICES_COUNT);
  const { data, isLoading, isError } = useFetchInvoicesQuery({
    page: currentPage,
    per_page: itemsPerPage,
  });
  const invoices = data?.invoices ?? [];
  const pagination = data?.pagination;

  // Add these handler functions
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <EmptyState
    icon={<FaTriangleExclamation className="empty-state-icon" />}
    title="Failed to load invoices"
    message="We encountered an error while loading your invoices. Please try again later."
  />;

  return (
    <>
      <AllInvoices
        invoices={invoices}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        counts={INVOICES_COUNT}
      />
    </>
  )
}

export default Page