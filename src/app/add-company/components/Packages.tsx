'use client';
import Logout from '@/components/common/Logout';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';

interface PackagesProps {
    plans: PackagePlan[];
    setSelectedPackageId: (id: number) => void;
    selectedPackageId: number | null;
    categories: BusinessCategory[];
    setSelectedCategoryId: (id: number) => void;
    selectedCategoryId: number | null;
    subscriptionType: 'annual' | 'three_years';
    setSubscriptionType: (type: 'annual' | 'three_years') => void;
}

const Packages: React.FC<PackagesProps> = ({
    plans,
    setSelectedPackageId,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    subscriptionType,
    setSubscriptionType,
}) => {
    const isInitialLoad = useRef(true);
    const [selectedPlanDetails, setSelectedPlanDetails] = useState<PackagePlan | null>(null);
    const [showPlanDetails, setShowPlanDetails] = useState(false);

    const filteredPlans = plans.filter((plan) =>
        plan.business_categories.some((category) => category.id === selectedCategoryId)
    );

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        setSelectedCategoryId(selectedId);
        isInitialLoad.current = false;
    };

    const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'annual' | 'three_years';
        setSubscriptionType(newType);
    };
    const handlePackageSelection = (plan: PackagePlan) => {
        setSelectedPlanDetails(plan);
        setShowPlanDetails(true);
    };

    const confirmPackageSelection = () => {
        if (selectedPlanDetails) {
            setSelectedPackageId(selectedPlanDetails.id!);
        }
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

            isInitialLoad.current = false;
        }
    }, [plans, categories, setSelectedCategoryId]);

    return (
        <div className="account-pricing-container">
            {!showPlanDetails ? (
                <>
                    <div className="account-packages-header">
                        <div className="acc-pkg-header-inner">
                            <Link href="/" className="back-to-pkgs">
                                <FaArrowLeft size={16} color="#fff" />
                            </Link>

                            <div className="category-filter">
                                <div className="filter-group">
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
                                <Logout />
                            </div>
                        </div>
                    </div>

                    <div className="packages-grid">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan) => (
                                <div key={plan.id} className="package-card">
                                    <div className="ribbon">1 Year</div>
                                    <h3 className="planPrice">
                                        ₹ {plan.annual_price ?? 0} / 1 Year
                                    </h3>
                                    <ul className="features">
                                        <li><FaCheck color='#008001' /> {plan.employee_limit} Employees</li>
                                        <li>{plan.chat === false ? <FaTimes color='#ff0000' /> : <FaCheck color='#008001' />}Chat</li>
                                        <li>{plan.task === false ? <FaTimes color='#ff0000' /> : <FaCheck color='#008001' />}Task</li>
                                        <li>{plan.hr === false ? <FaTimes color='#ff0000' /> : <FaCheck color='#008001' />}HR</li>
                                        {plan.details && plan.details.length > 0 && (
                                            <>
                                                {plan.details.map((detail, index) => (
                                                    <li key={index}>
                                                        <FaCheck color='#008001' /> {detail}
                                                    </li>
                                                ))}
                                            </>
                                        )}
                                    </ul>
                                    <div className="pricing-buttons">
                                        <button
                                            type='button'
                                            className='btnSecondary'
                                            onClick={() => handlePackageSelection(plan)}
                                        >
                                            Choose Plan
                                        </button>
                                        <button type='button' className="btnOnline">✓ Online</button>
                                    </div>
                                </div>
                            ))
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
                </>
            ) : (
                <div className="plan-details-view">
                    <div className="plan-details-header">
                        <div className="plan-details-header-inner">
                            <button
                                className="back-to-pkgs"
                                onClick={() => setShowPlanDetails(false)}
                            >
                                <FaArrowLeft size={16} color="#fff" />
                            </button>
                            <Logout />
                        </div>
                    </div>

                    <div className="plan-details-content">
                        <div className="plan-info">
                            <h2>{selectedPlanDetails?.name}</h2>
                            <ul className="features">
                                <li><FaCheck color='#008001' /> {selectedPlanDetails?.employee_limit} Employees</li>
                                <li>{selectedPlanDetails?.chat === false ? <FaTimes color='#ff0000' /> : <FaCheck color='#008001' />}Chat</li>
                                <li>{selectedPlanDetails?.task === false ? <FaTimes color='#ff0000' /> : <FaCheck color='#008001' />}Task</li>
                                <li>{selectedPlanDetails?.hr === false ? <FaTimes color='#ff0000' /> : <FaCheck color='#008001' />}HR</li>
                                {selectedPlanDetails?.details && selectedPlanDetails?.details.length > 0 && (
                                    <>
                                        {selectedPlanDetails?.details.map((detail, index) => (
                                            <li key={index}>
                                                <FaCheck color='#008001' /> {detail}
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        </div>

                        <div className="plan-pricing-options">
                            <div className="subscription-filter">
                                <label htmlFor="subscription-select">Billing Period:</label>
                                <select
                                    id="subscription-select"
                                    value={subscriptionType}
                                    onChange={handleSubscriptionChange}
                                >
                                    <option value="annual">Annual</option>
                                    <option value="three_years">Three Years</option>
                                </select>
                            </div>

                            <div className="price-display">
                                <h3>
                                    ₹ {subscriptionType === 'annual'
                                        ? selectedPlanDetails?.annual_price ?? 0
                                        : selectedPlanDetails?.three_years_price ?? 0}
                                </h3>
                                <p>Billed every {subscriptionType === 'annual' ? 'year' : '3 years'}</p>
                            </div>

                            <button
                                className="btnPrimary confirm-selection"
                                onClick={confirmPackageSelection}
                            >
                                Confirm Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Packages;