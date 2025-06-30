'use client';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Modal from '@/components/common/Modal'; // Make sure you have this component

interface PackagesProps {
    plans: PackagePlan[];
    setSelectedPackage: (pkg: SelectedPackage) => void;
    categories: BusinessCategory[];
    setSelectedCategoryId: (id: number | null) => void;
    selectedCategoryId: number | null;
}

const Packages: React.FC<PackagesProps> = ({
    plans,
    setSelectedPackage,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
}) => {
    const isInitialLoad = useRef(true);
    const [isPackageDetailOpen, setIsPackageDetailOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState<PackagePlan | null>(null);

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
    };

    const handlePackageClick = (plan: PackagePlan) => {
        setCurrentPackage(plan);
        setIsPackageDetailOpen(true);
    };

    const handleSelectPlan = (packageId: number, limitId: number, variantType: string) => {
        const newSelection = { packageId, limitId, variantType };
        setSelectedPackage(newSelection);
        setIsPackageDetailOpen(false);

        // Find the selected plan to get its category
        const selectedPlan = plans.find(plan => plan.id === packageId);
        const packageCategoryId = selectedPlan?.business_categories?.[0]?.id || null;

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

                <div className="category-filter">
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
                    filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className="package-card"
                            onClick={() => handlePackageClick(plan)}
                        >
                            <h3 className="planName">{plan.name}</h3>

                            <div className="price-range">
                                {plan.monthly_price && (
                                    <span>From ₹{plan.monthly_price}/mo</span>
                                )}
                            </div>

                            <ul className="features">
                                <li>{plan.limits?.[0]?.employee_numbers || 'Unlimited'} Employees</li>
                                <li>{plan.limits?.[0]?.items_number || 'Unlimited'} Items</li>
                                <li>Multiple pricing options</li>
                            </ul>

                            <div className="pricing-buttons">
                                <button
                                    type='button'
                                    className="btnSecondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePackageClick(plan);
                                    }}
                                >
                                    View Details
                                </button>
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

            {/* Package Details Modal */}
            <Modal
                isOpen={isPackageDetailOpen}
                onClose={() => setIsPackageDetailOpen(false)}
                title={`Package Details - ${currentPackage?.name || ''}`}
                width="900px"
            >
                {currentPackage && (
                    <div className="package-details">
                        {/* Categories Section */}
                        <div className="detail-section">
                            <h3>Applicable Business Categories</h3>
                            <div className="categories-grid">
                                {currentPackage.business_categories?.map((category) => (
                                    <div key={category.id} className="category-item">
                                        {category.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price and Limits Cards */}
                        <div className="detail-section">
                            <h3>Pricing & Limits</h3>
                            <div className="price-limits-grid">
                                {currentPackage.limits?.map((limit) => {
                                    // Determine which price to show based on variant type
                                    let priceLabel = '';
                                    let priceValue = '';

                                    switch (limit.variant_type) {
                                        case 'monthly':
                                            priceLabel = 'Monthly Price';
                                            priceValue = `₹${Number(currentPackage.monthly_price).toFixed(2)}`;
                                            break;
                                        case 'annual':
                                            priceLabel = 'Annual Price';
                                            priceValue = `₹${Number(currentPackage.annual_price).toFixed(2)}`;
                                            break;
                                        case 'three_years':
                                            priceLabel = 'Three Years Price';
                                            priceValue = `₹${Number(currentPackage.three_years_price).toFixed(2)}`;
                                            break;
                                        default:
                                            priceLabel = 'Price';
                                            priceValue = 'N/A';
                                    }

                                    return (
                                        <div key={limit.id} className="price-limit-card">
                                            <div className="card-header">
                                                <h4>{limit.variant_type.replace('_', ' ').toUpperCase()}</h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="price-section">
                                                    <div className="price-row">
                                                        <span className="price-label">{priceLabel}:</span>
                                                        <span className="price-value">{priceValue}</span>
                                                    </div>
                                                </div>
                                                <div className="limits-section">
                                                    <div className="limit-row">
                                                        <span className="limit-label">Employees:</span>
                                                        <span className="limit-value">{limit.employee_numbers}</span>
                                                    </div>
                                                    <div className="limit-row">
                                                        <span className="limit-label">Items:</span>
                                                        <span className="limit-value">{limit.items_number}</span>
                                                    </div>
                                                    <div className="limit-row">
                                                        <span className="limit-label">Daily Tasks:</span>
                                                        <span className="limit-value">{limit.daily_tasks_number}</span>
                                                    </div>
                                                    <div className="limit-row">
                                                        <span className="limit-label">Invoices:</span>
                                                        <span className="limit-value">{limit.invoices_number}</span>
                                                    </div>
                                                </div>
                                                <div className="select-button-container">
                                                    <button
                                                        className="buttons"
                                                        onClick={() => handleSelectPlan(
                                                            currentPackage.id ?? 0,
                                                            limit.id,
                                                            limit.variant_type
                                                        )}
                                                    >
                                                        Select Plan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Packages;