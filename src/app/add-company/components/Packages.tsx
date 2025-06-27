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
    subscriptionType: 'monthly' | 'annual' | null;
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

        if (typeof window !== 'undefined') {
            const existing = localStorage.getItem('addCompany');
            const parsed = existing ? JSON.parse(existing) : {};
            localStorage.setItem('addCompany', JSON.stringify({
                ...parsed,
                category_id: selectedId,
            }));
        }
    };

    const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'monthly' | 'annual';
        setSubscriptionType(newType);

        if (typeof window !== 'undefined') {
            const existing = localStorage.getItem('addCompany');
            const parsed = existing ? JSON.parse(existing) : {};
            localStorage.setItem('addCompany', JSON.stringify({
                ...parsed,
                subscription_type: newType,
            }));
        }
    };

    const handlePackageSelection = (packageId: number) => {
        setSelectedPackageId(packageId);

        if (typeof window !== 'undefined') {
            const existing = localStorage.getItem('addCompany');
            const parsed = existing ? JSON.parse(existing) : {};
            localStorage.setItem('addCompany', JSON.stringify({
                ...parsed,
                package_id: packageId,
            }));
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

            if (!subscriptionType) {
                setSubscriptionType('monthly');
            }

            isInitialLoad.current = false;
        }
    }, [plans, categories, subscriptionType, setSelectedCategoryId, setSubscriptionType]);

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
                            value={subscriptionType ?? ''}
                            onChange={handleSubscriptionChange}
                        >
                            <option value="">Select Type</option>
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
                            ? plan.monthly_price
                            : plan.annual_price;

                        return (
                            <div key={plan.id} className="package-card">
                                <div className="ribbon">
                                    {subscriptionType === 'monthly' ? '1 Month' : '1 Year'}
                                </div>
                                <h3 className="planPrice">
                                    ₹ {price ?? 0} / {subscriptionType === 'monthly' ? 'Month' : 'Year'}
                                </h3>
                                <ul className="features">
                                    {/* <li>{plan.employee_numbers} Employees</li>
                                    <li>{plan.items_number} Items</li>
                                    <li>{plan.daily_tasks_number} Tasks/day</li>
                                    <li>{plan.invoices_number} Invoices</li> */}
                                </ul>

                                <div className="pricing-buttons">
                                    <button
                                    type='button'
                                        className={isSelected ? 'btnPrimary' : 'btnSecondary'}
                                        onClick={() => handlePackageSelection(plan.id ?? 0)}
                                        disabled={!subscriptionType}
                                    >
                                        {isSelected ? 'Selected' : 'Choose Plan'}
                                    </button>
                                    <button type='button' className="btnOnline">✓ Online</button>
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