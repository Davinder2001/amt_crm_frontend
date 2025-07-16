'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useGetTasksQuery, useApproveHistoryMutation, useRejectHistoryMutation, } from '@/slices';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Modal from '@/components/common/Modal';
import LoadingState from '@/components/common/LoadingState';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function TaskViewPage() {
  const { id } = useParams();
  const { setTitle } = useBreadcrumb();

  const { data, isLoading: isTasksLoading } = useGetTasksQuery({});
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

  const task = data?.tasks.find((task) => task.id.toString() === id);

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

  const handleDownloadAll = async () => {
    if (!attachments.length) {
      toast.info("No attachments to download.");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("attachments");

    await Promise.all(
      attachments.map(async (attachment, index) => {
        const url = typeof attachment === 'string' ? attachment : attachment.url;

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          const blob = await response.blob();

          // Extract file extension from URL or use default
          let extension = 'jpg';
          const match = url.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
          if (match) extension = match[1];

          // Create unique filename using task ID, index, and timestamp
          const timestamp = new Date().getTime();
          const filename = `task-${task.id}-${timestamp}-${index}.${extension}`;

          folder?.file(filename, blob);
        } catch (err) {
          console.error("Download failed for", url, err);
          toast.error(`Failed to include some attachments.`);
        }
      })
    );

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `task-${task.id}-attachments.zip`);
      toast.success("All attachments downloaded successfully!");
    } catch (err) {
      console.error("ZIP generation failed", err);
      toast.error("Failed to create ZIP file.");
    }
  };


  const status = task.status?.toLowerCase();
  const statusClass =
    status === 'pending'
      ? 'status-badge pending'
      : status === 'submitted'
        ? 'status-badge submitted'
        : 'status-badge default';

  const attachments = Array.isArray(task.attachments) ? task.attachments : [];

  return (
    <div className={`task-view-outer ${attachments.length === 0 ? 'single-column' : ''}`}>
      <div className="task-view-wrapper">
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
          {status === 'submitted'?
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
          </div>:'' 
        }
          
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="task-attachment-outer">
          <div className='task-attachment-header'>
            <h2>Attachments:</h2>
            {attachments.length > 1 && (
              <button onClick={handleDownloadAll}>Download All</button>
            )}

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
          <div style={{ textAlign: 'center' }} className='view-task-modal-outer'>
            <Image
              src={openImage}
              alt="Full Preview"
              width={600}
              height={400}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
            <div className='task-single-image-dawnload'>
              <button
                onClick={() => handleDownload(openImage)}
                className='buttons'
              >
                Download Image
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TaskViewPage;