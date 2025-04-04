'use client'
import React, { useState } from 'react';
import { useBulkCreateStoreItemMutation } from '@/slices/store/storeApi';

const Page = () => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorNo, setVendorNo] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '', subTotal: '' });
  const [image, setImage] = useState(null);
  const [showItemFields, setShowItemFields] = useState(false);

  const [bulkCreateStoreItem, { isLoading }] = useBulkCreateStoreItemMutation();

  const handleAddItemToList = () => {
    if (!newItem.name || !newItem.price || !newItem.quantity || !newItem.subTotal) return;
    setItems([...items, newItem]);
    setNewItem({ name: '', price: '', quantity: '', subTotal: '' });
    setShowItemFields(false);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('invoice_no', invoiceNo);
    formData.append('vendor_name', vendorName);
    formData.append('vendor_no', vendorNo);
    formData.append('bill_photo', image);
    formData.append('items', JSON.stringify(items));

    try {
      const response = await bulkCreateStoreItem(formData).unwrap();
      console.log('Saved:', response);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input className="border p-2 rounded" placeholder="Invoice No" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Vendor Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Vendor No" value={vendorNo} onChange={(e) => setVendorNo(e.target.value)} />
      </div>

      <div className="flex gap-4 mb-4">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={() => setShowItemFields(true)} className="bg-teal-600 text-white px-4 py-2 rounded shadow">+ Add Items</button>
      </div>

      {showItemFields && (
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-4 mb-2">
            <input className="border p-2 rounded" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Sub Total" value={newItem.subTotal} onChange={(e) => setNewItem({ ...newItem, subTotal: e.target.value })} />
          </div>
          <button onClick={handleAddItemToList} className="bg-emerald-700 text-white px-4 py-2 rounded shadow">Add</button>
        </div>
      )}

      <table className="w-full border-t text-left">
        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Sub Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.price}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.subTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-4 mt-6">
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Cancel</button>
        <button onClick={handleSave} disabled={isLoading} className="bg-teal-700 text-white px-6 py-2 rounded shadow">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Page;
