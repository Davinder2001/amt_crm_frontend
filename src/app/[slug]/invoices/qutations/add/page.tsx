'use client';
import React, { useState } from 'react';
import { useCreateQuotationMutation } from '@/slices';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';

const Page = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [taxPercent, setTaxPercent] = useState(0);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [items, setItems] = useState<{ name: string; quantity: number; price: number }[]>([{ name: '', quantity: 1, price: 0 }]);
  const { companySlug } = useCompany();

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
  const [isTaxFocused, setIsTaxFocused,] = useState(false);
  const [isServiceFocused, setIsServiceFocused] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount + serviceCharges;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerNumber || items.length === 0) return;

    await createQuotation({
      customer_name: customerName,
      customer_number: customerNumber,
      customer_email: customerEmail || undefined,
      tax_percent: taxPercent,
      service_charges: serviceCharges,
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
    <div>
      <Link href={`/${companySlug}/invoices/qutations`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>
      <div className="quotation-form">
        <h3 className="form-title">Add Quotation</h3>
        <form onSubmit={handleSubmit} className="form-body">
          <div className='quotation-form-wrapper'>
            <div className="form-group">
              <label>Customer Name:</label>
              <input placeholder='Name' type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div className="form-group ">
              <label>Customer Number:</label>
              <input
                placeholder='Number'
                type="text"
                value={customerNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setCustomerNumber(value);
                  }
                }}
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>
            <div className="form-group">
              <label>Customer Email (optional):</label>
              <input placeholder='Email' type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tax (%)</label>
              <input
                placeholder='tax'
                type="number"
                value={isTaxFocused && taxPercent === 0 ? '' : taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                onFocus={() => setIsTaxFocused(true)}
                onBlur={() => setIsTaxFocused(false)}
              />

            </div>
            <div className="form-group">
              <label>Service Charges</label>
              <input
                placeholder='Service Sharges'
                type="number"
                value={isServiceFocused && serviceCharges === 0 ? '' : serviceCharges}
                onChange={(e) => setServiceCharges(Number(e.target.value))}
                onFocus={() => setIsServiceFocused(true)}
                onBlur={() => setIsServiceFocused(false)}
              />

            </div>

          </div>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <div className='form-group'>
                <label>Item Name:</label>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Qty:</label>
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Price:</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  required
                />
              </div>
              {items.length > 1 && (
                <button type="button" onClick={() => handleRemoveItem(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={handleAddItem} className="add-item-btn">
            <FaPlus /> Add Another Item
          </button>


          <div className="summary">
            <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
            <p>Tax: ₹<span className='tax-amount'> {taxAmount.toFixed(2)}</span> </p>
            <p>Service Charges: ₹ {serviceCharges.toFixed(2)}</p>
            <strong className='total'>Total: ₹ <span className='quotation-total'>{total.toFixed(2)}</span></strong>
          </div>
          <div className='quotation-submit-btn-outer'>
            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? 'Saving...' : 'Save Quotation'}
            </button>
          </div>
          {isSuccess && <p className="success-msg">Quotation saved successfully!</p>}
        </form>
      </div>
    </div>

  );
};

export default Page;
