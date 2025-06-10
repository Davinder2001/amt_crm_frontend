// 'use client';

// import React, { useState } from 'react';
// import {
//   useCreateShiftMutation,
//   useDeleteShiftMutation,
//   useUpdateShiftMutation,
//   useFetchCompanyShiftsQuery,
// } from '@/slices/company/companyApi';
// import { toast } from 'react-toastify';
// import {
//   Box,
//   TextField,
// } from '@mui/material';
// import { FaPlus, FaTasks, FaTrash, FaEdit } from 'react-icons/fa';
// import EmptyState from '@/components/common/EmptyState';
// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import Modal from '@/components/common/Modal';

// const Shifts: React.FC = () => {
//   const { data, refetch } = useFetchCompanyShiftsQuery();
//   const [createShift] = useCreateShiftMutation();
//   const [updateShift] = useUpdateShiftMutation();
//   const [deleteShift] = useDeleteShiftMutation();

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);

//   const [form, setForm] = useState({
//     shift_name: '',
//     start_time: '',
//     end_time: '',
//     weekly_off_day: '',
//   });

//   const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

//   const startTimeRef = React.useRef<HTMLInputElement>(null);
//   const endTimeRef = React.useRef<HTMLInputElement>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const resetForm = () => {
//     setForm({
//       shift_name: '',
//       start_time: '',
//       end_time: '',
//       weekly_off_day: '',
//     });
//     setFormErrors({});
//     setEditId(null);
//   };

//   const handleSubmit = async () => {
//     try {
//       const formattedForm = {
//         ...form,
//         start_time: form.start_time.slice(0, 5),
//         end_time: form.end_time.slice(0, 5),
//       };

//       if (editId !== null) {
//         await updateShift({ id: editId, ...formattedForm }).unwrap();
//         toast.success('Shift updated successfully!');
//       } else {
//         await createShift(formattedForm).unwrap();
//         toast.success('Shift created successfully!');
//       }

//       resetForm();
//       setModalOpen(false);
//       refetch();
//     } catch (err: unknown) {
//       if (
//         typeof err === 'object' &&
//         err !== null &&
//         'data' in err &&
//         typeof (err as { data?: unknown }).data === 'object' &&
//         (err as { data: unknown }).data !== null &&
//         'errors' in (err as { data: { errors?: unknown } }).data
//       ) {
//         const backendErrors = (err as { data: { errors: Record<string, string[]> } }).data.errors;
//         const parsedErrors: Partial<Record<keyof typeof form, string>> = {};
//         Object.entries(backendErrors).forEach(([key, value]) => {
//           parsedErrors[key as keyof typeof form] = (value as string[])[0];
//         });
//         setFormErrors(parsedErrors);
//       }
//       toast.error(editId ? 'Failed to update shift' : 'Failed to create shift');
//     }
//   };

//   const handleEdit = (shift: Shift) => {
//     setForm({
//       shift_name: shift.shift_name,
//       start_time: shift.start_time,
//       end_time: shift.end_time,
//       weekly_off_day: shift.weekly_off_day,
//     });
//     setEditId(shift.id);
//     setModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this shift?')) {
//       try {
//         await deleteShift(id).unwrap();
//         toast.success('Shift deleted successfully!');
//         refetch();
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to delete shift');
//       }
//     }
//   };

//   type Column<T> = {
//     label: string;
//     key?: keyof T;
//     render?: (row: T) => React.ReactNode;
//   };

//   const columns: Column<Shift>[] = [
//     { label: 'Shift Name', key: 'shift_name' },
//     { label: 'Start Time', key: 'start_time' },
//     { label: 'End Time', key: 'end_time' },
//     { label: 'Weekly Off', key: 'weekly_off_day' },
//     {
//       label: 'Actions',
//       render: (shift: Shift) => (
//         <div className="table-actions">
//           <button className="edit-btn" onClick={() => handleEdit(shift)}>
//             <FaEdit />
//           </button>
//           <button className="delete-btn" onClick={() => handleDelete(shift.id)}>
//             <FaTrash />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="shift-page">
//       <div className="navigation-buttons shift-header">
//         {(data?.data?.length ?? 0) > 0 && (
//           <button className="buttons" onClick={() => setModalOpen(true)}>
//             <FaPlus /> Add Shift
//           </button>
//         )}
//       </div>

//       {(data?.data?.length ?? 0) === 0 ? (
//         <EmptyState
//           icon={<FaTasks />}
//           title="No shifts found"
//           message="You haven’t created any shifts yet."
//           action={
//             <button className="buttons create-btn" onClick={() => setModalOpen(true)}>
//               <FaPlus /> Add Shift
//             </button>
//           }
//         />
//       ) : (
//         <ResponsiveTable data={data?.data || []} columns={columns} />
//       )}

