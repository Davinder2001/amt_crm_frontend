'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';

const Page = () => {

  const { id, companySlug } = useParams() as { id: string; companySlug: string };
  const router = useRouter();

  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        quantity: item.quantity.toString()
      });
    }
  }, [item]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateStoreItem({
        id: Number(id),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10)
      }).unwrap();

      router.push(`/${companySlug}/store/view-item/${id}`);
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  if (isLoading) return <p>Loading item details...</p>;
  if (error) return <p>Error loading item details.</p>;

  return (
    <div>
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input 
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required 
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input 
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required 
          />
        </div>
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Item'}
        </button>
      </form>
    </div>
  );
};

export default Page;
