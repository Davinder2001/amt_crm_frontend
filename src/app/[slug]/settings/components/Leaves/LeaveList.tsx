'use client';

import React, { useState } from 'react';
import {
  useFetchLeavesQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} from '@/slices/company/companyApi';

import ResponsiveTable from '@/components/common/ResponsiveTable';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import LeaveForm from './LeaveForm';

import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { FaPlus, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';

const LeaveList = () => {
  const { data, isLoading, error, refetch } = useFetchLeavesQuery();
  const [createLeave] = useCreateLeaveMutation();
  const [updateLeave] = useUpdateLeaveMutation();
  const [deleteLeave] = useDeleteLeaveMutation();

  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState<Leave | null>(null);

  const leaves = data?.data ?? [];
  const noLeaves = !isLoading && !error && leaves.length === 0;

  const handleCreate = async (leave: CreateLeavePayload) => {
    try {
      await createLeave(leave).unwrap();
      toast.success('Leave created successfully');
      setShowForm(false);
      refetch();
    } catch {
      toast.error('Failed to create leave');
    }
  };

  const handleUpdate = async (leave: LeavePayload) => {
    if (!editLeave) return;
    try {
      await updateLeave({ id: editLeave.id, ...leave }).unwrap();
      toast.success('Leave updated successfully');
      setEditLeave(null);
      refetch();
    } catch {
      toast.error('Failed to update leave');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this leave?')) return;
    try {
      await deleteLeave(id).unwrap();
      toast.success('Leave deleted successfully');
      refetch();
    } catch {
      toast.error('Failed to delete leave');
    }
  };

  const columns = [
    { label: 'Name', key: 'name' as keyof Leave },
    { label: 'Type', key: 'type' as keyof Leave },
    { label: 'Frequency', key: 'frequency' as keyof Leave },
    { label: 'Count', key: 'count' as keyof Leave },
    {
      label: 'Actions',
      render: (leave: Leave) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => setEditLeave(leave)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDelete(leave.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="leave-list">
      {!noLeaves && (
        <div className="add-leave-btn">
          <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm}>
            Add Leave
          </button>
        </div>
      )}

      <Modal
        isOpen={showForm || editLeave !== null}
        onClose={() => {
          setShowForm(false);
          setEditLeave(null);
        }}
        title={showForm ? 'Add Leave' : 'Edit Leave'}
      >
        <LeaveForm
          onSubmit={showForm ? handleCreate : handleUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditLeave(null);
          }}
          initialData={editLeave || undefined}
        />
      </Modal>

      {isLoading && <p>Loading leaves...</p>}

      {error && (
        <EmptyState
          icon="alert"
          title="Failed to load leaves"
          message="Something went wrong while fetching leaves."
        />
      )}

      {noLeaves && !showForm && (
        <EmptyState
          icon={<FaCalendar className="empty-state-icon" />}
          title="No Leaves Found"
          message="You haven't added any leave policies yet."
          action={
            <Button className="buttons" onClick={() => setShowForm(true)} startIcon={<FaPlus />}>
              Add Leave
            </Button>
          }
        />
      )}

      {leaves.length > 0 && (
        <ResponsiveTable data={leaves} columns={columns} />
      )}
    </div>
  );
};

export default LeaveList;
