// components/AddVendor.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaChevronDown } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import CreateVendor from '../vendors/components/CreateVendor';

interface AddVendorProps {
  vendors: Vendor[];
  selectedVendorId: number | null;
  onVendorSelect: (vendorId: number) => void;
  onVendorAdded: (vendor: Vendor) => void;
  disabled?: boolean;
}

const AddVendor: React.FC<AddVendorProps> = ({
  vendors,
  selectedVendorId,
  onVendorSelect,
  onVendorAdded,
  disabled = false
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

  const handleVendorClick = (vendorId: number) => {
    onVendorSelect(vendorId);
    setIsOpen(false);
  };

  const selectedVendorName = vendors.find(v => v.id === selectedVendorId)?.vendor_name || 'Select Vendor';

  return (
    <div className="addvendor-dropdown" ref={dropdownRef}>
      <div className={`vendors-header ${disabled ? 'disabled' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}>
        {selectedVendorName}
        <FaChevronDown size={14}/>
      </div>

      {isOpen && (
        <ul className="vendors-menu">
          <div className="vendors-scroll">
            {vendors.map((vendor) => (
              <li
                key={vendor.id}
                onClick={() => handleVendorClick(vendor.id)}
                className={`vendor-name ${vendor.id === selectedVendorId ? 'active' : ''}`}
              >
                {vendor.vendor_name}
              </li>
            ))}
          </div>
          <li
            onClick={() => setAddVendorModalOpen(true)}
            style={{
              padding: '8px 10px',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderTop: '1px solid #ddd',
              position: 'sticky',
              bottom: 0,
              width: '100%',
              backgroundColor: '#fff',
              zIndex: 9
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
          onSuccess={(newVendor) => {
            onVendorAdded(newVendor);
            onVendorSelect(newVendor.id);
            setAddVendorModalOpen(false);
          }}
          onClose={() => setAddVendorModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AddVendor;