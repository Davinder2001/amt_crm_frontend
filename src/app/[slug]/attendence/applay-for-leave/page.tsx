'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useApplyForLeaveMutation } from '@/slices/attendance/attendance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Image from "next/image";
import { FaArrowLeft, FaFileUpload } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isSameDay, isSunday } from 'date-fns';

const Page = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [applyForLeave, { isLoading, isSuccess, isError }] = useApplyForLeaveMutation();
  const { companySlug } = useCompany();
  const [document, setDocument] = useState<File | null>(null);
  useEffect(() => {
    if (isSuccess) {
      toast.success("Leave applied successfully!");
      setSelectedDates([]);
      setSubject('');
      setDescription('');
      setDocument(null);
    }
  }, [isSuccess]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
    }
  };
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

      if (exists) {
        // If date is already selected, remove it (toggle off)
        return prev.filter((d) => d.toDateString() !== date.toDateString());
      } else {
        // If less than 2 dates selected, add new date
        if (prev.length < 2) {
          return [...prev, date];
        } else {
          // If already 2 dates selected, ignore additional selections
          // Optional: You can show a toast or alert here to inform the user
          toast.info("You can only select up to 2 dates.");
          return prev;
        }
      }
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
    <div className="">
      <Link href={`/${companySlug}/attendence`} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </Link>
      <div className='leave-application-container'>
        <div className="application-header">

        </div>

        <div className="application-body">
          <div className="calendar-card">
            <div className="calendar-header">
              <h2>Select Your Leave Dates</h2>

            </div>

            <DatePicker
              key={selectedDates.length === 0 ? 'no-date' : 'has-date'}
              inline
              onChange={(date: Date | null) => date && handleDateClick(date)}
              calendarClassName="modern-calendar"
              dayClassName={(date) => {
                if (isSameDay(date, new Date())) {
                  return 'current-date'; // highlight current date
                }
                if (isSunday(date)) {
                  return 'sunday-date'; // red color for Sundays
                }
                if (selectedDates.some(d => isSameDay(d, date))) {
                  return 'selected-green'; // your existing selected styling
                }
                return '';
              }}
              openToDate={selectedDates.length > 0 ? selectedDates[0] : new Date()}
            />



          </div>

          <div className="details-card">
            <div className="input-group">
              <label>Leave Type</label>
              <div className="type-chips">
                {['Vacation', 'Sick Leave', 'Personal', 'Other'].map((type) => (
                  <button
                    key={type}
                    className={`chip ${subject === type ? 'chip-active' : ''}`}
                    onClick={() => {
                      if (type === 'Other') {
                        setSubject('');
                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 0);
                      } else {
                        setSubject(type);
                      }
                    }}
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>



            <div className="input-group">
              <label>Subject</label>
              <input
                ref={inputRef}
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Leave reason title"
                className="modern-input"
                disabled={subject !== '' && subject !== 'Other' && ['Vacation', 'Sick Leave', 'Personal'].includes(subject)}
              />


            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your leave..."
                className="modern-textarea"
              />
            </div>
            <div className="input-group">
              <label>Attach Document (optional)</label>
              <div
                className="file-upload-box"
                onClick={() => window.document.getElementById('hidden-file-input')?.click()}
              >
                <FaFileUpload size={24} color="#888" />
                <p>{document ? document.name : 'Click or drag file here to upload'}</p>
              </div>
              <input
                type="file"
                id="hidden-file-input"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              {document && (
                <div className="file-preview">
                  {document.type.startsWith('image/') ? (
                    <div className="thumbnail-wrapper">
                      <Image
                        src={URL.createObjectURL(document)}
                        alt="Preview"
                        fill
                        className="object-contain rounded"
                        unoptimized
                      />
                      <button
                        className="remove-button"
                        onClick={() => setDocument(null)}
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span>{document.name}</span>
                  )}
                  <span>{(document.size / 1024).toFixed(2)} KB</span>
                </div>
              )}

            </div>

            <div className="date-range-display">
              {selectedDates.length > 0 && (
                <span className="date-range-badge">
                  📅 {getFormattedRange()}
                </span>
              )}
            </div>
            <button
              className="submit-button"
              onClick={handleApplyLeave}
              disabled={isLoading || selectedDates.length === 0 || !subject || !description}
            >
              {isLoading ? (
                <span className="loading-dots">Submitting</span>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </div>

        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default Page;