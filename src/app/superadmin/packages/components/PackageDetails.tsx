'use client';
import React, { useEffect, useState } from 'react';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaPlus, FaEdit, FaTrash, FaList } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import LoadingState from '@/components/common/LoadingState';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import {
  useFetchPackageDetailsQuery,
  useCreatePackageDetailMutation,
  useUpdatePackageDetailMutation,
  useDeletePackageDetailMutation
} from '@/slices/superadminSlices/package-details/packageDetailsApi';

type PackageDetail = {
  id?: number;
  name: string;
};

const PackageDetailForm = ({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: PackageDetail;
  onSubmit: (values: PackageDetail) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter package detail name"
          className="form-control"
        />
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', alignItems: 'center' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="buttons"
        >
          {isSubmitting ? 'Processing...' : initialData ? 'Update' : 'Add'} Package Detail
        </button>
      </div>
    </form>
  );
};

const PackageDetails = () => {
  const { setTitle } = useBreadcrumb();
  const { data: packageDetails, error, isLoading, refetch } = useFetchPackageDetailsQuery();
  const [createPackageDetail] = useCreatePackageDetailMutation();
  const [updatePackageDetail] = useUpdatePackageDetailMutation();
  const [deletePackageDetail] = useDeletePackageDetailMutation();

  const [deleteState, setDeleteState] = useState<{
    id: number | null;
    showDialog: boolean;
  }>({
    id: null,
    showDialog: false
  });
  const [showForm, setShowForm] = useState(false);
  const [editPackageDetail, setEditPackageDetail] = useState<PackageDetail | null>(null);

  useEffect(() => {
    setTitle('Package Details');
  }, [setTitle]);

  const openAddModal = () => {
    setEditPackageDetail(null);
    setShowForm(true);
  };

  const openEditModal = (packageDetail: PackageDetail) => {
    setEditPackageDetail(packageDetail);
    setShowForm(true);
  };

  const closeModal = () => {
    setEditPackageDetail(null);
    setShowForm(false);
  };

  const handleCreate = async (packageDetail: PackageDetail) => {
    try {
      await createPackageDetail(packageDetail).unwrap();
      toast.success('Package detail added successfully');
      closeModal();
      refetch();
    } catch (e) {
      toast.error('Failed to add package detail');
      console.error('Failed to add package detail', e);
    }
  };

  const handleUpdate = async (updated: PackageDetail) => {
    if (!editPackageDetail?.id) return;
    try {
      await updatePackageDetail({ id: editPackageDetail.id, ...updated }).unwrap();
      toast.success('Package detail updated successfully');
      closeModal();
      refetch();
    } catch (e) {
      toast.error('Failed to update package detail');
      console.error('Update failed', e);
    }
  };

  const promptDelete = (id: number) => {
    setDeleteState({
      id,
      showDialog: true
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePackageDetail(String(id)).unwrap();
      toast.success('Package detail deleted successfully');
      refetch();
    } catch (error) {
      console.error("Failed to delete package detail:", error);
      toast.error('Failed to delete package detail');
    }
  };

  const confirmDelete = async () => {
    if (deleteState.id) {
      await handleDelete(deleteState.id);
      setDeleteState({
        id: null,
        showDialog: false
      });
    }
  };

  const noPackageDetails = !isLoading && !error && (!packageDetails || packageDetails.length === 0);

  const columns = [
    {
      label: 'Name',
      key: 'name' as keyof PackageDetail,
      render: (detail: PackageDetail) => (
        <span className='package-name'>{detail.name}</span>
      )
    },
    {
      label: 'Actions',
      render: (detail: PackageDetail) => (
        <div className="action-buttons">
          <button
            type="button"
            className="icon-button edit-button"
            onClick={() => openEditModal(detail)}
            title="Edit"
            style={{ marginRight: 8 }}
          >
            <FaEdit />
          </button>
          <button
            type="button"
            className="icon-button delete-button"
            onClick={() => detail.id && promptDelete(detail.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="package-details-container">
      {!noPackageDetails && (
        <div className="add-package-btn-outer" style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button onClick={openAddModal} className="buttons" disabled={showForm} type="button">
            <FaPlus /> Add Package Detail
          </button>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={editPackageDetail ? 'Edit Package Detail' : 'Add Package Detail'}
        width="600px"
      >
        <PackageDetailForm
          initialData={editPackageDetail || undefined}
          onSubmit={editPackageDetail ? handleUpdate : handleCreate}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteState.showDialog}
        message="Are you sure you want to delete this package detail?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteState({
            id: null,
            showDialog: false
          });
        }}
        type="delete"
      />

      {isLoading && <LoadingState />}

      {error && (
        <EmptyState
          icon="alert"
          title="Failed to load package details"
          message="Something went wrong while fetching package details. Please try again later."
        />
      )}

      {noPackageDetails && !showForm && (
        <EmptyState
          icon={<FaList className="empty-state-icon" />}
          title="No Package Details Found"
          message="You haven't added any package details yet."
          action={
            <button
              className="buttons"
              onClick={openAddModal}
              type="button"
            >
              <FaPlus /> Add Package Detail
            </button>
          }
        />
      )}

      {packageDetails && packageDetails.length > 0 && (
        <ResponsiveTable
          data={packageDetails.filter((detail): detail is PackageDetail & { id: number } => !!detail.id)}
          columns={columns}
          onEdit={(id) => {
            const packageDetail = packageDetails.find(p => p.id === id);
            if (packageDetail) openEditModal(packageDetail);
          }}
          onDelete={handleDelete}
          cardView={(detail: PackageDetail) => (
            <>
              <div className="card-row">
                <h5>{detail.name}</h5>
              </div>
            </>
          )}
        />
      )}
    </div>
  );
};

export default PackageDetails;