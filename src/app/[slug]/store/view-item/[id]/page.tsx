'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFetchStoreItemQuery } from '@/slices/store/storeApi';

const ViewItem = () => {

  const { companySlug, id } = useParams();
  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));

  if (isLoading) return <p>Loading item...</p>;
  if (error) return <p>Error loading item.</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div>
      <h1>View Item</h1>
      <p>
        <strong>Name:</strong> {item.name}
      </p>
      <p>
        <strong>Description:</strong> {item.description}
      </p>
      <p>
        <strong>Price:</strong> ${item.price}
      </p>
      <p>
        <strong>Quantity:</strong> {item.quantity}
      </p>
      <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
        <button>Edit Item</button>
      </Link>
    </div>
  );
};

export default ViewItem;