//       <Modal
//         isOpen={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           resetForm();
//         }}
//         title={editId !== null ? 'Edit Shift' : 'Create New Shift'}
//       >
//         <div className="modal-content">
//           <div className="shift-form-inner">
//             <Box sx={{ mb: 2 }}>
//               <label htmlFor="shift_name">Shift Name</label>
//               <TextField
//                 id="shift_name"
//                 name="shift_name"
//                 value={form.shift_name}
//                 onChange={handleChange}
//                 fullWidth
//                 size="small"
//                 placeholder="Enter Shift Name"
//                 error={!!formErrors.shift_name}
//                 helperText={formErrors.shift_name}
//               />
//             </Box>

//             <Box sx={{ mb: 2 }} onClick={() => startTimeRef.current?.showPicker?.()}>
//               <label htmlFor="start_time">Start Time</label>
//               <TextField
//                 id="start_time"
//                 inputRef={startTimeRef}
//                 name="start_time"
//                 type="time"
//                 value={form.start_time}
//                 onChange={handleChange}
//                 fullWidth
//                 size="small"
//                 error={!!formErrors.start_time}
//                 helperText={formErrors.start_time}
//               />
//             </Box>

//             <Box sx={{ mb: 2 }} onClick={() => endTimeRef.current?.showPicker?.()}>
//               <label htmlFor="end_time">End Time</label>
//               <TextField
//                 id="end_time"
//                 inputRef={endTimeRef}
//                 name="end_time"
//                 type="time"
//                 value={form.end_time}
//                 onChange={handleChange}
//                 fullWidth
//                 size="small"
//                 error={!!formErrors.end_time}
//                 helperText={formErrors.end_time}
//               />
//             </Box>

//             <div>
//               <label htmlFor="weekly_off_day">Weekly Off Day</label>
//               <select
//                 id="weekly_off_day"
//                 name="weekly_off_day"
//                 value={form.weekly_off_day}
//                 onChange={handleSelectChange}
//                 className={`form-input ${formErrors.weekly_off_day ? 'error' : ''}`}
//               >
//                 <option value="" disabled>
//                   Select Weekly Off Day
//                 </option>
//                 {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
//                   <option key={day} value={day}>
//                     {day}
//                   </option>
//                 ))}
//               </select>
//               {formErrors.weekly_off_day && (
//                 <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
//                   {formErrors.weekly_off_day}
//                 </div>
//               )}
//             </div>
//           </div>

//           <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
//             <button
//               className="cancel-btn buttons"
//               onClick={() => {
//                 setModalOpen(false);
//                 resetForm();
//               }}
//             >
//               Cancel
//             </button>
//             <button onClick={handleSubmit} className="buttons create-btn">
//               {editId !== null ? 'Update' : 'Create'}
//             </button>
//           </Box>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Shifts;









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
  const formatTo12Hour = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${suffix}`;
  };

  const [form, setForm] = useState({
    shift_name: '',
    start_time: '',
    end_time: '',
    weekly_off_day: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

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
    setFormErrors({});
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      const formattedForm = {
        ...form,
        start_time: form.start_time.slice(0, 5),
        end_time: form.end_time.slice(0, 5),
      };

      if (editId !== null) {
        await updateShift({ id: editId, ...formattedForm }).unwrap();
        toast.success('Shift updated successfully!');
      } else {
        await createShift(formattedForm).unwrap();
        toast.success('Shift created successfully!');
      }

      resetForm();
      setModalOpen(false);
      refetch();
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: unknown }).data === 'object' &&
        (err as { data: unknown }).data !== null &&
        'errors' in (err as { data: { errors?: unknown } }).data
      ) {
        const backendErrors = (err as { data: { errors: Record<string, string[]> } }).data.errors;
        const parsedErrors: Partial<Record<keyof typeof form, string>> = {};
        Object.entries(backendErrors).forEach(([key, value]) => {
          parsedErrors[key as keyof typeof form] = (value as string[])[0];
        });
        setFormErrors(parsedErrors);
      }
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
    { label: 'Shift Name', key: 'shift_name' },
    {
      label: 'Start Time',
      render: (row) => formatTo12Hour(row.start_time),
    },
    {
      label: 'End Time',
      render: (row) => formatTo12Hour(row.end_time),
    },
    { label: 'Weekly Off', key: 'weekly_off_day' },
    {
      label: 'Actions',
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
        <ResponsiveTable data={data?.data || []} columns={columns} cardViewKey='shift_name'/>
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
                error={!!formErrors.shift_name}
                helperText={formErrors.shift_name}
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
                error={!!formErrors.start_time}
                helperText={formErrors.start_time}
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
                error={!!formErrors.end_time}
                helperText={formErrors.end_time}
              />
            </Box>

            <div>
              <label htmlFor="weekly_off_day">Weekly Off Day</label>
              <select
                id="weekly_off_day"
                name="weekly_off_day"
                value={form.weekly_off_day}
                onChange={handleSelectChange}
                className={`form-input ${formErrors.weekly_off_day ? 'error' : ''}`}
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
              {formErrors.weekly_off_day && (
                <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {formErrors.weekly_off_day}
                </div>
              )}
            </div>
          </div>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
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
