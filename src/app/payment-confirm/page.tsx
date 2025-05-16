'use client';
import React, { useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useConfirmAdminRegisterMutation } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';

const ConfirmPage = () => {
    const [confirmAdminRegister] = useConfirmAdminRegisterMutation();
    const router = useRouter();

    useEffect(() => {
        const confirmRegistration = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId');

            if (!orderId) {
                toast.error('Missing order ID in URL');
                return;
            }

            const savedFormData = localStorage.getItem('adminregistration');

            if (!savedFormData) {
                toast.error('No form data found. Please try registering again.');
                return;
            }

            // Convert JSON back to FormData
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
                router.push('/login'); // or wherever you want to redirect
            } catch (error) {
                toast.error('Failed to confirm registration.');
            }
        };

        confirmRegistration();
    }, [confirmAdminRegister, router]);

    return <div className="text-center mt-10 text-lg font-semibold">Confirming your registration...</div>;
};

export default ConfirmPage;
