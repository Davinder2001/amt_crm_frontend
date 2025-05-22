'use client';
import React, { useState } from 'react';
import { useCreateQuotationMutation } from '@/slices/quotation/quotationApi';

const Page = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [taxPercent, setTaxPercent] = useState(0);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [items, setItems] = useState<{ name: string; quantity: number; price: number }[]>([{ name: '', quantity: 1, price: 0 }]);

  const [createQuotation, { isLoading, isSuccess }] = useCreateQuotationMutation();

  const handleItemChange = (index: number, field: 'name' | 'quantity' | 'price', value: string | number) => {
    const updatedItems = [...items];
    if (field === 'name') updatedItems[index].name = value as string;
    if (field === 'quantity') updatedItems[index].quantity = Number(value);
    if (field === 'price') updatedItems[index].price = Number(value);
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

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount + serviceCharges;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerNumber || items.length === 0) return;

    await createQuotation({
      customer_name: customerName,
      customer_number: customerNumber,
      customer_email: customerEmail || null,
      tax_percent: taxPercent,
      tax_amount: taxAmount,
      service_charges: serviceCharges,
      total,
      items,
    });

    setCustomerName('');
    setCustomerNumber('');
    setCustomerEmail('');
    setTaxPercent(0);
    setServiceCharges(0);
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

        <div>
          <label className="block font-semibold">Customer Number:</label>
          <input
            type="text"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Customer Email (optional):</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full border rounded px-2 py-1"
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
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 text-sm col-span-3 text-right"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddItem} className="text-blue-600 text-sm">
          + Add Another Item
        </button>

        <div>
          <label className="block font-semibold">Tax (%)</label>
          <input
            type="number"
            value={taxPercent}
            onChange={(e) => setTaxPercent(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block font-semibold">Service Charges</label>
          <input
            type="number"
            value={serviceCharges}
            onChange={(e) => setServiceCharges(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="text-right font-semibold">
          Subtotal: ₹{subtotal.toFixed(2)} <br />
          Tax: ₹{taxAmount.toFixed(2)} <br />
          Service Charges: ₹{serviceCharges.toFixed(2)} <br />
          <strong>Total: ₹{total.toFixed(2)}</strong>
        </div>

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
