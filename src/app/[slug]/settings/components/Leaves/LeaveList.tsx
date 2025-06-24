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
import { FaPlus, FaEdit, FaTrash, FaUmbrellaBeach } from 'react-icons/fa';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const LeaveList = () => {
  const { data, isLoading, error, refetch } = useFetchLeavesQuery();
  const [createLeave] = useCreateLeaveMutation();
  const [updateLeave] = useUpdateLeaveMutation();
  const [deleteLeave] = useDeleteLeaveMutation();

  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState<Leave | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
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

  const handleUpdate = async (leave: Omit<UpdateLeavePayload, 'id'>) => {
    if (!editLeave) return;
    try {
      await updateLeave({ ...leave, id: editLeave.id }).unwrap();
      toast.success('Leave updated successfully');
      setEditLeave(null);
      refetch();
    } catch {
      toast.error('Failed to update leave');
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete !== null) {
      try {
        await deleteLeave(itemToDelete).unwrap();
      } catch (error) {
        console.error("Failed to delete this Leave:", error);
      } finally {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }
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
        <div className="add-holiday-leave-btn-wrapper">
          <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm}>
            <FaPlus /> Add Leave
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
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Are you sure you want to delete this Leave ?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
        type="delete"
      />
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
          icon={<FaUmbrellaBeach className="empty-state-icon" />}
          title="No Leaves Found"
          message="You haven't added any leave policies yet."
          action={
            <button className="buttons" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Leave
            </button>
          }
        />
      )}

      {leaves.length > 0 && (
        <ResponsiveTable data={leaves} columns={columns} cardViewKey='name' />
      )}
    </div>
  );
};

export default LeaveList;
