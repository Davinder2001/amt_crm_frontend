'use client';
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { useFetchCompanyDetailsQuery, useFetchSelectedCompanyQuery, useUpdateCompanyMutation } from '@/slices';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic'
import Image from 'next/image';

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

// Helper type for tracking original values
interface OriginalValues {
    company_name: string;
    company_logo: string | null;
    business_address: string;
    pin_code: string;
    business_proof_type: string;
    business_id: string;
    business_proof_front: string | null;
    business_proof_back: string | null;
    company_signature: string | null;
    term_and_conditions: string;
}

function Page() {
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId');
    const { data } = useFetchCompanyDetailsQuery();
    const companyDetails = data?.company;
    const [updateCompany, { isLoading }] = useUpdateCompanyMutation();
    const router = useRouter();
    const { refetch } = useFetchSelectedCompanyQuery();

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

    const [originalValues, setOriginalValues] = useState<OriginalValues>({
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

    // Track if form has changes
    const [hasChanges, setHasChanges] = useState(false);
    const fileInputRefs = useRef<{
        company_logo: HTMLInputElement | null;
        business_proof_front: HTMLInputElement | null;
        business_proof_back: HTMLInputElement | null;
        company_signature: HTMLInputElement | null;
    }>({
        company_logo: null,
        business_proof_front: null,
        business_proof_back: null,
        company_signature: null
    });

    // Initialize form data when company details are loaded
    useEffect(() => {
        if (companyDetails) {
            const initialValues = {
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
            };

            const original: OriginalValues = {
                company_name: String(companyDetails.company_name || ''),
                company_logo: companyDetails.company_logo ? String(companyDetails.company_logo) : null,
                business_address: String(companyDetails.business_address || ''),
                pin_code: String(companyDetails.pin_code || ''),
                business_proof_type: String(companyDetails.business_proof_type || ''),
                business_id: String(companyDetails.business_id || ''),
                business_proof_front: companyDetails.business_proof_front ? String(companyDetails.business_proof_front) : null,
                business_proof_back: companyDetails.business_proof_back ? String(companyDetails.business_proof_back) : null,
                company_signature: companyDetails.company_signature ? String(companyDetails.company_signature) : null,
                term_and_conditions: String(companyDetails.term_and_conditions || ''),
            };

            setFormData(initialValues);
            setOriginalValues(original);
        }
    }, [companyDetails]);

    // Check for changes whenever formData changes
    useEffect(() => {
        const checkForChanges = () => {
            const changesDetected =
                formData.company_name !== originalValues.company_name ||
                formData.business_address !== originalValues.business_address ||
                formData.pin_code !== originalValues.pin_code ||
                formData.business_proof_type !== originalValues.business_proof_type ||
                formData.business_id !== originalValues.business_id ||
                formData.term_and_conditions !== originalValues.term_and_conditions ||
                formData.company_logo !== null ||
                formData.business_proof_front !== null ||
                formData.business_proof_back !== null ||
                formData.company_signature !== null;

            setHasChanges(changesDetected);
        };

        checkForChanges();
    }, [formData, originalValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];

            // Check file type
            if (!file.type.match('image.*')) {
                toast.error('Only image files are allowed');
                return;
            }

            // Check file size based on field
            let maxSize = 2 * 1024 * 1024; // Default 2MB

            if (name === 'company_logo') {
                maxSize = 2 * 1024 * 1024; // 2MB for logo
            } else if (name === 'company_signature') {
                maxSize = 2 * 1024 * 1024; // 2MB for signature
            } else if (name.includes('business_proof')) {
                maxSize = 2 * 1024 * 1024; // 2MB for proofs
            }

            if (file.size > maxSize) {
                toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
                return;
            }

            setFormData(prev => ({ ...prev, [name]: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (formData.company_logo && formData.company_logo.size > 2 * 1024 * 1024) {
            toast.error('Company logo must be less than 2MB');
            return;
        }

        if (formData.business_proof_front && formData.business_proof_front.size > 2 * 1024 * 1024) {
            toast.error('Business proof front must be less than 2MB');
            return;
        }

        if (formData.business_proof_back && formData.business_proof_back.size > 2 * 1024 * 1024) {
            toast.error('Business proof back must be less than 2MB');
            return;
        }

        if (formData.company_signature && formData.company_signature.size > 2 * 1024 * 1024) {
            toast.error('Company signature must be less than 2MB');
            return;
        }

        try {
            const payload = new FormData();

            // Append all fields
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

            refetch();
            router.back();
            toast.success(res.message || 'Company updated successfully');
        } catch (err) {
            console.error("Failed to update company:", err);
            toast.error('Failed to update company');
        }
    }

    // Function to render image preview
    const renderImagePreview = (fieldName: 'company_logo' | 'business_proof_front' | 'business_proof_back' | 'company_signature') => {
        // If a new file was selected
        if (formData[fieldName]) {
            return (
                <div className="image-preview">
                    <Image
                        src={URL.createObjectURL(formData[fieldName] as File)}
                        alt={`Preview of ${fieldName.replace('_', ' ')}`}
                        width={100}
                        height={100}
                        className="preview-image"
                    />
                    <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {
                            setFormData(prev => ({ ...prev, [fieldName]: null }));
                            if (fileInputRefs.current[fieldName]) {
                                fileInputRefs.current[fieldName]!.value = '';
                            }
                        }}
                    >
                        ×
                    </button>
                </div>
            );
        }

        // If there's an original image from the server
        if (originalValues[fieldName]) {
            return (
                <div className="image-preview">
                    <Image
                        src={originalValues[fieldName] as string}
                        alt={`Current ${fieldName.replace('_', ' ')}`}
                        width={100}
                        height={100}
                        className="preview-image"
                    />
                    <span className="current-label">Current</span>
                </div>
            );
        }

        return null;
    };

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
                        </div>
                        {renderImagePreview('company_logo')}
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
                        </div>
                        {renderImagePreview('business_proof_front')}
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
                        </div>
                        {renderImagePreview('business_proof_back')}
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
                        </div>
                        {renderImagePreview('company_signature')}
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

                {hasChanges && (
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="buttons"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Company'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Page