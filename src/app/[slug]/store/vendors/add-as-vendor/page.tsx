'use client'
import React, { useState } from 'react';
import { useBulkCreateStoreItemMutation, useOcrProcessMutation } from '@/slices/store/storeApi';
import { toast } from 'react-toastify';

const Page = () => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorNo, setVendorNo] = useState('');
  const [items, setItems] = useState<{ name: string; price: string; quantity: string; subTotal: string }[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '', subTotal: '' });
  const [image, setImage] = useState<File | null>(null);
  const [showItemFields, setShowItemFields] = useState(false);

  const [bulkCreateStoreItem, { isLoading }] = useBulkCreateStoreItemMutation();
  const [ocrProcess] = useOcrProcessMutation();

  const handleAddItemToList = () => {
    if (!newItem.name || !newItem.price || !newItem.quantity || !newItem.subTotal) return;
    setItems([...items, newItem]);
    setNewItem({ name: '', price: '', quantity: '', subTotal: '' });
    setShowItemFields(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const ocrResponse = await ocrProcess(formData).unwrap();
        console.log('OCR Response:', ocrResponse);

        if (ocrResponse.products) {
          const parsedItems = ocrResponse.products.map((item) => ({
            name: item.name,
            price: item.price.toString(),
            quantity: item.quantity.toString(),
            subTotal: item.sub_total.toString(),
          }));
          setItems(parsedItems);
        }

        if (ocrResponse.message) {
          toast.success(ocrResponse.message);
        }
      } catch (error) {
        console.error('OCR process failed:', error);
        toast.error('OCR processing failed.');
      }
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('invoice_no', invoiceNo);
    formData.append('vendor_name', vendorName);
    formData.append('vendor_no', vendorNo);

    if (image) {
      formData.append('image', image);
    }

    formData.append('items', JSON.stringify(items));

    try {
      const response = await bulkCreateStoreItem(formData).unwrap();
      console.log('Saved:', response);
      toast.success('Items saved successfully.');
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Saving failed.');
    }
  };

  return (
    <div className='add-as-a-v-container'>
      <div className='add-as-a-v-inputs' >
        <input
          placeholder="Invoice No"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
        />
        <input
          placeholder="Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
        />
        <input
          placeholder="Vendor No"
          value={vendorNo}
          onChange={(e) => setVendorNo(e.target.value)}
        />
        
      </div>
        
      <div className='add-as-a-v-button'>
       <input className='add-as-a-v-image'
          type="file"
          onChange={handleImageUpload}
        /> 
        <button className='buttons' onClick={() => setShowItemFields(true)}>+ Add Items</button>
        
      </div>

      {showItemFields && (
        <div className='add-as-a-v-items-container'>
          <div className='add-as-a-v-items-inner'>
            <input
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
            <input
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
            <input
              placeholder="Sub Total"
              value={newItem.subTotal}
              onChange={(e) => setNewItem({ ...newItem, subTotal: e.target.value })}
            />
          </div>
          <button className='buttons' onClick={handleAddItemToList}>Add</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Sub Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.subTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='add-as-a-v-button'>
      
      <span className='buttons'>Cancel</span>
              <button className='buttons' onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Page;
