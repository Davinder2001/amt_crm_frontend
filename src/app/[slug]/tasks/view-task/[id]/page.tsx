'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import {
  useGetTasksQuery,
  useApproveHistoryMutation,
  useRejectHistoryMutation,
} from '@/slices/tasks/taskApi';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import Image from 'next/image';
import Modal from '@/components/common/Modal';
import LoadingState from '@/components/common/LoadingState';

function TaskViewPage() {
  const { id } = useParams();
  const { setTitle } = useBreadcrumb();
  const { companySlug } = useCompany();

  const { data: tasks, isLoading: isTasksLoading } = useGetTasksQuery();
  const [approveHistory, { isLoading: isApproving }] = useApproveHistoryMutation();
  const [rejectHistory, { isLoading: isRejecting }] = useRejectHistoryMutation();
  const [openImage, setOpenImage] = useState<string | null>(null);

  useEffect(() => {
    setTitle('View Task');
  }, [setTitle]);

  if (isTasksLoading) {
    return (
      <div className="page-loader">
        <LoadingState />
      </div>
    );
  }

  const task = tasks?.data.find((task) => task.id.toString() === id);

  if (!task) {
    return <p className="no-task-message">No task found with ID: {id}</p>;
  }

  const handleApprove = async () => {
    try {
      await approveHistory({ message: String(task.id) }).unwrap();
      toast.success('Task approved successfully');
    } catch {
      toast.error('Error approving task');
    }
  };

  const handleReject = async () => {
    try {
      await rejectHistory({ id: task.id }).unwrap();
      toast.success('Task rejected');
    } catch {
      toast.error('Error rejecting task');
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', url.split('/').pop() || 'image.jpg');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    attachments.forEach((url, index) => {
      const imageUrl = typeof url === 'string' ? url : url.url;
      const link = document.createElement('a');
      link.href = imageUrl;
      link.setAttribute('download', imageUrl.split('/').pop() || `attachment-${index + 1}.jpg`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const status = task.status?.toLowerCase();
  const statusClass =
    status === 'pending'
      ? 'status-badge pending'
      : status === 'ended'
        ? 'status-badge ended'
        : 'status-badge default';

  const attachments = Array.isArray(task.attachments) ? task.attachments : [];

  return (
    <div className={`task-view-outer ${attachments.length === 0 ? 'single-column' : ''}`}>
      <div className="task-view-wrapper">
        <Link href={`/${companySlug}/tasks`} className="back-button">
          <FaArrowLeft />
        </Link>

        <div className="task-card">
          <div className="Status-wrapper">
            <strong>Status:</strong>
            <span className={statusClass}>
              {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'N/A'}
            </span>
          </div>

          <div className="task-grid">
            <div className="task-grid-values">
              <strong>Task Name:</strong>
              <p>{task.name}</p>
            </div>
            <div className="task-grid-values">
              <strong>Assigned By:</strong>
              <p>{task.assigned_by_name}</p>
            </div>
            <div className="task-grid-values">
              <strong>Assigned To:</strong>
              <p>{task.assigned_to_name}</p>
            </div>
            <div className="task-grid-values">
              <strong>Assigned Role:</strong>
              <p>{task.assigned_role}</p>
            </div>
            <div className="task-grid-values">
              <strong>Start Date:</strong>
              <p>{task.start_date?.replace('T', ' ').slice(0, 16)}</p>
            </div>
            <div className="task-grid-values">
              <strong>End Date:</strong>
              <p>{task.end_date?.replace('T', ' ').slice(0, 16)}</p>
            </div>
            <div className="description-field description-span-two-columns">
              <strong>Description:</strong>
              <p>{task.description}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="reject"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? 'Rejecting...' : <>
                <FaTimes /> Reject
              </>}
            </button>
            <button
              className="approve"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? 'Approving...' : <>
                <FaCheck /> Approve
              </>}
            </button>
          </div>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="task-attachment-outer">
          <div className='task-attachment-header'>
            <h2>Attachments:</h2>
            <button
              onClick={handleDownloadAll}
            >
              Download All
            </button>
          </div>

          <div className="task-images-outer">
            {attachments.map((attachment, idx) => {
              const imageUrl = typeof attachment === 'string' ? attachment : attachment.url;
              return (
                <div key={idx} className="image-wrapper" onClick={() => setOpenImage(imageUrl)}>
                  <Image
                    src={imageUrl}
                    alt={`Attachment ${idx + 1}`}
                    width={150}
                    height={150}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {openImage && (
        <Modal isOpen={true} onClose={() => setOpenImage(null)} title="Image Preview">
          <div style={{ textAlign: 'center' }}>
            <Image
              src={openImage}
              alt="Full Preview"
              width={600}
              height={400}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
            <button
              onClick={() => handleDownload(openImage)}
              style={{
                marginTop: '1rem',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Download Image
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TaskViewPage;
