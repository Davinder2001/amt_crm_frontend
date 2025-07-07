'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useApplyForLeaveMutation } from '@/slices/attendance/attendance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import { FaFileUpload } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isSameDay, isSunday } from 'date-fns';
import { useFetchLeavesQuery } from '@/slices/company/companyApi';

interface ApplyLeaveFormProps {
    onSuccess: () => void;
}

const ApplyForLeave: React.FC<ApplyLeaveFormProps> = ({ onSuccess }) => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [leaveType, setLeaveTypeId] = useState(''); // ✅ updated: store ID
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [document, setDocument] = useState<File | null>(null);

    const { data } = useFetchLeavesQuery();
    const [applyForLeave, { isLoading, isSuccess, isError }] = useApplyForLeaveMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Leave applied successfully!");
            setSelectedDates([]);
            setLeaveTypeId('');
            setSubject('');
            setDescription('');
            setDocument(null);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error("Error applying leave");
        }
    }, [isError]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDocument(file);
        }
    };

    const handleApplyLeave = async () => {
        try {
            const formattedDates = [...selectedDates]
                .sort((a, b) => a.getTime() - b.getTime())
                .map(date => date.toISOString().split('T')[0]);

            const payload = {
                dates: formattedDates,
                leave_type: Number(leaveType), // ✅ send ID as number
                subject,
                description,
                document,
            };

            const response = await applyForLeave(payload).unwrap();
            onSuccess();
            console.log('Leave applied successfully:', response);
        } catch (err) {
            console.error('Error applying leave:', err);
        }
    };

    const handleDateClick = (date: Date) => {
        setSelectedDates((prev) => {
            const exists = prev.some((d) => d.toDateString() === date.toDateString());

            if (exists) {
                return prev.filter((d) => d.toDateString() !== date.toDateString());
            } else {
                if (prev.length < 2) {
                    return [...prev, date];
                } else {
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
        <div className='leave-application-container'>
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
                            if (isSameDay(date, new Date())) return 'current-date';
                            if (isSunday(date)) return 'sunday-date';
                            if (selectedDates.some(d => isSameDay(d, date))) return 'selected-green';
                            return '';
                        }}
                        openToDate={selectedDates.length > 0 ? selectedDates[0] : new Date()}
                    />
                </div>

                <div className="details-card">
                    {/* Leave Type Dropdown */}
                    <div className="input-group">
                        <label>Leave Type</label>
                        <select
                            value={leaveType}
                            onChange={(e) => setLeaveTypeId(e.target.value)}
                            className="modern-input"
                        >
                            <option value="" disabled>Select Leave Type</option>
                            {data?.data?.map((leave: { id: number; name: string }) => (
                                <option key={leave.id} value={leave.id.toString()}>
                                    {leave.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subject Input */}
                    <div className="input-group">
                        <label>Subject</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter subject title (e.g., Family emergency)"
                            className="modern-input"
                        />
                    </div>

                    {/* Description Textarea */}
                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe your leave..."
                            className="modern-textarea"
                        />
                    </div>

                    {/* File Upload */}
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
                                        <a
                                            href={URL.createObjectURL(document)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="preview-link"
                                        >
                                            <Image
                                                src={URL.createObjectURL(document)}
                                                alt="Preview"
                                                fill
                                                className="object-contain rounded"
                                                unoptimized
                                            />
                                        </a>
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
                        <button
                            className="submit-button"
                            onClick={handleApplyLeave}
                            disabled={
                                isLoading ||
                                selectedDates.length === 0 ||
                                !leaveType ||
                                !subject ||
                                !description
                            }
                        >
                            {isLoading ? (
                                <span className="loading-dots">Submitting</span>
                            ) : (
                                'Submit Request'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default ApplyForLeave;
