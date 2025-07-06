'use client';
import React, { useEffect, useState } from 'react';
import { useApplyForLeaveMutation } from '@/slices/attendance/attendance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const Page = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [applyForLeave, { isLoading, isSuccess, isError }] = useApplyForLeaveMutation();
  const { companySlug } = useCompany();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Leave applied successfully!");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error("Error applying leave");
    }
  }, [isError]);

  const handleApplyLeave = async () => {
    try {
      const formattedDates = [...selectedDates]
        .sort((a, b) => a.getTime() - b.getTime())
        .map(date => date.toISOString().split('T')[0]); // Converts to "YYYY-MM-DD"
      const response = await applyForLeave({
        dates: formattedDates,
        subject: '',
        description: ''
      }).unwrap();
      console.log('Leave applied successfully:', response);
    } catch (err) {
      console.error('Error applying leave:', err);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDates((prev) => {
      const exists = prev.some((d) => d.toDateString() === date.toDateString());
      return exists
        ? prev.filter((d) => d.toDateString() !== date.toDateString()) // Remove if already selected
        : [...prev, date]; // Add if not selected
    });
  };

  const getFormattedRange = () => {
    if (selectedDates.length === 0) return '';
    if (selectedDates.length === 1) {
      return format(selectedDates[0], 'MM-dd-yyyy');
    }
    const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    return `${format(sorted[0], 'MM-dd-yyyy')} to ${format(sorted[sorted.length - 1], 'MM-dd-yyyy')}`;
  };

  return (
    <>
      <Link href={`/${companySlug}/employee/attendance`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>

      <div style={{ padding: '20px' }}>
        <h1>Apply for Leave</h1>

        {/* Inline Multi-Date Calendar */}
        <div style={{ maxWidth: '300px', marginBottom: '20px' }}>
          <DatePicker
            inline
            selected={null}
            onChange={(date: Date | null) => date && handleDateClick(date)}
            highlightDates={selectedDates}
          />
        </div>

        {selectedDates.length > 0 && (
          <p><strong>Date Range:</strong> {getFormattedRange()}</p>
        )}

        <button
          onClick={handleApplyLeave}
          disabled={isLoading || selectedDates.length === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: '#009693',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Applying...' : 'Apply for Leave'}
        </button>

        <ToastContainer />
      </div>
    </>
  );
};

export default Page;
