'use client';
import React, { useState, useEffect } from 'react';
import { useBulkCreateStoreItemMutation, useOcrProcessMutation } from '@/slices/store/storeApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import { FaRegImage } from 'react-icons/fa6';

const Page = () => {
  const [invoiceNo,       setInvoiceNo]       = useState('');
  const [vendorName,      setVendorName]      = useState('');
  const [vendorNo,        setVendorNo]        = useState('');
  const [items,           setItems]           = useState<{ name: string; price: string; quantity: string; subTotal: string; }[]>([]);
  const [newItem,         setNewItem]         = useState({ name: '', price: '', quantity: '', subTotal: '' });
  const [image,           setImage]           = useState<File | null>(null);
  const [showItemFields,  setShowItemFields]  = useState(false);
  const [selectedTaxId,   setSelectedTaxId]   = useState<number | null>(null);
  const [taxMode,         setTaxMode]         = useState('overall');
  const [itemTaxes,       setItemTaxes]       = useState<(number | null)[]>([]);

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
      } catch (error) {
        toast.error('OCR processing failed.');
      }
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('invoice_no', invoiceNo);
    formData.append('vendor_name', vendorName);
    formData.append('vendor_no', vendorNo);
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
  
    try {
      await bulkCreateStoreItem(formData).unwrap();
      toast.success('Items saved successfully.');
    } catch (error) {
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
          <input placeholder="Invoice No" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
          <input placeholder="Vendor Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
          <input placeholder="Vendor No" value={vendorNo} onChange={(e) => setVendorNo(e.target.value)} />
        </div>

        <div className='add-as-a-v-button'>
          <label htmlFor="file-upload" className="file-upload-button">
            <FaRegImage size={20} style={{ marginRight: '8px' }} /> Upload Bill Photo
          </label>
          <input style={{ display: 'none' }} id="file-upload" type="file" onChange={handleImageUpload} />
          <button className='buttons' onClick={() => setShowItemFields(true)}><FaPlus/> Add Items</button>
        </div>

        {showItemFields && (
          <div className='add-as-a-v-items-container'>
            <div className='add-as-a-v-items-inner'>
              <input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              <input placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
              <input placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
              <input placeholder="Sub Total" value={newItem.subTotal} onChange={(e) => setNewItem({ ...newItem, subTotal: e.target.value })} />
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

        {items.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <label><strong>Tax Type:</strong></label><br />
            <label>
              <input type="radio" value="individual" checked={taxMode === 'individual'} onChange={() => setTaxMode('individual')} /> Individual Tax
            </label>{' '}
            <label>
              <input type="radio" value="overall" checked={taxMode === 'overall'} onChange={() => setTaxMode('overall')} /> Overall Tax
            </label>
          </div>
        )}

        {taxMode === 'overall' && items.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="tax-select"><strong>Select Overall Tax</strong></label><br />
            <select
              id="tax-select"
              value={selectedTaxId ?? ''}
              onChange={(e) => setSelectedTaxId(Number(e.target.value))}
              style={{ padding: '8px', marginTop: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
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

        <div className='add-as-a-v-button c-s-buttons-outers'>
          <span className='buttons c-s-buttons'>Cancel</span>
          <button className='buttons c-s-buttons' onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
