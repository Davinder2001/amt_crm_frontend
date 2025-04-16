'use client';

import React, { useState, useEffect } from 'react';
import { useCreateInvoiceMutation } from '@/slices/invoices/invoice';
import { useFetchStoreQuery } from '@/slices/store/storeApi';
import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import { toast } from 'react-toastify';

const AddInvoiceForm = () => {
  const [number, setNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [filteredStoreItems, setFilteredStoreItems] = useState<StoreItem[]>([]);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const { data: customers } = useFetchAllCustomersQuery();
  const { data: storeData } = useFetchStoreQuery();

  const storeItems: StoreItem[] = (storeData || []).map(item => ({
    ...item,
    measurement: item.measurement ?? '',
    date_of_expiry: item.date_of_expiry ?? ''
  }));

  const handleNumberBlur = () => {
    if (!number || !customers?.customers) return;
    const matchedCustomer = customers.customers.find((cust: Customer) => cust.number === number);
    if (matchedCustomer) {
      setClientName(matchedCustomer.name);
      setClientEmail(matchedCustomer.email || '');
      toast.success(`Customer "${matchedCustomer.name}" found and autofilled!`);
    }
  };

  const handleItemChange = <K extends keyof InvoiceItem>(
    index: number,
    field: K,
    value: InvoiceItem[K]
  ) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'quantity' || field === 'unit_price') {
      const quantity = Number(updated[index].quantity);
      const unit_price = Number(updated[index].unit_price);
      updated[index].price = quantity * unit_price;
    }

    setItems(updated);
  };

  const handleSelectItem = (index: number, storeItem: StoreItem) => {
    const price = Number(storeItem.selling_price);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      item_id: storeItem.id,
      name: storeItem.name,
      unit_price: price,
      quantity: 1,
      price: price,
      measurement: storeItem.measurement ?? '',
      date_of_manufacture: storeItem.date_of_manufacture,
      date_of_expiry: storeItem.date_of_expiry ?? '',
      description: `${storeItem.category || ''} ${storeItem.brand_name || ''}`.trim()
    };
    setItems(updated);
    setIsAutocompleteVisible(false);
    setActiveItemIndex(null);
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        item_id: null,
        name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        price: 0,
        total: 0,
        measurement: '',
        date_of_manufacture: '',
        date_of_expiry: ''
      }
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemInputChange = (index: number, value: string) => {
    handleItemChange(index, 'name', value);
    setFilteredStoreItems(
      value ? storeItems.filter(i => i.name.toLowerCase().includes(value.toLowerCase())) : storeItems
    );
    setActiveItemIndex(index);
    setIsAutocompleteVisible(true);
  };

  const incrementQuantity = (index: number) => {
    const updated = [...items];
    updated[index].quantity += 1;
    updated[index].price = updated[index].quantity * updated[index].unit_price;
    setItems(updated);
  };

  const decrementQuantity = (index: number) => {
    const updated = [...items];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      updated[index].price = updated[index].quantity * updated[index].unit_price;
      setItems(updated);
    }
  };
  

  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setInvoiceDate(formatted);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.some(item => !item.item_id)) {
      toast.error('Please select valid items.');
      return;
    }

    const payload = {
      number,
      client_name: clientName,
      email: clientEmail,
      invoice_date: invoiceDate,
      items: items.map(item => ({
        item_id: item.item_id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        price: item.price,
        description: item.description
      }))
    };

    try {
      await createInvoice(payload).unwrap();
      toast.success('Invoice created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create invoice.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="invoice-form">
      <div className="form-group">
        <label className="form-label">Client Number</label>
        <input
          className="form-input"
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          onBlur={handleNumberBlur}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Client Name</label>
        <input
          className="form-input"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Client Email</label>
        <input
          className="form-input"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Invoice Date</label>
        <input
          className="form-input"
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Items</label>
        {items.map((item, index) => (
          <div className="item-group" key={index}>
            <div className="item-field">
              <input
                className="form-input"
                type="text"
                value={item.name}
                onFocus={() => {
                  setActiveItemIndex(index);
                  setIsAutocompleteVisible(true);
                }}
                onChange={(e) => handleItemInputChange(index, e.target.value)}
                required
              />
            </div>

            {isAutocompleteVisible && activeItemIndex === index && item.name && (
              <ul className="autocomplete-list">
                {filteredStoreItems.map(storeItem => (
                  <li
                    key={storeItem.id}
                    className="autocomplete-item"
                    onClick={() => handleSelectItem(index, storeItem)}
                    style={{ cursor: 'pointer' }}
                  >
                    {storeItem.name}
                  </li>
                ))}
              </ul>
            )}

            <div className="quantity-controls">
              <label className="form-label">Quantity</label>
              <button
                type="button"
                className="quantity-btn"
                onClick={() => decrementQuantity(index)}
              >
                -
              </button>
              <input
                className="form-input quantity-display"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                min={1}
              />
              <button
                type="button"
                className="quantity-btn"
                onClick={() => incrementQuantity(index)}
              >
                +
              </button>
            </div>

            <div className="item-field">
              <input
                className="form-input"
                type="number"
                value={item.unit_price}
                onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                placeholder="Unit Price"
              />
            </div>

            <div className="item-field">
              <input className="form-input" type="text" value={item.measurement} disabled />
            </div>

            <div className="item-field">
              <input className="form-input" type="date" value={item.date_of_manufacture} disabled />
            </div>

            <div className="item-field">
              <input className="form-input" type="date" value={item.date_of_expiry} disabled />
            </div>

            <div className="item-field">
              <textarea
                className="form-input"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                placeholder="Description"
              />
            </div>

            <p className="subtotal">
              Subtotal: ₹{typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
            </p>

            {items.length > 1 && (
              <button
                type="button"
                className="remove-item"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" className="add-item-btn" onClick={addItem}>
          Add Item
        </button>
      </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Create Invoice'}
      </button>
    </form>

  );
};

export default AddInvoiceForm;