'use client';
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import { useFetchCompanyDetailsQuery, useUpdateCompanyMutation } from '@/slices';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic'

const QuillEditor = dynamic(
    () => import('../components/QuillEditor'),
    {
        ssr: false, 
    }
)

interface UpdateCompanyFormData {
    company_name: string;
    company_logo: File | null;
    business_address: string;
    pin_code: string;
    business_proof_type: string;
    business_id: string;
    business_proof_front: File | null;
    business_proof_back: File | null;
    company_signature: File | null;
    term_and_conditions: string;
}

function Page() {
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId');
    const { data } = useFetchCompanyDetailsQuery();
    const companyDetails = data?.company;
    const [updateCompany] = useUpdateCompanyMutation();

    const [formData, setFormData] = useState<UpdateCompanyFormData>({
        company_name: '',
        company_logo: null,
        business_address: '',
        pin_code: '',
        business_proof_type: '',
        business_id: '',
        business_proof_front: null,
        business_proof_back: null,
        company_signature: null,
        term_and_conditions: ''
    });

    // Initialize form data when company details are loaded
    useEffect(() => {
        if (companyDetails) {
            setFormData({
                company_name: String(companyDetails.company_name || ''),
                company_logo: null,
                business_address: String(companyDetails.business_address || ''),
                pin_code: String(companyDetails.pin_code || ''),
                business_proof_type: String(companyDetails.business_proof_type || ''),
                business_id: String(companyDetails.business_id || ''),
                business_proof_front: null,
                business_proof_back: null,
                company_signature: null,
                term_and_conditions: String(companyDetails.term_and_conditions || ''),
            });
        }
    }, [companyDetails]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = new FormData();

            // Append all fields that should be updated
            payload.append('company_name', formData.company_name);
            if (formData.company_logo) payload.append('company_logo', formData.company_logo);
            payload.append('business_address', formData.business_address);
            payload.append('pin_code', formData.pin_code);
            payload.append('business_proof_type', formData.business_proof_type);
            payload.append('business_id', formData.business_id);
            payload.append('method', '_PUT');
            if (formData.business_proof_front) payload.append('business_proof_front', formData.business_proof_front);
            if (formData.business_proof_back) payload.append('business_proof_back', formData.business_proof_back);
            if (formData.company_signature) payload.append('company_signature', formData.company_signature);
            if (formData.term_and_conditions) {
                payload.append('term_and_conditions', formData.term_and_conditions);
            }

            const res = await updateCompany({
                id: Number(companyId),
                formdata: payload
            }).unwrap();

            toast.success(res.message);
        } catch (err) {
            console.error("Failed to update company:", err);
        }
    }

    return (
        <div className="update-company">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="company-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter company name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Logo</label>
                        <div className="file-upload">
                            <input
                                type="file"
                                name="company_logo"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <span className="file-label">
                                {formData.company_logo ? formData.company_logo.name : 'Choose file...'}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">PIN Code</label>
                        <input
                            type="text"
                            name="pin_code"
                            value={formData.pin_code}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter PIN code"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business Proof Type</label>
                        <input
                            type="text"
                            name="business_proof_type"
                            value={formData.business_proof_type}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g. GST, PAN, etc."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business ID</label>
                        <input
                            type="text"
                            name="business_id"
                            value={formData.business_id}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter business ID"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business Proof Front</label>
                        <div className="file-upload">
                            <input
                                type="file"
                                name="business_proof_front"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <span className="file-label">
                                {formData.business_proof_front ? formData.business_proof_front.name : 'Choose file...'}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business Proof Back</label>
                        <div className="file-upload">
                            <input
                                type="file"
                                name="business_proof_back"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <span className="file-label">
                                {formData.business_proof_back ? formData.business_proof_back.name : 'Choose file...'}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Signature</label>
                        <div className="file-upload">
                            <input
                                type="file"
                                name="company_signature"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <span className="file-label">
                                {formData.company_signature ? formData.company_signature.name : 'Choose file...'}
                            </span>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Business Address</label>
                        <textarea
                            name="business_address"
                            value={formData.business_address}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Enter business address"
                            rows={3}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Terms & Conditions</label>
                        <div>
                            <QuillEditor
                                value={formData.term_and_conditions}
                                onChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        term_and_conditions: value,
                                    }))
                                }
                                placeholder="Enter terms here..."
                            />
                        </div>
                    </div>

                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="buttons"
                    >
                        Update Company
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Page