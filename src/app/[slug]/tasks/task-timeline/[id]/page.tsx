'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useViewTaskTimelineQuery,
  useEndTaskMutation,
  useSetReminderMutation,
  useUpdateReminderMutation,
  useViewReminderQuery,
} from '@/slices/tasks/taskApi';
import { MdAccessTime } from 'react-icons/md';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import Image from 'next/image';
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import SubmitTaskComponent from '../../submit-task/SubmitTaskComponent';
import Modal from '@/components/common/Modal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
const ViewTimeline = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { companySlug } = useCompany();
  const [showSubmitTask, setShowSubmitTask] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { data, isLoading, error, refetch } = useViewTaskTimelineQuery(id);
  const { data: reminderData, refetch: refetchReminder } = useViewReminderQuery(Number(id));
  const [endTask, { isLoading: isEnding }] = useEndTaskMutation();
  const [setReminder] = useSetReminderMutation();
  const [updateReminder] = useUpdateReminderMutation();
  const { data: userData } = useFetchProfileQuery();
  const user = userData?.user;

  const [reminderAt, setReminderAt] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [openImage, setOpenImage] = useState<string | null>(null);
  // inside your component
  const reminderInputRef = useRef<HTMLInputElement | null>(null);
  const endDateInputRef = useRef<HTMLInputElement | null>(null);
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
    if (!data?.histories) return;

    const zip = new JSZip();
    const folder = zip.folder("attachments");
    const allAttachments: string[] = [];

    data.histories.forEach(history => {
      if (Array.isArray(history.attachments)) {
        history.attachments.forEach(url => {
          if (!allAttachments.includes(url)) {
            allAttachments.push(url);
          }
        });
      }
    });

    if (allAttachments.length === 0) {
      toast.info("No attachments found.");
      return;
    }

    toast.info("Zipping all attachments...");

    await Promise.all(
      allAttachments.map(async (url, index) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
          const blob = await response.blob();
          const filename = url.split('/').pop() || `image-${index + 1}.jpg`;
          folder?.file(filename, blob);
        } catch (err) {
          console.error(`Error fetching ${url}`, err);
          toast.error(`Error downloading: ${url}`);
        }
      })
    );

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'all-task-attachments.zip');
      toast.success('ZIP file downloaded!');
    }).catch((error) => {
      console.error("ZIP generation failed", error);
      toast.error("Failed to generate ZIP.");
    });
  };

  useEffect(() => {
    if (reminderData?.reminder) {
      setReminderAt(reminderData.reminder.reminder_at?.slice(0, 16) || '');
      setEndDate(reminderData.reminder.end_date?.slice(0, 16) || '');
    }
  }, [reminderData]);

  const handleReminderSubmit = async () => {
    if (!reminderAt || !endDate) {
      toast.error('Please provide both dates.');
      return;
    }

    try {
      if (reminderData?.reminder) {
        await updateReminder({
          taskId: Number(id),
          reminder_at: reminderAt,
          end_date: endDate,
        }).unwrap();
        toast.success('Reminder updated.');
      } else {
        await setReminder({
          taskId: Number(id),
          reminder_at: reminderAt,
          end_date: endDate,
        }).unwrap();
        toast.success('Reminder set.');
      }

      refetchReminder();
      setShowReminderForm(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to set/update reminder.');
    }
  };

  const handleEndTask = async () => {
    setShowConfirm(true);
    try {
      await endTask(Number(id)).unwrap();
      refetch();
      setShowConfirm(false);
      router.push(`/${companySlug}/tasks`);
    } catch (err) {
      toast.error('Error ending task');
      console.error(err);
    }
  };

  const handleSubmitTaskComplete = () => {
    setShowSubmitTask(false);
  };

  const histories = data?.histories ?? [];

  const renderTimelineItem = (history: TaskHistory) => {
    const time = new Date(history.created_at);
    const formattedDate = time.toLocaleDateString();
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const LeftSide = () => (
      <div className="timeline-left">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <strong className="t-date">{formattedDate}</strong>
          <small className="t-status">{history.status}</small>
        </div>

        <div className="avatar-wrapper">
          <div className="avatar">
            <h3>{user?.name?.charAt(0)}</h3>
            <Link href={`/${companySlug}/my-account`} className="av-tooltip">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.number}</p>
              <p><strong>Company:</strong> {companySlug}</p>
            </Link>
          </div>
        </div>
      </div>
    );

    return (
      <React.Fragment key={history.id}>
        <div className="timeline-item">
          <LeftSide />
          <div className="timeline-content">
            <div className="content-block time-block">
              {formattedTime}
              <MdAccessTime size={20} />
            </div>
          </div>
        </div>

        <div className="timeline-item">
          <LeftSide />
          <div className="timeline-content">
            {history.description && (
              <div className="content-block">
                <p className="description">{history.description}</p>
              </div>
            )}
            {Array.isArray(history.attachments) && history.attachments.length > 0 && (
              <div className="content-block attachments">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                  <button
                    onClick={handleDownloadAll}
                    className="task-timeline-downloadall-btn"
                  >
                    Download All
                  </button>
                </div>
                <div className="attachment-list">
                  {history.attachments.map((img: string, index: number) => (
                    <div
                      key={index}
                      className="attachment-image-wrapper"
                      onClick={() => setOpenImage(img)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Image
                        src={img}
                        alt={`Attachment ${index}`}
                        className="attachment-image"
                        width={200}
                        height={200}
                      />
                    </div>
                  ))}
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
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>📅 Task Working Timeline</h2>
        <div className="new-task-action">
          <button
            type='button'
            className="buttons"
            onClick={() => setShowSubmitTask(prev => !prev)}
          >
            {showSubmitTask ? 'Cancel' : 'Create'}
          </button>
          <button onClick={() => setShowReminderForm((prev) => !prev)}>
            {reminderData?.reminder ? '✏️ Edit Reminder' : '⏰ Set Reminder'}
          </button>
        </div>
      </div>

      {showReminderForm && (
        <div className="reminder-form" onClick={() => setShowReminderForm(false)}>
          <div className="reminder-content" onClick={(e) => e.stopPropagation()}>
            <h4>{reminderData?.reminder ? 'Update Reminder' : 'Set Reminder'}</h4>

            <label
              onClick={() => reminderInputRef.current?.focus()}
              style={{ cursor: 'pointer', display: 'block', marginBottom: '1rem' }}
            >
              Reminder At:
              <input
                type="datetime-local"
                value={reminderAt}
                onChange={(e) => setReminderAt(e.target.value)}
                ref={reminderInputRef}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </label>

            <label
              onClick={() => endDateInputRef.current?.focus()}
              style={{ cursor: 'pointer', display: 'block', marginBottom: '1rem' }}
            >
              End Date:
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                ref={endDateInputRef}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </label>

            <button type="button" onClick={handleReminderSubmit}>Submit</button>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="timeline-loading">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="timeline-item skeleton-item">
              <div className="timeline-left">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={60} height={20} style={{ marginTop: 8 }} />
              </div>
              <div className="timeline-content">
                <Skeleton width={80} height={20} />
                <Skeleton count={2} height={16} style={{ marginTop: 8 }} />
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <Skeleton width={200} height={100} />
                  <Skeleton width={200} height={100} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="error">Error loading task timeline</p>
      ) : histories.length > 0 ? (
        histories.map(renderTimelineItem)
      ) : (
        <div className="submit-new-task" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#999' }}>🚫 No timeline history available yet.</p>
        </div>
      )}

      {showSubmitTask &&
        <div className='timeline-submit-task-wrapper' onClick={() => setShowSubmitTask(false)}>
          <div className="timeline-submit-task-inner" onClick={(e) => e.stopPropagation()}>
            <SubmitTaskComponent onTaskSubmit={handleSubmitTaskComplete} taskId={Number(id)} />
          </div>
        </div>
      }

      <div className="action-buttons">
        <button type='button' className="button outline cancel-btn" onClick={() => router.push(`/${companySlug}/tasks/task-timeline`)}>Cancel</button>
        <ConfirmDialog
          isOpen={showConfirm}
          message="Are you sure you want to end this Task?"
          onConfirm={handleEndTask}
          onCancel={() => setShowConfirm(false)}
          type="end"
        />
        <button
          type='button'
          className="button primary"
          onClick={() => setShowConfirm(true)}
          disabled={isEnding}
        >
          {isEnding ? 'Ending Task...' : 'End Task'}
        </button>
      </div>
    </div>
  );
};

export default ViewTimeline;
