'use client';;
import React, { useState } from 'react'
import AllInvoices from './components/allInvoices';
import { useFetchInvoicesQuery } from '@/slices';

function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  return (
    <>
      <AllInvoices invoices={invoices} isLoadingInvoices={isLoading} isError={isError} pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange} />
    </>
  )
}

export default Page