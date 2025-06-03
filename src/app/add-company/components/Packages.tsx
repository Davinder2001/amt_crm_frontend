'use client';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface PackagesProps {
    plans: PackagePlan[];
    setSelectedPackageId: (id: number) => void;
    selectedPackageId: number | null;
    categories: BusinessCategory[];
    setSelectedCategoryId: (id: number) => void;
    selectedCategoryId: number | null;
    subscriptionType: 'monthly' | 'annually' | null;
    setSubscriptionType: (type: 'monthly' | 'annually') => void;
}

const Packages: React.FC<PackagesProps> = ({
    plans,
    setSelectedPackageId,
    selectedPackageId,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    subscriptionType,
    setSubscriptionType,
}) => {
    const isInitialLoad = useRef(true);

    const filteredPlans = plans.filter((plan) =>
        plan.business_categories.some(
            (category) => category.id === selectedCategoryId
        )
    );

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = Number(e.target.value);
        setSelectedCategoryId(selectedCategoryId);
        isInitialLoad.current = false;
    };

    useEffect(() => {
        if (isInitialLoad.current && categories.length > 0 && plans.length > 0) {
            const firstCategoryWithPackages = categories.find((category) =>
                plans.some((plan) =>
                    plan.business_categories.some(
                        (planCategory) => planCategory.id === category.id
                    )
                )
            );

            if (firstCategoryWithPackages) {
                setSelectedCategoryId(firstCategoryWithPackages.id);
            }

            // ✅ Set default subscription type if not already set
            if (!subscriptionType) {
                setSubscriptionType('monthly'); // or 'annually' as your default
            }

            isInitialLoad.current = false;
        }
    }, [plans, categories, subscriptionType, setSelectedCategoryId, setSubscriptionType]);


    return (
        <div className="account-pricing-container">
            {/* Header */}
            <div className="account-packages-header">
                <Link href="/" className="back-button">
                    <FaArrowLeft size={16} color="#fff" />
                </Link>

                <div className="filters">
                    <div className="filter-group">
                        {/* Category Dropdown */}
                        <label htmlFor="category-select">Category:</label>
                        <select
                            id="category-select"
                            value={selectedCategoryId ?? ''}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subscription Type Dropdown */}
                    <div className="filter-group">
                        <label htmlFor="subscription-select">Billing:</label>
                        <select
                            id="subscription-select"
                            value={subscriptionType ?? ''}
                            onChange={(e) =>
                                setSubscriptionType(e.target.value as 'monthly' | 'annually')
                            }
                        >
                            <option value="">Select Type</option>
                            <option value="monthly">Monthly</option>
                            <option value="annually">Annually</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* Plans */}
            <div className="packages-grid">
                {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => {
                        const isSelected = plan.id === selectedPackageId;
                        const price =
                            subscriptionType === 'monthly'
                                ? plan.monthly_price
                                : plan.annual_price;

                        return (
                            <div key={plan.id} className="package-card">
                                <div className="ribbon">
                                    {subscriptionType === 'monthly' ? '1 Month' : '1 Year'}
                                </div>
                                <h3 className="planPrice">
                                    ₹ {price ?? 0} /{' '}
                                    {subscriptionType === 'monthly' ? 'Month' : 'Year'}
                                </h3>
                                <ul className="features">
                                    <li>{plan.employee_numbers} Employees</li>
                                    <li>{plan.items_number} Items</li>
                                    <li>{plan.daily_tasks_number} Tasks/day</li>
                                    <li>{plan.invoices_number} Invoices</li>
                                </ul>

                                <div className="pricing-buttons">
                                    <button
                                        className={isSelected ? 'btnPrimary' : 'btnSecondary'}
                                        onClick={() => setSelectedPackageId(plan.id ?? 0)}
                                        disabled={!subscriptionType}
                                    >
                                        {isSelected ? 'Selected' : 'Choose Plan'}
                                    </button>

                                    <button className="btnOnline">✓ Online</button>
                                </div>
                                {!subscriptionType && (
                                    <p className="text-xs text-red-500 mb-1">Please select a subscription type first</p>
                                )}

                            </div>
                        );
                    })
                ) : (
                    <div className="no-packages-message">
                        <div className="empty-box-icon">📦</div>
                        <h3>No packages available</h3>
                        <p>We couldn&apos;t find any packages for this category.</p>
                        <div className="suggestions">
                            <p>Try selecting a different category or check back later!</p>
                            <div className="wave-hand">👋</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packages;
















// 'use client';
// import Link from 'next/link';
// import React, { useEffect, useRef, useState } from 'react';
// import { FaArrowLeft } from 'react-icons/fa';

// interface PackagesProps {
//     plans: PackagePlan[];
//     setSelectedPackageId: (id: number) => void;
//     categories: BusinessCategory[];
//     setSelectedCategoryId: (id: number) => void;
//     selectedCategoryId: number | null;
//     subscriptionType: 'monthly' | 'annually' | null;
//     setSubscriptionType: (type: 'monthly' | 'annually') => void;
// }

// const Packages: React.FC<PackagesProps> = ({
//     plans,
//     setSelectedPackageId,
//     categories,
//     selectedCategoryId,
//     setSelectedCategoryId,
//     subscriptionType,
//     setSubscriptionType,
// }) => {
//     const [tempSelectedPlan, setTempSelectedPlan] = useState<PackagePlan | null>(null);
//     const [step, setStep] = useState<1 | 2>(1);

//     const isInitialLoad = useRef(true);

//     const filteredPlans = plans.filter((plan) =>
//         plan.business_categories.some(
//             (category) => category.id === selectedCategoryId
//         )
//     );

//     const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedCategoryId = Number(e.target.value);
//         setSelectedCategoryId(selectedCategoryId);
//         isInitialLoad.current = false;
//     };

//     useEffect(() => {
//         if (isInitialLoad.current && categories.length > 0 && plans.length > 0) {
//             const firstCategoryWithPackages = categories.find((category) =>
//                 plans.some((plan) =>
//                     plan.business_categories.some(
//                         (planCategory) => planCategory.id === category.id
//                     )
//                 )
//             );

//             if (firstCategoryWithPackages) {
//                 setSelectedCategoryId(firstCategoryWithPackages.id);
//             }

//             if (!subscriptionType) {
//                 setSubscriptionType('monthly');
//             }

//             isInitialLoad.current = false;
//         }
//     }, [plans, categories, subscriptionType, setSelectedCategoryId, setSubscriptionType]);

//     return (
//         <div className="account-pricing-container">
//             <div className="account-packages-header">
//                 <Link href="/" className="back-button">
//                     <FaArrowLeft size={16} color="#fff" />
//                 </Link>


//             </div>

//             {step === 1 && (
//                 <>
//                     <div className="filters">
//                         <div className="filter-group">
//                             <label htmlFor="category-select">Category:</label>
//                             <select
//                                 id="category-select"
//                                 value={selectedCategoryId ?? ''}
//                                 onChange={handleCategoryChange}
//                             >
//                                 <option value="">Select Category</option>
//                                 {categories.map((category) => (
//                                     <option key={category.id} value={category.id}>
//                                         {category.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="packages-grid">
//                         {filteredPlans.length > 0 ? (
//                             filteredPlans.map((plan) => (
//                                 <div key={plan.id} className="package-card">
//                                     <div className="ribbon">Preview</div>
//                                     <h3 className="planPrice">₹ {plan.monthly_price} / Month</h3>
//                                     <ul className="features">
//                                         <li>✓ {plan.employee_numbers} Employees</li>
//                                         <li>✓ {plan.items_number} Items</li>
//                                         <li>✓ {plan.daily_tasks_number} Tasks/day</li>
//                                         <li>✓ {plan.invoices_number} Invoices</li>
//                                     </ul>
//                                     <button
//                                         className="btnPrimary"
//                                         onClick={() => {
//                                             setTempSelectedPlan(plan);
//                                             setStep(2);
//                                         }}
//                                     >
//                                         Choose Plan
//                                     </button>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="no-packages-message">
//                                 <h3>No packages available</h3>
//                             </div>
//                         )}
//                     </div>
//                 </>
//             )}

//             {step === 2 && tempSelectedPlan && (
//                 <div className="step-2-layout">
//                     <div className="left-card">
//                         <label htmlFor="subscription-select">Billing:</label>
//                         <select
//                             id="subscription-select"
//                             value={subscriptionType ?? ''}
//                             onChange={(e) =>
//                                 setSubscriptionType(e.target.value as 'monthly' | 'annually')
//                             }
//                         >
//                             <option value="">Select Type</option>
//                             <option value="monthly">Monthly</option>
//                             <option value="annually">Annually</option>
//                         </select>
//                     </div>

//                     <div className="right-card">
//                         {subscriptionType ? (
//                             <>
//                                 <h3>
//                                     ₹{' '}
//                                     {subscriptionType === 'monthly'
//                                         ? tempSelectedPlan.monthly_price
//                                         : tempSelectedPlan.annual_price}{' '}
//                                     / {subscriptionType === 'monthly' ? 'Month' : 'Year'}
//                                 </h3>
//                                 <p>{tempSelectedPlan.employee_numbers} Employees</p>
//                                 <p>{tempSelectedPlan.items_number} Items</p>
//                                 <p>{tempSelectedPlan.daily_tasks_number} Tasks/day</p>
//                                 <p>{tempSelectedPlan.invoices_number} Invoices</p>
//                                 <button
//                                     className="btnPrimary"
//                                     onClick={() => {
//                                         setSelectedPackageId(tempSelectedPlan.id ?? 0);
//                                         // optionally navigate or confirm
//                                     }}
//                                 >
//                                     Continue
//                                 </button>
//                             </>
//                         ) : (
//                             <p>Please select a billing type to continue</p>
//                         )}
//                     </div>

//                 </div>
//             )}
//             <style jsx>{`
//             .step-2-layout {
//    display: grid;
//     grid-template-columns: 1fr 1fr;
//     align-items: center;
//     gap: 2rem;
// }
// .left-card, .right-card {
//     padding: 1rem;
//     border: 1px solid #ccc;
//     flex: 1;
//     height: 100%;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
// }
// .btnPrimary {
//     background-color: #0070f3;
//     color: white;
//     padding: 10px;
//     border: none;
//     cursor: pointer;
// }

//             `}</style>
//         </div>
//     );
// };

// export default Packages;