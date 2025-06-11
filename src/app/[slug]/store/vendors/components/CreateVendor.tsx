'use client';
import React, { useState } from 'react';
import { useCreateVendorMutation } from '@/slices/vendor/vendorApi';
import { toast } from 'react-toastify';

interface CreateVendorProps {
    onSuccess: (vendorName: string) => void;
    onClose: () => void;
}

const CreateVendor: React.FC<CreateVendorProps> = ({ onSuccess, onClose }) => {
    const [vendorName, setVendorName] = useState('');
    const [vendorNumber, setVendorNumber] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [createVendor, { isLoading }] = useCreateVendorMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createVendor({
                vendor_name: vendorName,
                vendor_number: vendorNumber,
                vendor_email: vendorEmail || '',
                vendor_address: vendorAddress
            }).unwrap();

            toast.success('Vendor created successfully!');
            onSuccess(vendorName);
        } catch (err) {
            console.error('Error adding vendor:', err);
            toast.error('Failed to create vendor');
        }
    };

    return (
        <div className="vendor-creation-page-outer">
            <div className='vendor-creation-page'>
                <form className="vendor-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="input-group">
                            <label>
                                Vendor Name <span className={`required-asterisk ${vendorName ? 'filled' : 'unfilled'}`}>*</span>
                            </label>
                            <input
                                type="text"
                                value={vendorName}
                                onChange={(e) => setVendorName(e.target.value)}
                                required
                                placeholder="Enter vendor name"
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>
                                Vendor Number <span className={`required-asterisk ${vendorNumber ? 'filled' : 'unfilled'}`}>*</span>
                            </label>
                            <input
                                type="text"
                                value={vendorNumber}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,10}$/.test(value)) {
                                        setVendorNumber(value);
                                    }
                                }}
                                required
                                placeholder="Enter 10-digit vendor phone number"
                                className="form-input"
                                maxLength={10}
                            />
                        </div>

                        <div className="input-group">
                            <label>
                                Vendor Email <span className="optional-label">(optional)</span>
                            </label>
                            <input
                                type="email"
                                value={vendorEmail}
                                onChange={(e) => setVendorEmail(e.target.value)}
                                placeholder="Enter vendor email"
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>
                                Vendor Address <span className={`required-asterisk ${vendorAddress ? 'filled' : 'unfilled'}`}>*</span>
                            </label>
                            <textarea
                                value={vendorAddress}
                                onChange={(e) => setVendorAddress(e.target.value)}
                                required
                                placeholder="Enter vendor address"
                                className="form-input"
                            />
                        </div>

                        <div className="form-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <button type="button" onClick={onClose} className="buttons">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="buttons"
                                disabled={isLoading || !vendorName || !vendorNumber || !vendorAddress}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Creating Vendor...
                                    </>
                                ) : (
                                    'Create Vendor'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVendor;
