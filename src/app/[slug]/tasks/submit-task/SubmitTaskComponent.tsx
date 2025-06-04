'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetTasksQuery, useSubmitTaskMutation } from '@/slices/tasks/taskApi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

export interface SubmitTaskProps {
    onTaskSubmit?: () => void;
    onSuccess?: () => void;
    taskId?: number;
}

export default function SubmitTaskComponent({ onTaskSubmit, onSuccess, taskId }: SubmitTaskProps) {

    const { setTitle } = useBreadcrumb();
    const { data: tasksData, isLoading } = useGetTasksQuery();
    const task = tasksData?.data.find((t) => t.id === taskId);


    const [submitTask, { isLoading: submitting }] = useSubmitTaskMutation();
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

    useEffect(() => {
        setTitle('Submit Task');
    }, [setTitle]);

    useEffect(() => {
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
        return () => urls.forEach((u) => URL.revokeObjectURL(u));
    }, [files]);

    if (isLoading) return <p>Loading…</p>;
    if (!task) return <p>No task found with ID: {taskId}</p>;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files ? Array.from(e.target.files) : []);
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
            const result = await submitTask({ id: task.id, formData }).unwrap();
            toast.success(result.message);
            if (onTaskSubmit) onTaskSubmit();
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="submit-task-wrapper">
            <h2 className="task-title">Task: {task.name}</h2>
            <form onSubmit={handleSubmit} className="submit-task-form">
                <div className="form-group">
                    <label htmlFor="description"><strong>Description</strong></label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe your work..."
                    />
                </div>

                <div className="form-group fancy-upload">
                    <label htmlFor="attachments" className="upload-label">
                        <strong>Upload Attachments</strong>
                    </label>
                    <div className="upload-card">
                        <input
                            id="attachments"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="upload-input"
                        />
                        <div className="upload-inner">
                            <div className="upload-icon">📤</div>
                            <p className="upload-text">Show us your progress! Upload an image</p>
                        </div>
                    </div>
                </div>


                {previews.length > 0 && (
                    <div className="preview-container">
                        {previews.map((src, idx) => (
                            <div className="preview-box" key={idx}>
                                <Image
                                    src={src}
                                    alt={`Preview ${idx + 1}`}
                                    className="preview-image"
                                    width={100}
                                    height={100}
                                    onClick={() => setSelectedPreview(src)}
                                />
                                <button type="button" className="remove-image" onClick={() => handleRemoveImage(idx)}>
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className='task-timeline-btn-wrapper'>
                    <button type="submit" className="submit-button" disabled={submitting}>
                        {submitting ? 'Submitting…' : 'Submit Task'}
                    </button>
                </div>
            </form>

            {/* Image Viewer Modal */}
            {selectedPreview && (
                <div className="media-modal" onClick={() => setSelectedPreview(null)}>
                    <Image src={selectedPreview} alt="Preview Fullscreen" width={500} height={500} />
                </div>
            )}
        </div>
    );
}
