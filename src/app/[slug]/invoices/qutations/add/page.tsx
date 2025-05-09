'use client';
import React, { useState } from 'react';
import { useCreateQuotationMutation } from '@/slices/quotation/quotationApi';

const Page = () => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [createQuotation, { isLoading, isSuccess }] = useCreateQuotationMutation();

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index][field as keyof typeof updatedItems[0]] = field === 'name' ? value : Number(value);
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || items.length === 0) return;
    await createQuotation({ customer_name: customerName, items });
    setCustomerName('');
    setItems([{ name: '', quantity: 1, price: 0 }]);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Add Quotation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-semibold">Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-center">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              className="border px-2 py-1"
              required
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="border px-2 py-1"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              className="border px-2 py-1"
              required
            />
            {items.length > 1 && (
              <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-600 text-sm col-span-3 text-right">
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="text-blue-600 text-sm"
        >
          + Add Another Item
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Saving...' : 'Save Quotation'}
        </button>

        {isSuccess && <p className="text-green-600">Quotation saved successfully!</p>}
      </form>
    </div>
  );
};

export default Page;
