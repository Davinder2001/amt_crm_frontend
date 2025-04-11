'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFetchStoreItemQuery } from '@/slices/store/storeApi';
import Image from 'next/image';

const ViewItem = () => {
  const { companySlug, id } = useParams();
  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));

  if (isLoading) return <p>Loading item...</p>;
  if (error) return <p>Error loading item.</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div className="p-4 space-y-4 bg-white shadow rounded">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {item.images && item.images.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Images</h2>
          <div className="flex flex-wrap gap-3">
            {item.images.map((img: File, index: number) => {
              const imgSrc = img instanceof File ? URL.createObjectURL(img) : img; // If it's a File, convert it to a URL
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
        <Link href={`/${companySlug}/employee/store/edit-item/${item.id}`}>
          <button className="buttons" >
            Edit Item
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ViewItem;
