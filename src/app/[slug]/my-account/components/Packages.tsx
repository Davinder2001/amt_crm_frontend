'use client';
import { useCompany } from '@/utils/Company';
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
    subscriptionType: 'monthly' | 'annually' | 'three_years' | null;
    setSubscriptionType: (type: 'monthly' | 'annually' | 'three_years') => void;

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
    const { companySlug } = useCompany();

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
        }
    }, [plans, categories, setSelectedCategoryId]);

    return (
        <div className="account-pricing-container">
            {/* Header */}
            <div className="account-packages-header">
                <Link href={`/${companySlug}`} className="back-button">
                    <FaArrowLeft size={16} color="#fff" />
                </Link>

                <div className="category-filter" style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
                    {/* Category Dropdown */}
                    <label htmlFor="category-select">Filter by Category:</label>
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

                    {/* Subscription Type Dropdown */}
                    <div className="subscription-type" style={{ marginTop: '1rem' }}>
                        <label htmlFor="subscription-select">Select Subscription Type:</label>
                        <select
                            id="subscription-select"
                            value={subscriptionType ?? ''}
                            onChange={(e) =>
                                setSubscriptionType(e.target.value as 'monthly' | 'annually' | 'three_years')
                            }
                        >
                            <option value="">Select Type</option>
                            <option value="monthly">Monthly</option>
                            <option value="annually">Annually</option>
                            <option value="three_years">3 Years</option>
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
                                : subscriptionType === 'annually'
                                    ? plan.annual_price
                                    : plan.three_years_price;


                        return (
                            <div key={plan.id} className="package-card">
                                <div className="ribbon">
                                    {subscriptionType === 'monthly'
                                        ? '1 Month'
                                        : subscriptionType === 'annually'
                                            ? '1 Year'
                                            : '3 Years'}
                                </div>
                                <h3 className="planPrice">
                                    ₹ {price ?? 0} /{' '}
                                    {subscriptionType === 'monthly'
                                        ? 'Month'
                                        : subscriptionType === 'annually'
                                            ? 'Year'
                                            : '3 Years'}
                                </h3>
                                <ul className="features">
                                    <li>✓ {plan.employee_numbers} Employees</li>
                                    <li>✓ {plan.items_number} Items</li>
                                    <li>✓ {plan.daily_tasks_number} Tasks/day</li>
                                    <li>✓ {plan.invoices_number} Invoices</li>
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
