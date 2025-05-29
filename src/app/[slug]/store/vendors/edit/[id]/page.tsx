'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchVendorByIdQuery, useUpdateVendorMutation } from '@/slices/vendor/vendorApi';
import { useCompany } from '@/utils/Company';
import { FaArrowLeft, FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditVendorPage: React.FC = () => {
    const { companySlug } = useCompany();
    const params = useParams();
    const router = useRouter();
    const vendorId = Number(params?.id);

    const { data: data, isLoading, error } = useFetchVendorByIdQuery(vendorId);
    const vendor = data?.vendor;

    const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();

    const [vendorName, setVendorName] = useState('');
    const [vendorNumber, setVendorNumber] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');

    useEffect(() => {
        if (vendor) {
            setVendorName(vendor.name || '');
            setVendorNumber(vendor.number || '');
            setVendorEmail(vendor.email || '');
            setVendorAddress(vendor.address || '');
        }
    }, [vendor]);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('_method', 'PUT');

        formdata.append('vendor_name', vendorName || vendor?.name || '');
        formdata.append('vendor_number', vendorNumber || vendor?.number || '');
        formdata.append('vendor_email', vendorEmail);
        formdata.append('vendor_address', vendorAddress);

        try {
            await updateVendor({
                id: vendorId,
                formdata,
            }).unwrap();

            toast.success('Vendor updated successfully!');
            router.push(`/${companySlug}/store/vendors`);
        } catch (err: any) {
            console.error('Error updating vendor:', err);
            toast.error(err?.data?.message || 'Failed to update vendor');
        }
    };



    if (isLoading) return <p className="loading-text">Loading vendor...</p>;
    if (error) return <p className="error-text">Failed to load vendor details.</p>;

    return (
        <div className="vendor-creation-page-outer">
            <button onClick={() => router.back()} className="back-button">
                <FaArrowLeft size={20} color="#fff" />
            </button>
            <div className='vendor-creation-page'>
                <div className="creation-header">
                    <h1>Edit Vendor</h1>
                    <p className="header-description">Update vendor details below</p>
                </div>

                <form className="vendor-form" onSubmit={handleSubmit}>
                    <div className="form-section">

                        {/* Vendor Name */}
                        <div className="input-group">
                            <label>
                                <FaStore className="input-icon" />
                                Vendor Name
                            </label>
                            <input
                                type="text"
                                value={vendorName}
                                onChange={(e) => setVendorName(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {/* Vendor Number */}
                        <div className="input-group">
                            <label>
                                <FaPhone className="input-icon" />
                                Vendor Number
                            </label>
                            <input
                                type="tel"
                                value={vendorNumber}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,10}$/.test(value)) {
                                        setVendorNumber(value);
                                    }
                                }}
                                className="form-input"
                                maxLength={10}
                                placeholder="Enter 10-digit number"
                            />
                        </div>

                        {/* Vendor Email */}
                        <div className="input-group">
                            <label>
                                <FaEnvelope className="input-icon" />
                                Vendor Email <span className="optional-label">(optional)</span>
                            </label>
                            <input
                                type="email"
                                value={vendorEmail}
                                onChange={(e) => setVendorEmail(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {/* Vendor Address */}
                        <div className="input-group">
                            <label>
                                <FaMapMarkerAlt className="input-icon" />
                                Vendor Address
                            </label>
                            <textarea
                                value={vendorAddress}
                                onChange={(e) => setVendorAddress(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={isUpdating}  // Only disable when updating (optional)
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="spinner"></span>
                                        Updating Vendor...
                                    </>
                                ) : (
                                    'Update Vendor'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default EditVendorPage;
