// app/expenses/page.tsx
'use client';

import { useState } from 'react';
import {
  Box,
} from '@mui/material';
import { useFetchExpensesQuery, useDeleteExpenseMutation } from '@/slices';
import ExpenseForm from './components/ExpenseForm';
import { FaEdit, FaPlus, FaTasks, FaTrash } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import EmptyState from '@/components/common/EmptyState';
import Image from 'next/image';
import LoadingState from '@/components/common/LoadingState';

export default function ExpensesPage() {
  const { data, isLoading, error } = useFetchExpensesQuery();
  const expenses = data?.data || [];
  const [deleteExpense] = useDeleteExpenseMutation();
  const [openForm, setOpenForm] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleEdit = (expense: Expense) => {
    setCurrentExpense(expense);
    setOpenForm(true);
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete !== null) {
      try {
        await deleteExpense(itemToDelete).unwrap();
      } catch (error) {
        console.error("Failed to delete expense:", error);
      } finally {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentExpense(null);
  };

  const handleCancelForm = () => {
    setOpenForm(false);
    setCurrentExpense(null);
  };

  type Column<T> = {
    label: string;
    key?: keyof T;
    render?: (row: T) => React.ReactNode;
  };

  const columns: Column<Expense>[] = [
    {
      label: 'Image',
      render: (row) =>
        row.file_url ? (
          <Image
            src={row.file_url}
            alt="Expense file"
            width={40}
            height={40}
          />
        ) : (
          <span>-</span>
        ),
    },
    { label: 'Heading', key: 'heading' },
    {
      label: 'Description',
      render: (row) => row.description || '-',
      key: 'description'
    },
    {
      label: 'Tags',
      render: (row) =>
        Array.isArray(row.tags) && row.tags.length > 0
          ? row.tags
            .map((tag: Tag) => {
              const name = typeof tag === 'string' ? tag : tag.name;
              return name.charAt(0).toUpperCase() + name.slice(1);
            })
            .join(', ')
          : '-',
      key: 'tags'
    },
    {
      label: 'Price',
      render: (row) => `${Number(row.price).toFixed(2)}`,
      key: 'price'
    },
    {
      label: 'Status',
      render: (row) => row.status || '-',
      key: 'status'
    },
    {
      label: 'Actions',
      render: (expense: Expense) => (
        <div className="table-actions ">
          <FaEdit onClick={() => handleEdit(expense)} style={{ marginRight: 10, color: '#384B70' }} />
          <FaTrash onClick={() => handleDelete(expense.id)}  style={{  color: '#384B70' }} />
        </div>
      ),
    },

  ];

  if (isLoading) return <LoadingState />;
if (error) {
    return (
      <EmptyState
        icon="alert"
        title="Failed to fetching expenses."
        message="Something went wrong while fetching expenses."
      />
    );
  }
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        {expenses.length > 0 && (
          <button
            onClick={() => setOpenForm(true)}
            className='buttons'
          >
            <FaPlus />
            Add Expense
          </button>
        )}
      </Box>


      {(expenses && expenses?.length > 0) ? (
        <ResponsiveTable
          data={expenses}
          columns={columns}
        />
      ) : (
        <EmptyState
          icon={<FaTasks className="empty-state-icon" />}
          title="No expenses found"
          message="You haven't added any expenses yet."
          action={
            <button className="buttons create-btn" onClick={() => setOpenForm(true)}>
              <FaPlus /> Add Expense
            </button>
          }
        />
      )}

      <Modal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          handleCancelForm();
        }}
        title={currentExpense ? "Edit Expense" : "Add New Expense"}
        width="600px"
      >
        <ExpenseForm
          expense={currentExpense}
          onSuccess={handleCloseForm}
          onCancel={handleCancelForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Are you sure you want to delete this expense?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
        type="delete"
      />
    </>
  );
}