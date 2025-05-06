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
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [applyForLeave, { isLoading, isSuccess, isError }] = useApplyForLeaveMutation();
  const { companySlug } = useCompany();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Leave applied successfully!");
      setSelectedDates([]);
      setSubject('');
      setDescription('');
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
        .map(date => date.toISOString().split('T')[0]);

      const response = await applyForLeave({
        dates: formattedDates,
        subject,
        description,
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
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date];
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
      <Link href={`/${companySlug}/attendence`} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </Link>

      <div className="apply-leave-page">
        <div className="form-card">
          <h1 className="page-title">Apply for Leave</h1>
          <div className='aply-for-leave-form-outer'>
            <div className="datepicker-container">
              <DatePicker
                inline
                selected={null}
                onChange={(date: Date | null) => date && handleDateClick(date)}
                highlightDates={selectedDates}
              />
            

            {selectedDates.length > 0 && (
              <p className="date-range">
                <strong>Date Range:</strong> {getFormattedRange()}
              </p>
            )}
            </div>
<div className='aply-for-leave-input-wrapper'>
            <div className="input-group">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
              />
            </div>

            <div className="input-group">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your reason for leave..."
              />
            </div>
            <div className='aply-for-leave-btn-wrapper'>
          <button
            className="apply-button"
            onClick={handleApplyLeave}
            disabled={isLoading || selectedDates.length === 0 || !subject || !description}
          >
            {isLoading ? 'Applying...' : 'Apply for Leave'}
          </button>
          </div>
            </div>
          </div>
          

          <ToastContainer />
        </div>
      </div>
    </>

  );
};

export default Page;
