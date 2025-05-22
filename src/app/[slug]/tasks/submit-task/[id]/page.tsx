'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetTasksQuery, useSubmitTaskMutation } from '@/slices/tasks/taskApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function SubmitTask() {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const taskId = idParam ?? '';
  const { setTitle } = useBreadcrumb();
  const { data: tasksData, isLoading } = useGetTasksQuery();
  const task = tasksData?.data.find(t => t.id.toString() === taskId);

  const [submitTask, { isLoading: submitting }] = useSubmitTaskMutation();

  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    setTitle('Submit Task');
  }, [setTitle]);

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [files]);

  if (isLoading) return <p>Loading…</p>;
  if (!task) return <p>No task found with ID: {taskId}</p>;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      return toast.error('Please enter a description');
    }
    if (files.length === 0) {
      return toast.error('Please select at least one file');
    }

    const formData = new FormData();
    formData.append('id', taskId);
    formData.append('description', description);
    files.forEach(file => formData.append('attachments[]', file));

    try {
      const result = await submitTask({ id: task.id, formData }).unwrap();
      console.log(result);
      toast.success(result.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <ToastContainer />
      <h2>Task: {task.name}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label><strong>Description</strong></label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe your work..."
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label><strong>Attachments</strong></label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'block', marginTop: 8 }}
          />
        </div>

        {previews.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {previews.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`Preview ${idx + 1}`}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                width={100}
                height={100}
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 16px',
            backgroundColor: '#009693',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {submitting ? 'Submitting…' : 'Submit Task'}
        </button>
      </form>
    </div>
  );
}
