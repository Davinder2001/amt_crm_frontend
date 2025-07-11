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
    subscriptionType: 'monthly' | 'annual';
    setSubscriptionType: (type: 'monthly' | 'annual') => void;
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
        plan.business_categories.some((category) => category.id === selectedCategoryId)
    );

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        setSelectedCategoryId(selectedId);
        isInitialLoad.current = false;
    };

    const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'monthly' | 'annual';
        setSubscriptionType(newType);
    };

    const handlePackageSelection = (packageId: number) => {
        setSelectedPackageId(packageId);
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
            <div className="account-packages-header">
                <Link href="/" className="back-button">
                    <FaArrowLeft size={16} color="#fff" />
                </Link>

                <div className="filters">
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

                    <div className="filter-group">
                        <label htmlFor="subscription-select">Billing:</label>
                        <select
                            id="subscription-select"
                            value={subscriptionType}
                            onChange={handleSubscriptionChange}
                        >
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annually</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="packages-grid">
                {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => {
                        const isSelected = plan.id === selectedPackageId;
                        const price = subscriptionType === 'monthly'
                            ? plan.annual_price
                            : plan.three_years_price;

                        return (
                            <div key={plan.id} className="package-card">
                                <div className="ribbon">
                                    {subscriptionType === 'monthly' ? '1 Month' : '1 Year'}
                                </div>
                                <h3 className="planPrice">
                                    ₹ {price ?? 0} / {subscriptionType === 'monthly' ? 'Month' : 'Year'}
                                </h3>
                                <div className="pricing-buttons">
                                    <button
                                        type='button'
                                        className={isSelected ? 'btnPrimary' : 'btnSecondary'}
                                        onClick={() => handlePackageSelection(plan.id ?? 0)}
                                    >
                                        {isSelected ? 'Selected' : 'Choose Plan'}
                                    </button>
                                    <button type='button' className="btnOnline">✓ Online</button>
                                </div>
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