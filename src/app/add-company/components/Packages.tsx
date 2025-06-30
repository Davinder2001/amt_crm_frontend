'use client';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const LOCAL_STORAGE_KEY = 'addCompanyData';

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

    const filteredPlans = selectedCategoryId
        ? plans.filter((plan) =>
            plan.business_categories.some((category) => category.id === selectedCategoryId)
        )
        : plans;

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        const newCategoryId = selectedId === 0 ? null : selectedId;
        setSelectedCategoryId(newCategoryId);
        isInitialLoad.current = false;

        // Update only the category in storage
        const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storedData = existing ? JSON.parse(existing) : {};
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            ...storedData,
            category_id: newCategoryId
        }));
    };

    const handlePackageSelection = (packageId: number, limitId: number, variantType: string) => {
        const newSelection = { packageId, limitId, variantType };
        setSelectedPackage(newSelection);

        // Find the selected plan to get its category
        const selectedPlan = plans.find(plan => plan.id === packageId);
        const packageCategoryId = selectedPlan?.business_categories?.[0]?.id || null;

        // Store all selection data with the package's actual category
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            packageId,
            limitId,
            variantType,
            category_id: packageCategoryId  // Use the package's category instead of selectedCategoryId
        }));

        // Also update the selected category in state if we were in "All" mode
        if (selectedCategoryId === null && packageCategoryId) {
            setSelectedCategoryId(packageCategoryId);
        }
    };

    useEffect(() => {
        if (isInitialLoad.current && categories.length > 0 && plans.length > 0) {
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