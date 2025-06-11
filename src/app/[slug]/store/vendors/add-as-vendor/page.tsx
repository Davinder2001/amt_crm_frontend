'use client';
import React, { useState, useEffect } from 'react';
import { useBulkCreateStoreItemMutation, useOcrProcessMutation } from '@/slices/store/storeApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaArrowLeft,  FaPlus, } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import { FaRegImage } from 'react-icons/fa6';

const Page = () => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // '' | 'credit'
  const [creditPaymentType, setCreditPaymentType] = useState('full'); // 'full' | 'partial'
  const [partialAmount, setPartialAmount] = useState(0);


  const [vendorNo, setVendorNo] = useState('');
  const [items, setItems] = useState<{ name: string; price: string; quantity: string; subTotal: string; }[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '', subTotal: '' });
  const [image, setImage] = useState<File | null>(null);
  const [showItemFields, setShowItemFields] = useState(false);
  const [selectedTaxId, setSelectedTaxId] = useState<number | null>(null);
  const [taxMode, setTaxMode] = useState('overall');
  const [itemTaxes, setItemTaxes] = useState<(number | null)[]>([]);

  const { companySlug } = useCompany();
  const [bulkCreateStoreItem, { isLoading }] = useBulkCreateStoreItemMutation();
  const [ocrProcess] = useOcrProcessMutation();
  const { data: taxData, isLoading: taxLoading } = useFetchTaxesQuery();


  useEffect(() => {
    setItemTaxes(items.map(() => null));
  }, [items]);

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
        if (ocrResponse.products) {
          const parsedItems = ocrResponse.products.map((item) => ({
            name: item.name,
            price: item.price.toString(),
            quantity: item.quantity.toString(),
            subTotal: item.sub_total.toString(),
          }));
          setItems(parsedItems);
        }
        if (ocrResponse.message) toast.success(ocrResponse.message);
      } catch {
        toast.error('OCR processing failed.');
      }
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('invoice_no', invoiceNo);
    formData.append('vendor_name', vendorName);
    formData.append('vendor_no', vendorNo);
    formData.append('vendor_email', vendorEmail);
    formData.append('vendor_address', vendorAddress);

    if (image) formData.append('image', image);

    formData.append('tax_mode', taxMode);

    let itemsToSend = [...items];

    if (taxMode === 'overall' && selectedTaxId) {

      itemsToSend = items.map((item) => ({
        ...item,
        tax_id: selectedTaxId
      }));
      formData.append('tax_id', selectedTaxId.toString());
    } else if (taxMode === 'individual') {
      itemsToSend = items.map((item, index) => {
        const taxId = itemTaxes[index];
        return {
          ...item,
          tax_id: taxId
        };
      });
    }

    formData.append('items', JSON.stringify(itemsToSend));
    formData.append('payment_method', paymentMethod);
    if (paymentMethod === 'credit') {
      formData.append('credit_payment_type', creditPaymentType);
      if (creditPaymentType === 'partial') {
        formData.append('partial_amount', partialAmount.toString());
      }
    }

    try {
      await bulkCreateStoreItem(formData).unwrap();
      toast.success('Items saved successfully.');
    } catch {
      toast.error('Saving failed.');
    }
  };


  return (
    <>
      <Link href={`/${companySlug}/store`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>

      <div className='add-as-a-v-container'>
        <div className='add-as-a-v-inputs'>
          <div className="input-with-label">
            <label> Invoice No</label>
            <input placeholder="Invoice No" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
          </div>

          <div className="input-with-label">
            <label> Vendor Name</label>
            <input placeholder="Vendor Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
          </div>

          <div className="input-with-label">
            <label> Vendor No</label>
            <input
              type="text"
              placeholder="Vendor No"
              value={vendorNo}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setVendorNo(value);
                }
              }}
              maxLength={10}
              inputMode="numeric"
            />

          </div>
          <div className="input-with-label">
            <label> Email</label>
            <input
              placeholder="Vendor Email"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
              type="email"
            />
          </div>

          <div className="input-with-label">
            <label> Address</label>
            <input
              placeholder="Vendor Address"
              value={vendorAddress}
              onChange={(e) => setVendorAddress(e.target.value)}
            />
          </div>
        </div>


        <div className='add-as-a-v-button'>
          <label htmlFor="file-upload" className="file-upload-button">
          <FaRegImage size={20} style={{ marginRight: '8px' }} /> Upload Bill Photo
          </label>
          <input style={{ display: 'none' }} id="file-upload" type="file" onChange={handleImageUpload} />
          <button className='buttons' onClick={() => setShowItemFields(true)} type='button'><FaPlus /> Add Items</button>
        </div>

        {showItemFields && (
          <div className='add-as-a-v-items-container'>
            <div className='add-as-a-v-items-inner'>
              <div className="input-with-label">
                <label> Name</label>
                <input
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>

              <div className="input-with-label">
                <label> Price</label>
                <input
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>

              <div className="input-with-label">
                <label> Quantity</label>
                <input
                  placeholder=""
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
              </div>

              <div className="input-with-label">
                <label>Sub Total</label>
                <input
                  placeholder="Sub Total"
                  value={newItem.subTotal}
                  onChange={(e) => setNewItem({ ...newItem, subTotal: e.target.value })}
                />
              </div>
            </div>
            <button className='buttons' onClick={handleAddItemToList} type='button'>Add</button>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Sub Total</th>
              {taxMode === 'individual' && <th>Tax</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.subTotal}</td>
                {taxMode === 'individual' && (
                  <td>
                    <select
                      value={itemTaxes[index] ?? ''}
                      onChange={(e) => {
                        const updated = [...itemTaxes];
                        updated[index] = Number(e.target.value);
                        setItemTaxes(updated);
                      }}
                    >
                      <option value=''>-- Tax --</option>
                      {taxLoading ? (
                        <option>Loading...</option>
                      ) : (
                        taxData?.data?.map((tax) => (
                          <option key={tax.id} value={tax.id}>{tax.name} ({tax.rate}%)</option>
                        ))
                      )}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className='add-as-vendor-select-tex-outer'>
          {items.length > 0 && (
            <div className="tax-box"style={{ marginTop: '20px' }}>
              <label><strong>Tax Type:</strong></label><br />
              <label className='tax-radio'>
                <input type="radio" value="individual" checked={taxMode === 'individual'} onChange={() => setTaxMode('individual')} /> <p> Individual Tax</p>
              </label>{' '}
              <label className='tax-radio'>
                <input type="radio" value="overall" checked={taxMode === 'overall'} onChange={() => setTaxMode('overall')} /> <p>Overall Tax</p>
              </label>
            </div>
          )}

          {taxMode === 'overall' && items.length > 0 && (
            <div className="overall-tax"style={{ marginTop: '20px' }}>
              <label htmlFor="tax-select"><strong>Select Overall Tax</strong></label><br />
              <select
                id="tax-select"
                value={selectedTaxId ?? ''}
                onChange={(e) => setSelectedTaxId(Number(e.target.value))}
                style={{ padding: '8px', marginTop: '6px', borderRadius: '4px', border: '1px solid #ccc'}}
              >
                <option value=''>-- Select Tax --</option>
                {taxLoading ? (
                  <option>Loading...</option>
                ) : (
                  taxData?.data?.map((tax) => (
                    <option key={tax.id} value={tax.id}>{tax.name} ({tax.rate}%)</option>
                  ))
                )}
              </select>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="payment-section">
            <label className="section-title">Payment Details</label>

            <div className="payment-methods">
              <div
                className={`payment-box ${paymentMethod === 'Paid' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('Paid')}
              >
                <span className="icon"></span>
                <span>Paid</span>
              </div>

              <div
                className={`payment-box ${paymentMethod === 'credit' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('credit')}
              >
                <span className="icon"></span>
                <span>Credit</span>
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <div className="credit-details">
                <label className="sub-title">Credit Type</label>
                <div className="credit-options">
                  <button
                  type='button'
                    className={`credit-button ${creditPaymentType === 'full' ? 'active' : ''}`}
                    onClick={() => setCreditPaymentType('full')}
                  >
                    Full Payment
                  </button>
                  <button
                  type='button'
                    className={`credit-button ${creditPaymentType === 'partial' ? 'active' : ''}`}
                    onClick={() => setCreditPaymentType('partial')}
                  >
                    Partial Payment
                  </button>
                </div>

                {creditPaymentType === 'partial' && (
                  <div className="partial-input">
                    <input
                      type="number"
                      placeholder="Enter partial amount"
                      value={partialAmount === 0 ? '' : partialAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPartialAmount(isNaN(val) ? 0 : val);
                      }}
                      min={0}
                      step={0.01}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className='add-as-a-v-button c-s-buttons-outers'>
          <span className='buttons c-s-buttons cancel-btn'>Cancel</span>
          <button className='buttons c-s-buttons' onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
