// components/AddVendor.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaChevronDown } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import CreateVendor from '../vendors/components/CreateVendor';

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
  const [addVendorModalOpen, setAddVendorModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVendorClick = (vendorName: string) => {
    onVendorSelect(vendorName);
    setIsOpen(false);
  };

  return (
    <div className="addvendor-dropdown" ref={dropdownRef}>
      <div className="vendors-header" onClick={() => setIsOpen(prev => !prev)}>
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
          <li
            onClick={() => setAddVendorModalOpen(true)}
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
        </ul>
      )}

      <Modal
        isOpen={addVendorModalOpen}
        onClose={() => setAddVendorModalOpen(false)}
        title="Add New Vendor"
        width="800px"
      >
        <CreateVendor
          onSuccess={(newVendorName) => {
            onVendorAdded(newVendorName);
            onVendorSelect(newVendorName);
            setAddVendorModalOpen(false);
          }}
          onClose={() => setAddVendorModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AddVendor;