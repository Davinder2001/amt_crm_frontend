// // src/app/confirm-company-payment/page.tsx
// 'use client';
// import React, { useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { useConfirmUpgradeCompanyPackageMutation } from '@/slices/superadminSlices/packages/packagesApi';

// const ConfirmUpgrade = () => {
//     const [addCompany] = useConfirmUpgradeCompanyPackageMutation();
//     const router = useRouter();
//     const hasRun = useRef(false); // prevents duplicate execution in dev
//     useEffect(() => {
//         if (hasRun.current) return;
//         hasRun.current = true;

//         const confirmRegistration = async () => {
//             const urlParams = new URLSearchParams(window.location.search);
//             const orderId = urlParams.get('orderId'); // ✅ fetch from URL

//             if (!orderId) {
//                 toast.error('Missing order ID in URL');
//                 router.push('/add-company');
//                 return;
//             }

//             const savedFormData = localStorage.getItem('addCompany');
//             if (!savedFormData) {
//                 toast.error('No form data found. Please try again.');
//                 return;
//             }

//             const parsedData = JSON.parse(savedFormData);
//             const formdata = new FormData();

//             Object.entries(parsedData).forEach(([key, value]) => {
//                 if (value !== null && value !== undefined) {
//                     formdata.append(key, String(value));
//                 }
//             });

//             try {
//                 // ✅ Call mutation with both orderId and formdata
//                 await addCompany({ orderId, formdata }).unwrap();
//                 toast.success('Company Added successfully!');
//                 localStorage.removeItem('addCompany');
//                 router.push('/');
//             } catch (error) {
//                 console.error(error);
//                 toast.error('Failed to Add Company.');
//             }
//         };

//         confirmRegistration();
//     }, [addCompany, router]);


//     return (
//         <div className="confirmation-container">
//             <div className="confirmation-card">
//                 <div className="c-spinner">
//                     <div className="spinner-circle"></div>
//                     <div className="spinner-circle"></div>
//                     <div className="spinner-circle"></div>
//                     <div className="spinner-circle"></div>
//                 </div>
//                 <h1 className="confirmation-title">Processing Your Request</h1>
//                 <p className="confirmation-message">Please wait while we confirm your details...</p>
//                 <div className="progress-bar">
//                     <div className="progress"></div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ConfirmUpgrade;














// src/app/confirm-company-payment/page.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useConfirmUpgradeCompanyPackageMutation } from '@/slices/superadminSlices/packages/packagesApi';

const ConfirmUpgrade = () => {
    const [confirmUpgrade] = useConfirmUpgradeCompanyPackageMutation();
    const router = useRouter();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const confirmUpgradePackage = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('orderId');

            if (!orderId) {
                toast.error('Missing order ID in URL');
                router.push('/add-company');
                return;
            }

            const savedData = localStorage.getItem('upgradepackage');
            console.log("anku", savedData);
            if (!savedData) {
                toast.error('No package upgrade data found. Please try again.');
                return;
            }

            try {
                const { packageId, packageType } = JSON.parse(savedData);

                if (!packageId || !packageType) {
                    toast.error('Incomplete package data.');
                    return;
                }

                const formdata = new FormData();
                formdata.append('package_id', packageId);
                formdata.append('package_type', packageType);

                await confirmUpgrade({
                    orderId,
                    formdata,
                }).unwrap();

                toast.success('Package upgraded successfully!');
                localStorage.removeItem('upgradepackage');
                router.push('/');
            } catch (error) {
                console.error(error);
                toast.error('Failed to confirm package upgrade.');
            }
        };

        confirmUpgradePackage();
    }, [confirmUpgrade, router]);

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

export default ConfirmUpgrade;
