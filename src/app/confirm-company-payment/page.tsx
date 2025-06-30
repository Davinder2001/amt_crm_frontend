'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAddNewCompanyMutation } from '@/slices/company/companyApi';

const ConfirmPage = () => {
  const [addCompany] = useAddNewCompanyMutation();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const confirmRegistration = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');

      if (!orderId) {
        toast.error('Missing order ID in URL');
        router.push('/add-company');
        return;
      }

      try {
        await addCompany(orderId).unwrap(); // 👈 just pass orderId
        toast.success('Company Added successfully!');
        localStorage.removeItem('addCompany');
        router.push('/');
      } catch (error) {
        console.error(error);
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
