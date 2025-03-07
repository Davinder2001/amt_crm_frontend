'use client';

import React, { useState, useEffect } from 'react';
import { 
  useFetchStoreQuery, 
  useOcrProcessMutation, 
  useCreateStoreItemMutation, 
  useDeleteStoreItemMutation 
} from '@/slices/store/storeApi';
import { toast } from 'react-toastify';

const Page = () => {
  // Fetch store data & trigger refetch
  const { data: storeData, error, isLoading, refetch } = useFetchStoreQuery();
  const storeItems = storeData?.data ?? [];

  // API Mutations
  const [createStoreItem] = useCreateStoreItemMutation();
  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [processOcr, { isLoading: isOcrProcessing }] = useOcrProcessMutation();

  // OCR Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Trigger refetch when any mutation is successful
  useEffect(() => {
    refetch();
  }, [storeData]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle Delete Item (Show Name in Toast)
  const handleDelete = async (id: number, name: string) => {
    try {
      await deleteStoreItem(id).unwrap();
      refetch();
      toast.success(`"${name}" deleted successfully!`);
    } catch (err) {
      console.error("Failed to delete item:", err);
      toast.error("Failed to delete item.");
    }
  };

  // Handle Image Upload for OCR
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await processOcr(formData).unwrap();
      toast.success(response.message); 
      refetch();
    } catch (err) {
      console.error("OCR processing failed:", err);
      toast.error("OCR processing failed.");
    }
  };

  return (
    <div>
      <h1>Store Inventory & OCR</h1>

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile || isOcrProcessing}>
          {isOcrProcessing ? "Processing..." : "Upload"}
        </button>
      </div>


      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching store data.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storeItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.sr_no}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>
                    <button onClick={() => handleDelete(item.id, item.name)}>Delete</button> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
