// app/expenses/page.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { useFetchExpensesQuery, useDeleteExpenseMutation } from '@/slices';
import ExpenseForm from './components/ExpenseForm';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Modal from '@/components/common/Modal';

export default function ExpensesPage() {
  const { data: expenses, isLoading, isError } = useFetchExpensesQuery();
  const [deleteExpense] = useDeleteExpenseMutation();
  const [openForm, setOpenForm] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setCurrentExpense(expense);
    setOpenForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentExpense(null);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Error loading expenses</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Expenses</Typography>
        <button
          onClick={() => setOpenForm(true)}
          className='buttons'
        >
          <FaPlus />
          Add Expense
        </button>
      </Box>

      <div style={{ margin: '20px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Heading</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense) => (
              <tr key={expense.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px 16px' }}>{expense.heading}</td>
                <td style={{ padding: '12px 16px' }}>{expense.description || '-'}</td>
                <td style={{ padding: '12px 16px' }}>${Number(expense.price).toFixed(2)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <FaEdit style={{ marginRight: '8px' }} onClick={() => handleEdit(expense)} />
                  <FaTrash style={{ marginRight: '8px' }} onClick={() => handleDelete(expense.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        title="Add New Item"
        width="600px"
      >
        <ExpenseForm
          expense={currentExpense}
          onSuccess={handleCloseForm}
        />

      </Modal>
    </>
  );
}