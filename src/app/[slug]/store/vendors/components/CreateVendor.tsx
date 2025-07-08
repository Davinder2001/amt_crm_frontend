'use client';
import React, { useState, useEffect } from 'react';
import { useCreateVendorMutation, useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { toast } from 'react-toastify';

interface CreateVendorProps {
    onSuccess: (vendor: Vendor) => void;
    onClose: () => void;
}

const CreateVendor: React.FC<CreateVendorProps> = ({ onSuccess, onClose }) => {
    const [vendorName, setVendorName] = useState('');
    const [vendorNumber, setVendorNumber] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [createVendor, { isLoading }] = useCreateVendorMutation();
    const { data: vendors } = useFetchVendorsQuery();
    const [previousMatchedNumber, setPreviousMatchedNumber] = useState('');

    useEffect(() => {
        if (vendorNumber && vendors) {
            const existingVendor = vendors.find((v: Vendor) => v.vendor_number === vendorNumber);

            if (existingVendor) {
                // If we find a match, fill the fields and remember this number
                setVendorName(existingVendor.vendor_name);
                setVendorEmail(existingVendor.vendor_email || '');
                setVendorAddress(existingVendor.vendor_address);
                setPreviousMatchedNumber(vendorNumber);
            } else if (previousMatchedNumber && vendorNumber !== previousMatchedNumber) {
                // If we had a match before but now don't, clear the fields
                setVendorName('');
                setVendorEmail('');
                setVendorAddress('');
                setPreviousMatchedNumber('');
            }
        } else if (!vendorNumber) {
            // If vendor number is empty, clear all fields
            setVendorName('');
            setVendorEmail('');
            setVendorAddress('');
            setPreviousMatchedNumber('');
        }
    }, [vendorNumber, vendors, previousMatchedNumber]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await createVendor({
                vendor_name: vendorName,
                vendor_number: vendorNumber,
                vendor_email: vendorEmail || '',
                vendor_address: vendorAddress
            }).unwrap();

            toast.success('Vendor created successfully!');
            onSuccess(response);
        } catch (err) {
            console.error('Error adding vendor:', err);
            toast.error('Failed to create vendor');
        }
    };

    return (
        <div className="vendor-creation-page-outer">
            <div className='vendor-creation-page'>
                <form className="vendor-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-section">
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
                                type="button"
                                onClick={handleSubmit}
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