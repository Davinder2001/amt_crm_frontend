// components/AddVendor.tsx
'use client'
import React, { useState } from 'react';
import { useCreateVendorMutation } from '@/slices/vendor/vendorApi';
import { FaPlus } from 'react-icons/fa';

interface AddVendorProps {
  onVendorAdded: (vendorName: string) => void;
}

const AddVendor: React.FC<AddVendorProps> = ({ onVendorAdded }) => {
  const [createVendor, { isLoading: isCreatingVendor }] = useCreateVendorMutation();
  const [newVendor, setNewVendor] = useState('');
  const [isAddingVendor, setIsAddingVendor] = useState(false);

  const handleAddVendor = async () => {
    if (newVendor.trim()) {
      try {
        // Create the new vendor by calling the mutation
        await createVendor({ vendor_name: newVendor.trim() }).unwrap();

        // Call the parent function to update the vendor list
        onVendorAdded(newVendor.trim());

        // Reset the state
        setNewVendor('');
        setIsAddingVendor(false);
      } catch (error) {
        console.error('Error creating vendor:', error);
      }
    }
  };

  return (
    <div className='add-vender-button'>
      {!isAddingVendor ? (
        <button type="button" onClick={() => setIsAddingVendor(true)} style={{ marginTop: '10px' }}>
          <FaPlus /> Add New Vendor
        </button>
      ) : (
        <div>
          <input
            type="text"
            value={newVendor}
            onChange={(e) => setNewVendor(e.target.value)}
            placeholder="Enter new vendor name"
          />
          <div className="cancel-and-add-button">
          <button type="button" onClick={handleAddVendor} disabled={isCreatingVendor}>
            {isCreatingVendor ? 'Adding Vendor...' : 'Add'}
          </button>
          <button type="button" onClick={() => setIsAddingVendor(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVendor;
