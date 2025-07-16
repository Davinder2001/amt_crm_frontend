'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchVendorByIdQuery, useDeleteVendorMutation } from '@/slices';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const vendorId = Number(params?.id);
  const { companySlug } = useCompany();

  const { data: vendor, isLoading, error } = useFetchVendorByIdQuery(vendorId);

  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

  // 🔧 Fix: Add state for confirm dialog
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteVendor(vendorId).unwrap();
      router.push(`/${companySlug}/employee/store/vendors`);
    } catch (err) {
      alert('Failed to delete vendor.');
      console.error(err);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error)
    return (
      <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to fetching vendor details."
        message="Something went wrong while fetching vendor details."
      />
    );
  if (!vendor) return <p className="empty-text">Vendor not found.</p>;

  return (
    <div className="vendor-details-outer">
      <div className="vendor-details-page">
        <div className="vendor-card">
          <div className="vendor-header">
            <h1 className="vendor-title"> Vendor Details </h1>
            <div className='view-vendor-action-button-outter'>
              <button
                className="edit-button"
                onClick={() => router.push(`/${companySlug}/employee/store/vendors/edit/${vendor.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FaEdit />
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
              >
                <FaTrash style={{ marginRight: '0px' }} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          <div className="vendor-info">
            <p><strong>ID:</strong>  {vendor.id}</p>
            <p><strong>Name:</strong>  {vendor.name}</p>
            <p><strong>Email:</strong>  {vendor.email}</p>
            <p><strong>Address:</strong>  {vendor.address}</p>
            <p><strong>Number:</strong>  {vendor.number}</p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this vendor?"
        onConfirm={() => {
          handleDelete();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
        type="delete"
      />
    </div>
  );
};

export default Page;
