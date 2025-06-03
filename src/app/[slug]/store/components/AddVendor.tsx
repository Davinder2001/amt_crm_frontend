// components/AddVendor.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useCreateVendorMutation } from '@/slices/vendor/vendorApi';
import { FaPlus, FaChevronDown } from 'react-icons/fa';

interface AddVendorProps {
  vendors: string[];
  selectedVendor: string;
  onVendorSelect: (vendorName: string) => void;
  onVendorAdded: (vendorName: string) => void;
}

const AddVendor: React.FC<AddVendorProps> = ({
  vendors,
  selectedVendor,
  onVendorSelect,
  onVendorAdded
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newVendor, setNewVendor] = useState('');
  const [createVendor, { isLoading }] = useCreateVendorMutation();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVendorClick = (vendorName: string) => {
    onVendorSelect(vendorName);
    setIsOpen(false);
  };

  const handleAddVendor = async () => {
    const trimmed = newVendor.trim();
    if (!trimmed) return;

    try {
      await createVendor({
        vendor_name: trimmed,
        vendor_number: '',
        vendor_email: '',
        vendor_address: ''
      }).unwrap();
      onVendorAdded(trimmed);
      onVendorSelect(trimmed);
      setNewVendor('');
      setIsAdding(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  return (
    <div className="addvendor-dropdown" ref={dropdownRef}>
      <div
        className="vendors-header"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {selectedVendor || 'Select Vendor'}
        <FaChevronDown size={14} />
      </div>

      {isOpen && (
        <ul className="vendors-menu">
          {vendors.map((vendor, i) => (
            <li
              key={i}
              onClick={() => handleVendorClick(vendor)}
              className={`vendor-name ${vendor === selectedVendor ? 'active' : ''}`}
            >
              {vendor}
            </li>
          ))}

          {!isAdding ? (
            <li
              onClick={() => setIsAdding(true)}
              style={{
                padding: '8px 10px',
                color: '#384B70',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderTop: '1px solid #ddd'
              }}
            >
              <FaPlus /> Add New Vendor
            </li>
          ) : (
            <li style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
              <input
                type="text"
                value={newVendor}
                onChange={(e) => setNewVendor(e.target.value)}
                placeholder="Vendor name"
                style={{ width: '100%', marginBottom: '6px' }}
              />
              <div className='save-cancel-vendor'>
                <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="button" onClick={handleAddVendor} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AddVendor;
