'use client';

import React, { useState } from 'react';
import {
  useCreateShiftMutation,
  useFetchCompanyShiftsQuery,
} from '@/slices/company/companyApi';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,

} from '@mui/material';
import { FaPlus, FaTasks } from 'react-icons/fa';
import EmptyState from '@/components/common/EmptyState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';

const Shifts: React.FC = () => {
  const { data, refetch } = useFetchCompanyShiftsQuery();
  const [createShift] = useCreateShiftMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    shift_name: '',
    start_time: '',
    end_time: '',
    weekly_off_day: '',
  });

  const startTimeRef = React.useRef<HTMLInputElement>(null);
  const endTimeRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createShift(form).unwrap();
      toast.success('Shift created successfully!');
      setForm({
        shift_name: '',
        start_time: '',
        end_time: '',
        weekly_off_day: '',
      });
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create shift');
    }
  };

  const columns: { label: string; key: keyof Shift }[] = [
    { label: 'Shift Name', key: 'shift_name' },
    { label: 'Start Time', key: 'start_time' },
    { label: 'End Time', key: 'end_time' },
    { label: 'Weekly Off', key: 'weekly_off_day' },
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
        onClose={() => setModalOpen(false)}
        title="Create New Shift"
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
                placeholder='Enter Shift Name'
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

            <Box sx={{ mb: 3 }}>
              <label htmlFor="weekly_off_day">Weekly Off Day</label>
              <select
                id="weekly_off_day"
                name="weekly_off_day"
                value={form.weekly_off_day}
                onChange={handleChange}
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
            </Box>

          </div>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <button className="cancel-btn buttons" onClick={() => setModalOpen(false)} color="error">
              Cancel
            </button>
            <button onClick={handleSubmit} className="buttons create-btn">
              Create
            </button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default Shifts;
