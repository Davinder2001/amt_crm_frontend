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
}

// const features = ['Store', 'Catalogue', 'Service', 'Order'];

const Packages: React.FC<PackagesProps> = ({
    plans,
    setSelectedPackageId,
    selectedPackageId,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
}) => {
    const isInitialLoad = useRef(true); // Track initial load
    const { companySlug } = useCompany();

    // Filter plans based on selected category ID
    const filteredPlans = plans.filter((plan) =>
        plan.business_categories.some(
            (category) => category.id === selectedCategoryId
        )
    );

    // Handle category change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = Number(e.target.value);
        setSelectedCategoryId(selectedCategoryId);
        isInitialLoad.current = false; // Mark as user interaction
    };

    // On initial load only: auto-select the first category with available packages
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

            {/* Category Filter Dropdown */}
            <div className="account-packages-header">
                <Link href={`/${companySlug}/my-account`} className='back-button'>
                    <FaArrowLeft size={16} color='#fff' />
                </Link>
                <div className="category-filter" style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
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
                </div>
            </div>

            {/* Display filtered plans or fallback message */}
            <div className="packages-grid">
                {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => {
                        const isSelected = plan.id === selectedPackageId;

                        return (
                            <div key={plan.id} className="package-card">
                                <div className="ribbon">1 Year</div>
                                <h3 className="planPrice">₹ {plan.annual_price ?? 0} / Year</h3>
                                <ul className="features">
                                    <li>✓ {plan.employee_numbers} Employees</li>
                                    <li>✓ {plan.items_number} Items</li>
                                    <li>✓ {plan.daily_tasks_number} Tasks/day</li>
                                    <li>✓ {plan.invoices_number} Invoices</li>
                                    {/* {features.map((feature, i) => (
                                            <li key={i}>✓ {feature}</li>
                                        ))} */}
                                </ul>

                                <div className="pricing-buttons">
                                    <button
                                        className={isSelected ? 'btnPrimary' : 'btnSecondary'}
                                        onClick={() => setSelectedPackageId(plan.id ?? 0)}
                                    >
                                        {isSelected ? 'Selected' : 'Choose Plan'}
                                    </button>
                                    <button className="btnOnline">✓ Online</button>
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
