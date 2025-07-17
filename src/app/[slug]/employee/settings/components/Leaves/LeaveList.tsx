'use client';

import React, { useState } from 'react';
import {
  useFetchLeavesQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} from '@/slices';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import LeaveForm from './LeaveForm';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaUmbrellaBeach } from 'react-icons/fa';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import LoadingState from '@/components/common/LoadingState';
import { FaTriangleExclamation } from 'react-icons/fa6';

const LeaveList = () => {
  const { data, isLoading, error, refetch } = useFetchLeavesQuery();
  const [createLeave] = useCreateLeaveMutation();
  const [updateLeave] = useUpdateLeaveMutation();
  const [deleteLeave] = useDeleteLeaveMutation();

  const [showForm, setShowForm] = useState(false);
  const [editLeave, setEditLeave] = useState<Leave | null>(null);
  const [deleteState, setDeleteState] = useState<{
    id: number | null;
    name: string;
    showDialog: boolean;
  }>({
    id: null,
    name: "",
    showDialog: false
  });

  const leaves = data?.data ?? [];
  const noLeaves = !isLoading && !error && leaves.length === 0;

  const openAddModal = () => {
    setEditLeave(null);
    setShowForm(true);
  };

  const openEditModal = (leave: Leave) => {
    setEditLeave(leave);
    setShowForm(true);
  };

  const closeModal = () => {
    setEditLeave(null);
    setShowForm(false);
  };

  const handleCreate = async (leave: CreateLeavePayload) => {
    try {
      await createLeave(leave).unwrap();
      toast.success('Leave created successfully');
      closeModal();
      refetch();
    } catch (err) {
      toast.error('Failed to create leave');
      console.error('Create leave failed:', err);
    }
  };

  const handleUpdate = async (leave: Omit<UpdateLeavePayload, 'id'>) => {
    if (!editLeave) return;
    try {
      await updateLeave({ ...leave, id: editLeave.id }).unwrap();
      toast.success('Leave updated successfully');
      closeModal();
      refetch();
    } catch (err) {
      toast.error('Failed to update leave');
      console.error('Update leave failed:', err);
    }
  };

  const promptDelete = (id: number, name: string) => {
    setDeleteState({
      id,
      name,
      showDialog: true
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLeave(id).unwrap();
      toast.success('Leave deleted successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to delete leave');
      console.error('Delete leave failed:', err);
    }
  };

  const confirmDelete = async () => {
    if (deleteState.id) {
      await handleDelete(deleteState.id);
      setDeleteState({
        id: null,
        name: "",
        showDialog: false
      });
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
            onClick={() => openEditModal(leave)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => promptDelete(leave.id, leave.name)}
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
          <button onClick={openAddModal} className="buttons" disabled={showForm} type="button">
            <FaPlus /> Add Leave
          </button>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={editLeave ? 'Edit Leave' : 'Add Leave'}
      >
        <LeaveForm
          onSubmit={editLeave ? handleUpdate : handleCreate}
          onCancel={closeModal}
          initialData={editLeave || undefined}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteState.showDialog}
        message={`Are you sure you want to delete the leave "${deleteState.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteState({
          id: null,
          name: "",
          showDialog: false
        })}
        type="delete"
      />

      {isLoading && <LoadingState />}

      {error && (
        <EmptyState
          icon={<FaTriangleExclamation className='empty-state-icon' />}
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
            <button className="buttons" onClick={openAddModal} type="button">
              <FaPlus /> Add Leave
            </button>
          }
        />
      )}

      {leaves.length > 0 && (
        <ResponsiveTable
          data={leaves}
          columns={columns}
          onEdit={(id) => {
            const leave = leaves.find(l => l.id === id);
            if (leave) openEditModal(leave);
          }}
          onDelete={handleDelete}
          cardView={(leave: Leave) => (
            <>
              <div className="card-row">
                <h5>{leave.name}</h5>
                <p className="leave-type">Type: {leave.type}</p>
              </div>
              <div className="card-row">
                <p>Frequency: {leave.frequency}</p>
                <p>Count: {leave.count}</p>
              </div>
            </>
          )}
        />
      )}
    </div>
  );
};

export default LeaveList;