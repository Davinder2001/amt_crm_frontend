'use client'
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDeleteStoreItemMutation, useFetchStoreItemQuery } from '@/slices/store/storeApi';
import Image from 'next/image';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useCompany } from '@/utils/Company';

const ViewItem = () => {
  const { id } = useParams();
  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
  const [deleteStoreItem] = useDeleteStoreItemMutation();
  console.log('images', item?.images);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const {companySlug} = useCompany();

  const handleDelete = async () => {
    try {
      await deleteStoreItem(Number(id)).unwrap();
      setShowConfirm(false);
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (isLoading) return <p>Loading item...</p>;
  if (error) return <p>Error loading item.</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div className="view-item-container">

      <div className="view-item-inner-container">
        <p><strong>Item Code:</strong> {item.item_code}</p>
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Quantity Count:</strong> {item.quantity_count}</p>
        <p><strong>Availability Stock:</strong> {item.availability_stock}</p>
        <p><strong>Measurement:</strong> {item.measurement || '-'}</p>
        <p><strong>Purchase Date:</strong> {item.purchase_date || '-'}</p>
        <p><strong>Date of Manufacture:</strong> {item.date_of_manufacture || '-'}</p>
        <p><strong>Date of Expiry:</strong> {item.date_of_expiry || '-'}</p>
        <p><strong>Brand Name:</strong> {item.brand_name || '-'}</p>
        <p><strong>Replacement:</strong> {item.replacement || '-'}</p>
        <p><strong>Category:</strong> {item.category || '-'}</p>
        <p><strong>Vendor Name:</strong> {item.vendor_name || '-'}</p>
        <p><strong>Cost Price:</strong> {item.cost_price || '-'}</p>
        <p><strong>Selling Price:</strong> {item.selling_price || '-'}</p>
        <p><strong>Catalog:</strong> {item.catalog ? 'Yes' : 'No'}</p>
        <p><strong>Online Visibility:</strong> {item.online_visibility ? 'Yes' : 'No'}</p>
      </div>

      {Array.isArray(item.images) && item.images.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Images</h2>
          <div className="flex flex-wrap gap-3">
            {item.images.map((img: File | string, index: number) => {
              const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
              return (
                <Image
                  key={index}
                  src={imgSrc}
                  alt={`Item image ${index + 1}`}
                  className="single-item-images w-32 h-32 object-cover rounded border"
                  width={100}
                  height={100}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="buttons-container">
        <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
          <button className="buttons" >
            Edit Item
          </button>
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Item
        </button>
      </div>
      <ConfirmDialog
        isOpen={showConfirm}
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default ViewItem;
