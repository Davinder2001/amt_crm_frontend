'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDeleteItemBatchMutation, useDeleteStoreItemMutation, useFetchStoreItemQuery } from '@/slices';
import { useCompany } from '@/utils/Company';
import { FaEdit, FaTrash, FaPen, FaTimes, FaPlus, FaEye } from 'react-icons/fa';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import TableToolbar from '@/components/common/TableToolbar';

const ViewItem = () => {
  const { id } = useParams();
  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [deleteBatch] = useDeleteItemBatchMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<number | null>(null);
  const router = useRouter();
  const { companySlug } = useCompany();

  const handleDelete = async () => {
    try {
      await deleteStoreItem(Number(id)).unwrap();
      setShowConfirm(false);
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleBatchDelete = (batchId: number) => {
    setBatchToDelete(batchId);
    setShowBatchConfirm(true);
  };
  const handleConfirmBatchDelete = async () => {
    if (batchToDelete) {
      try {
        // Assuming you have a delete batch mutation
        await deleteBatch(batchToDelete).unwrap();
        setShowBatchConfirm(false);
        setBatchToDelete(null);
        // Optionally, refetch the item or update state to reflect deletion
      } catch (err) {
        console.error('Error deleting batch:', err);
      }
    }
  };

  if (isLoading) return <LoadingState />;
  if (error)
    return (
      <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to fetching item."
        message="Something went wrong while fetching item."
      />
    );
  if (!item) return <div className="error">Item not found.</div>;

  const batches = Array.isArray(item.batches) ? item.batches : [];

  return (
    <div className="item-view">
      <TableToolbar

        actions={[

          {
            label: 'Edit Item',
            icon: <FaEdit />,
            onClick: () => router.push(`/${companySlug}/store/edit-item/${item.id}`),
          },
          {
            label: 'Delete Item',
            icon: <FaTrash />,
            onClick: () => setShowConfirm(true),
          },
          {
            label: 'Add Stock',
            icon: <FaPlus />,
            onClick: () => router.push(`/${companySlug}/store/add-stock/${item.id}`),
          },
        ]}
        introKey="view-item-toolbar" // optional for mobile guide popup
      />

      <div className="item-details">
        <div className="item-main">
          <div className="item-details-section">
            <h1>{item.name}</h1>
            <div className="item-meta">
              <span className="item-code">Code: {item.item_code}</span>
              <span className="item-stock">Stock: {item.availability_stock}</span>
            </div>

            {item.categories?.length > 0 && (
              <div className="item-categories">
                Categories: <div className='item-categories-inner'>
                  {item.categories.map((cat, i) => (
                    <span key={cat.id} className="category-tag">
                      {cat.name}{i < item.categories.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="item-media-section">
            {(item.featured_image || item.images?.length > 0) && (
              <div className="media-header">
                <FiImage className="media-icon" />
                <h3>Media</h3>
              </div>
            )}

            <div className="item-media">
              {item.featured_image && (
                <div className='featured-image'>
                  <Image
                    src={item.featured_image}
                    alt="Featured"
                    width={1000}
                    height={1000}
                  />
                  <span className="image-label">Featured</span>
                </div>
              )}

              {item.images?.length > 0 && (
                <>
                  {item.images.map((img, index) => {
                    const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
                    return (
                      <Image
                        key={index}
                        src={imgSrc}
                        alt={`Gallery ${index + 1}`}
                        width={1000}
                        height={1000}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        {batches.length > 0 && (
          <div className="item-batches">
            <h2>Batch Information</h2>
            <div className="batch-grid">
              {batches.map((batch, index) => (
                <div key={batch.id || index} className="batch-card">
                  <div className="batch-header">
                    <span className="batch-number">{batch.batch_number || `Batch ${index + 1}`}</span>
                    <span className="batch-quantity">{batch.quantity} units</span>
                    <div className="batch-actions">
                      <Link
                        href={`/${companySlug}/store/view-stock/${item.id}?batchId=${batch.id}`}
                        className="batch-view-btn"
                        title="View this batch"
                      >
                        <FaEye size={12} />
                      </Link>
                      <Link
                        href={`/${companySlug}/store/edit-stock/${item.id}?batchId=${batch.id}`}
                        className="batch-edit-btn"
                        title="Edit this batch"
                      >
                        <FaPen size={12} />
                      </Link>
                      <button
                        onClick={() => handleBatchDelete(batch.id)}
                        className="batch-delete-btn"
                        title="Delete this batch"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="batch-details">

                    <div className="batch-row">
                      <span>Quantity:</span>
                      <span>{batch.quantity || '-'}</span>
                    </div>
                    <div className="batch-row">
                      <span>Stock:</span>
                      <span>{batch.stock || '-'}</span>
                    </div>

                    {batch.date_of_manufacture && (
                      <div className="batch-row">
                        <span>Manufactured:</span>
                        <span>{batch.date_of_manufacture}</span>
                      </div>
                    )}
                    {batch.date_of_expiry && (
                      <div className="batch-row">
                        <span>Expires:</span>
                        <span className={new Date(batch.date_of_expiry) < new Date() ? 'expired' : ''}>
                          {batch.date_of_expiry}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        type="delete"
      />
      <ConfirmDialog
        isOpen={showBatchConfirm}
        message="Are you sure you want to delete this batch?"
        onConfirm={handleConfirmBatchDelete}
        onCancel={() => setShowBatchConfirm(false)}
        type="delete"
      />

    </div>
  );
};

export default ViewItem;