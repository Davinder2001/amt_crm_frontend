'use client';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface PackagesProps {
    plans: PackagePlan[];
    setSelectedPackage: (pkg: SelectedPackage) => void;
    selectedPackage: SelectedPackage | null;
    categories: BusinessCategory[];
    setSelectedCategoryId: (id: number | null) => void;
    selectedCategoryId: number | null;
}

const Packages: React.FC<PackagesProps> = ({
    plans,
    setSelectedPackage,
    selectedPackage,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
}) => {
    const isInitialLoad = useRef(true);

    // Show all packages if no category is selected or filter by selected category
    const filteredPlans = selectedCategoryId
        ? plans.filter((plan) =>
            plan.business_categories.some((category) => category.id === selectedCategoryId)
        )
        : plans;

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        setSelectedCategoryId(selectedId === 0 ? null : selectedId);
        isInitialLoad.current = false;

        if (typeof window !== 'undefined') {
            const existing = localStorage.getItem('addCompany');
            const parsed = existing ? JSON.parse(existing) : {};
            localStorage.setItem('addCompany', JSON.stringify({
                ...parsed,
                category_id: selectedId === 0 ? null : selectedId,
            }));
        }
    };

    const handlePackageSelection = (packageId: number, limitId: number, variantType: string) => {
        setSelectedPackage({ packageId, limitId, variantType });

        if (typeof window !== 'undefined') {
            const existing = localStorage.getItem('addCompany');
            const parsed = existing ? JSON.parse(existing) : {};
            localStorage.setItem('addCompany', JSON.stringify({
                ...parsed,
                packageId,
                limitId,
                variantType,
                // Ensure we store the actual category ID from the selected plan
                category_id: parsed.category_id || plans.find(p => p.id === packageId)?.business_categories[0]?.id || null
            }));
        }
    };

    useEffect(() => {
        if (isInitialLoad.current && categories.length > 0 && plans.length > 0) {
            // Don't set any category by default - show all packages initially
            isInitialLoad.current = false;
        }
    }, [plans, categories]);

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
                            value={selectedCategoryId ?? 0}
                            onChange={handleCategoryChange}
                        >
                            <option value={0}>All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="packages-grid">
                {filteredPlans.length > 0 ? (
                    filteredPlans.flatMap((plan) =>
                        plan.limits?.map((limit) => {
                            const isSelected = selectedPackage?.packageId === plan.id &&
                                selectedPackage?.limitId === limit.id;
                            const price =
                                limit.variant_type === 'monthly' ? plan.monthly_price :
                                    limit.variant_type === 'annual' ? plan.annual_price :
                                        plan.three_years_price;

                            return (
                                <div key={`${plan.id}-${limit.id}`} className="package-card">
                                    <div className="ribbon">
                                        {limit.variant_type === 'monthly' ? 'Monthly' :
                                            limit.variant_type === 'annual' ? 'Annual' : '3 Years'}
                                    </div>
                                    <h3 className="planName">{plan.name}</h3>
                                    <h3 className="planPrice">
                                        ₹ {price ?? 0}
                                    </h3>
                                    <ul className="features">
                                        <li>{limit.employee_numbers} Employees</li>
                                        <li>{limit.items_number} Items</li>
                                        <li>{limit.daily_tasks_number} Tasks/day</li>
                                        <li>{limit.invoices_number} Invoices</li>
                                    </ul>

                                    <div className="pricing-buttons">
                                        <button
                                            type='button'
                                            className={isSelected ? 'btnPrimary' : 'btnSecondary'}
                                            onClick={() => handlePackageSelection(plan.id ?? 0, limit.id, limit.variant_type)}
                                        >
                                            {isSelected ? 'Selected' : 'Choose Plan'}
                                        </button>
                                        <button type='button' className="btnOnline">✓ Online</button>
                                    </div>
                                </div>
                            );
                        })
                    )
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