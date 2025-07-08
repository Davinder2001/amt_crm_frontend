'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSubmitTaskMutation } from '@/slices';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';

export interface SubmitTaskProps {
    onTaskSubmit?: () => void;
    onSuccess?: () => void;
    taskId?: number;
}

export default function SubmitTaskComponent({ onTaskSubmit, onSuccess, taskId }: SubmitTaskProps) {
    const [submitTask, { isLoading: submitting }] = useSubmitTaskMutation();
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return toast.error('Please enter a description');
        if (files.length === 0) return toast.error('Please select at least one file');

        const formData = new FormData();
        formData.append('id', String(taskId));
        formData.append('description', description);
        files.forEach((file) => formData.append('attachments[]', file));

        try {
            const result = await submitTask({ id: taskId!, formData }).unwrap();
            toast.success(result.message);
            if (onTaskSubmit) onTaskSubmit();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="submit-task-form">
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Describe your work..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="attachments">Upload Attachments</label>
                    <div className="upload-card">
                        <input
                            id="attachments"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="upload-input"
                        />
                        <FiUpload size={18} className="upload-icon" />
                        <p className="upload-text">Click here to upload or drag & drop</p>
                        <small className="upload-note">SVG, JPG, PNG up to 10MB</small>
                    </div>
                </div>

                {/* Preview uploaded images */}
                {files.length > 0 && (

                    <div className="image-preview-grid">
                        {files.map((file, index) => (
                            <div key={index} className="image-preview-item">
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    width={50}
                                    height={50}
                                />
                                <span
                                    className="remove-image-btn"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <FaTimes />
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <div className='task-timeline-btn-wrapper'>
                    <button type="submit" className="buttons" disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Submit'}
                    </button>
                </div>
            </form>
        </>
    );
}