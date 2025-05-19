'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCompany } from '@/utils/Company';
import { useAddNewCompanyMutation } from '@/slices/company/companyApi';

const ConfirmPage = () => {
    const [addCompany] = useAddNewCompanyMutation();
    const router = useRouter();
    const hasRun = useRef(false); // prevents duplicate execution in dev
    const { companySlug } = useCompany();

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const confirmRegistration = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId');

            if (!orderId) {
                toast.error('Missing order ID in URL');
                router.push(`/${companySlug}/my-account/add-company`);
                return;
            }

            const savedFormData = localStorage.getItem('addCompany');
            if (!savedFormData) {
                toast.error('No form data found. Please try again.');
                return;
            }

            const parsedData = JSON.parse(savedFormData);
            const formData = new FormData();
            Object.entries(parsedData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            try {
                await addCompany({ orderId, formdata: formData }).unwrap();
                toast.success('Company Added successfully!');
                localStorage.removeItem('addCompany');
                router.push(`/${companySlug}/my-account`);
            } catch {
                toast.error('Failed to Add Company.');
            }
        };

        confirmRegistration();
    }, [addCompany, router]);

    return (
        <div className="confirmation-container">
            <div className="confirmation-card">
                <div className="c-spinner">
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                </div>
                <h1 className="confirmation-title">Processing Your Request</h1>
                <p className="confirmation-message">Please wait while we confirm your details...</p>
                <div className="progress-bar">
                    <div className="progress"></div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPage;