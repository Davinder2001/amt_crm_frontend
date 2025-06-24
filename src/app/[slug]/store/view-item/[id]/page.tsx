'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDeleteItemBatchMutation, useDeleteStoreItemMutation, useFetchStoreItemQuery } from '@/slices/store/storeApi';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft, FaEdit, FaTrash, FaPen, FaTimes } from 'react-icons/fa';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Image from 'next/image';
import { FiImage, FiX } from 'react-icons/fi';

const ViewItem = () => {
  const { id } = useParams();
  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [deleteBatch] = useDeleteItemBatchMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  if (isLoading) return <div className="loading">Loading item...</div>;
  if (error) return <div className="error">Error loading item.</div>;
  if (!item) return <div className="error">Item not found.</div>;

  const batches = Array.isArray(item.batches) ? item.batches : [];

  return (
    <div className="item-view">
      <div className="item-header">
        <Link href={`/${companySlug}/store`} className="back-btn">
          <FaArrowLeft /> Back to Items
        </Link>
        <div className="item-actions">
          <Link href={`/${companySlug}/store/edit-item/${item.id}`} className="edit-btn">
            <FaEdit /> Edit Item
          </Link>
          <button onClick={() => setShowConfirm(true)} className="delete-btn">
            <FaTrash /> Delete Item
          </button>
        </div>
      </div>

      <div className="item-details">
        <div className="item-main">
          <h1>{item.name}</h1>
          <div className="item-meta">
            <span className="item-code">Code: {item.item_code}</span>
            <span className="item-stock">Stock: {item.availability_stock}</span>
          </div>

          {item.categories?.length > 0 && (
            <div className="item-categories">
              Categories: {item.categories.map((cat, i) => (
                <span key={cat.id} className="category-tag">
                  {cat.name}{i < item.categories.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          )}
          <div className="item-media-section">
            {(item.featured_image || item.images?.length > 0) && (
              <div className="media-header">
                <FiImage className="media-icon" />
                <h3>Media</h3>
              </div>
            )}

            <div className="item-media">
              {item.featured_image && (
                <div className="featured-image">
                  <Image
                    src={item.featured_image}
                    alt="Featured"
                    width={280}
                    height={180}
                    onClick={() => setSelectedImage(item.featured_image)}
                  />
                  <span className="image-label">Featured</span>
                </div>
              )}

              {item.images?.length > 0 && (
                <div className="image-gallery">
                  {item.images.map((img, index) => {
                    const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
                    return (
                      <div key={index} className="gallery-thumbnail">
                        <Image
                          src={imgSrc}
                          alt={`Gallery ${index + 1}`}
                          width={120}
                          height={120}
                          onClick={() => setSelectedImage(imgSrc)}
                          unoptimized={typeof img !== 'string'}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedImage && (
              <div className="image-preview-modal" onClick={() => setSelectedImage(null)}>
                <button className="close-modal" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}>
                  <FiX />
                </button>
                <Image
                  src={selectedImage}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
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
                      <span>Added:</span>
                      <span>{batch.created_at || '-'}</span>
                    </div>
                    {batch.purchase_price && (
                      <div className="batch-row">
                        <span>Price:</span>
                        <span>${batch.purchase_price}</span>
                      </div>
                    )}
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
      <style>{`
      .item-view {
        min-height: 100vh;
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 10px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 5px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .back-btn, .edit-btn, .delete-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 8px 10px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        cursor: pointer;
      }

      .back-btn {
        color: #64748b;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(100, 116, 139, 0.2);
      }

      .back-btn:hover {
        background: rgba(100, 116, 139, 0.1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(100, 116, 139, 0.15);
      }
        .item-actions{
        display: flex;
        gap: 0.5rem;
        }

      .edit-btn {
        color: white;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .edit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
      }

      .delete-btn {
        color: white;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .delete-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
      }

      .item-details {
        margin-top: 10px;
      }

      .item-main {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 5px;
        padding: 10px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 2rem;
      }

      .item-main h1 {
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #1e293b;
        background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .item-meta {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }

      .item-code, .item-stock {
        padding: 0.5rem 1rem;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        color: #1e40af;
        border: 1px solid rgba(59, 130, 246, 0.2);
      }

      .item-stock {
        background: rgba(34, 197, 94, 0.1);
        color: #15803d;
        border-color: rgba(34, 197, 94, 0.2);
      }

      .item-categories {
        margin-bottom: 2rem;
        font-size: 0.95rem;
        color: #64748b;
      }

      .category-tag {
        margin-left: 0.5rem;
        color: #3b82f6;
        font-weight: 500;
        padding: 0.25rem 0.75rem;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 6px;
        border: 1px solid rgba(59, 130, 246, 0.2);
      }

      .item-batches {
        margin-top: 2rem;
      }

      .item-batches h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #1e293b;
        padding-bottom: 1rem;
        border-bottom: 2px solid rgba(59, 130, 246, 0.1);
        position: relative;
      }

      .item-batches h2::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border-radius: 1px;
      }

      .batch-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .batch-card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .batch-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      }

      .batch-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        border-color: rgba(59, 130, 246, 0.2);
      }

      .batch-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        position: relative;
      }

      .batch-actions {
        display: flex;
        gap: 0.5rem;
      }

      .batch-edit-btn, .batch-delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .batch-edit-btn {
        color: #3b82f6;
      }

      .batch-edit-btn:hover {
        background: rgba(59, 130, 246, 0.1);
        transform: scale(1.1);
      }

      .batch-delete-btn {
        color: #ef4444;
      }

      .batch-delete-btn:hover {
        background: rgba(239, 68, 68, 0.1);
        transform: scale(1.1);
      }

      .batch-number {
        font-weight: 600;
        color: #1e293b;
        font-size: 1.1rem;
      }

      .batch-quantity {
        color: #3b82f6;
        font-weight: 600;
        padding: 0.25rem 0.75rem;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 6px;
        font-size: 0.85rem;
      }

      .batch-details {
        font-size: 0.9rem;
      }

      .batch-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(226, 232, 240, 0.5);
      }

      .batch-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .batch-row span:first-child {
        color: #64748b;
        font-weight: 500;
      }

      .batch-row span:last-child {
        color: #1e293b;
        font-weight: 600;
      }

      .expired {
        color: #ef4444 !important;
        font-weight: 600;
        background: rgba(239, 68, 68, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }

      .loading, .error {
        padding: 3rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .loading {
        color: #3b82f6;
        font-weight: 500;
      }

      .error {
        color: #ef4444;
        font-weight: 500;
      }

      .item-media-section {
        margin: 2rem 0;
        border-top: 1px solid rgba(226, 232, 240, 0.8);
        padding-top: 2rem;
      }

      .media-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        color: #475569;
      }

      .media-header h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0;
        color: #1e293b;
      }
        .item-media {
          display: flex;
          align-items: center;  
          gap: 20px;
        }

      .media-icon {
        color: #3b82f6;
        font-size: 1.2rem;
      }

      .featured-image {
        position: relative;
        margin-bottom: 1.5rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        overflow: hidden;
        max-width: 320px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .featured-image:hover {
        transform: scale(1.02);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
      }

      .featured-image img {
        width: 100%;
        height: auto;
        display: block;
        cursor: pointer;
      }

      .image-label {
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
        color: white;
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        font-weight: 500;
        backdrop-filter: blur(10px);
      }

      .image-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
      }

      .gallery-thumbnail {
        width: 80px;
        height: 80px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .gallery-thumbnail:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border-color: rgba(59, 130, 246, 0.3);
      }

      .gallery-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999999999;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .image-preview-modal > div {
        position: relative;
        width: 90%;
        height: 90%;
        max-width: 900px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .close-modal {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border: none;
        color: white;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99999999999;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        transition: all 0.3s ease;
      }

      .close-modal:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
      }

      @media (max-width: 768px) {
        .item-view {
          padding: 1rem;
        }
        
        .item-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
        }
        
        .item-actions {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        .item-main {
          padding: 1.5rem;
        }

        .item-main h1 {
          font-size: 1.75rem;
        }

        .item-meta {
          flex-direction: column;
          gap: 0.75rem;
        }

        .batch-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .featured-image {
          max-width: 100%;
        }
        
        .gallery-thumbnail {
          width: 60px;
          height: 60px;
        }

        .close-modal {
          top: 1rem;
          right: 1rem;
          width: 2.5rem;
          height: 2.5rem;
        }
      }

      @media (max-width: 480px) {
        .back-btn, .edit-btn, .delete-btn {
          padding: 0.6rem 1rem;
          font-size: 0.85rem;
        }

        .item-main {
          padding: 1rem;
        }

        .batch-card {
          padding: 1rem;
        }
      }
      `}</style>
    </div>
  );
};

export default ViewItem;