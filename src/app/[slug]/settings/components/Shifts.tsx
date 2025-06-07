'use client';

import React, { useState } from 'react';
import {
  useCreateShiftMutation,
  useDeleteShiftMutation,
  useUpdateShiftMutation,
  useFetchCompanyShiftsQuery,
} from '@/slices/company/companyApi';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
} from '@mui/material';
import { FaPlus, FaTasks, FaTrash, FaEdit } from 'react-icons/fa';
import EmptyState from '@/components/common/EmptyState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';

const Shifts: React.FC = () => {
  const { data, refetch } = useFetchCompanyShiftsQuery();
  const [createShift] = useCreateShiftMutation();
  const [updateShift] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    shift_name: '',
    start_time: '',
    end_time: '',
    weekly_off_day: '',
  });

  const startTimeRef = React.useRef<HTMLInputElement>(null);
  const endTimeRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      shift_name: '',
      start_time: '',
      end_time: '',
      weekly_off_day: '',
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editId !== null) {
        await updateShift({ id: editId, ...form }).unwrap();

        toast.success('Shift updated successfully!');
      } else {
        await createShift(form).unwrap();
        toast.success('Shift created successfully!');
      }
      resetForm();
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(editId ? 'Failed to update shift' : 'Failed to create shift');
    }
  };

  const handleEdit = (shift: Shift) => {
    setForm({
      shift_name: shift.shift_name,
      start_time: shift.start_time,
      end_time: shift.end_time,
      weekly_off_day: shift.weekly_off_day,
    });
    setEditId(shift.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await deleteShift(id).unwrap();
        toast.success('Shift deleted successfully!');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete shift');
      }
    }
  };

  type Column<T> = {
    label: string;
    key?: keyof T;
    render?: (row: T) => React.ReactNode;
  };

  const columns: Column<Shift>[] = [
    { label: 'Shift Name', key: 'shift_name' as keyof Shift },
    { label: 'Start Time', key: 'start_time' as keyof Shift },
    { label: 'End Time', key: 'end_time' as keyof Shift },
    { label: 'Weekly Off', key: 'weekly_off_day' as keyof Shift },
    {
      label: 'Actions',
      key: undefined,
      render: (shift: Shift) => (
        <div className="table-actions">
          <button className="edit-btn" onClick={() => handleEdit(shift)}>
            <FaEdit />
          </button>
          <button className="delete-btn" onClick={() => handleDelete(shift.id)}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="shift-page">
      <div className="navigation-buttons shift-header">
        {(data?.data?.length ?? 0) > 0 && (
          <button className="buttons" onClick={() => setModalOpen(true)}>
            <FaPlus /> Add Shift
          </button>
        )}
      </div>

      {(data?.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<FaTasks />}
          title="No shifts found"
          message="You haven’t created any shifts yet."
          action={
            <button className="buttons create-btn" onClick={() => setModalOpen(true)}>
              <FaPlus /> Add Shift
            </button>
          }
        />
      ) : (
        <ResponsiveTable data={data?.data || []} columns={columns} />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editId !== null ? 'Edit Shift' : 'Create New Shift'}
      >
        <div className="modal-content">
          <div className="shift-form-inner">
            <Box sx={{ mb: 2 }}>
              <label htmlFor="shift_name">Shift Name</label>
              <TextField
                id="shift_name"
                name="shift_name"
                value={form.shift_name}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder="Enter Shift Name"
              />
            </Box>

            <Box sx={{ mb: 2 }} onClick={() => startTimeRef.current?.showPicker?.()}>
              <label htmlFor="start_time">Start Time</label>
              <TextField
                id="start_time"
                inputRef={startTimeRef}
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }} onClick={() => endTimeRef.current?.showPicker?.()}>
              <label htmlFor="end_time">End Time</label>
              <TextField
                id="end_time"
                inputRef={endTimeRef}
                name="end_time"
                type="time"
                value={form.end_time}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Box>
            <div>
              <select
                id="weekly_off_day"
                name="weekly_off_day"
                value={form.weekly_off_day}
                onChange={handleSelectChange}
                className="form-input"
              >
                <option value="" disabled>
                  Select Weekly Off Day
                </option>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <button
              className="cancel-btn buttons"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="buttons create-btn">
              {editId !== null ? 'Update' : 'Create'}
            </button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default Shifts;
