'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useConfirmAdminRegisterMutation } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';

const ConfirmPage = () => {
    const [confirmAdminRegister] = useConfirmAdminRegisterMutation();
    const router = useRouter();
    const hasRun = useRef(false); // prevents duplicate execution in dev

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const confirmRegistration = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId');

            if (!orderId) {
                toast.error('Missing order ID in URL');
                router.push('/register-your-company');
                return;
            }

            const savedFormData = localStorage.getItem('adminregistration');
            if (!savedFormData) {
                toast.error('No form data found. Please try registering again.');
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
                await confirmAdminRegister({ orderId, formData }).unwrap();
                toast.success('Registration confirmed successfully!');
                localStorage.removeItem('adminregistration');
                router.push('/login');
            } catch (error) {
                toast.error('Failed to confirm registration.');
            }
        };

        confirmRegistration(); 
    }, [confirmAdminRegister, router]);

    return <div className="text-center mt-10 text-lg font-semibold">Confirming your registration...</div>;
};

export default ConfirmPage;
