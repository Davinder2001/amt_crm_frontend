'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    useFetchStoreItemQuery,
    useFetchItemBatchByIdQuery,
} from '@/slices';
import LoadingState from '@/components/common/LoadingState';
import Image from 'next/image';

const ViewBatch = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = Number(params?.id);
    const batchId = Number(searchParams.get('batchId'));

    const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(id);
    const { data: batchResponse, isLoading: isBatchLoading } = useFetchItemBatchByIdQuery(batchId);

    const batch: storeItemBatch | undefined = batchResponse?.batch;

    if (isItemLoading || isBatchLoading) return <LoadingState />;
    if (!item || !batch) return <div className="error-message">Item or Batch not found.</div>;

    const isVariableProduct = batch.product_type === 'variable_product';

    // Calculate expiry status
    const expiryDate = new Date(batch.date_of_expiry ?? '');
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const expiryStatus = daysUntilExpiry <= 0 ? 'Expired' : daysUntilExpiry <= 30 ? 'Expiring Soon' : 'Valid';

    return (
        <div className="batch-dashboard">
            {/* Header Card */}
            <div className="header-card">
                <div className="header-gradient">
                    <div>
                        <h1>{item.name}</h1>
                        <p>Batch ID: #{batch.id}</p>
                    </div>
                    <div>
                        {item.featured_image && (
                            <div className="featured-image">
                                <Image
                                    src={item.featured_image}
                                    alt="Featured"
                                    width={70}
                                    height={70}
                                />
                            </div>
                        )}                    </div>
                </div>
                <div className="stats-grid">
                    <StatCard
                        label="Quantity"
                        value={batch.quantity}
                        icon="📦"
                        variant="blue"
                    />
                    <StatCard
                        label="Status"
                        value={batch.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        icon={batch.quantity > 0 ? "✅" : "⚠️"}
                        variant={batch.quantity > 0 ? "green" : "red"}
                    />
                    <StatCard
                        label="Expiry"
                        value={expiryStatus}
                        icon="⏳"
                        variant={
                            expiryStatus === 'Expired' ? 'red' :
                                expiryStatus === 'Expiring Soon' ? 'orange' :
                                    'green'
                        }
                    />
                    <StatCard
                        label="Product Type"
                        value={batch.product_type?.replace(/_/g, ' ') ?? ''}
                        icon="🏷️"
                        variant="purple"
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="main-grid">
                {/* Pricing Card */}
                <div className="content-card">
                    <div className="card-header">
                        <h2><span className="icon">💰</span>Pricing Information</h2>
                    </div>
                    <div className="card-content">
                        <InfoCard
                            label="Cost Price"
                            value={`₹${batch.cost_price}`}
                            description="Base purchase price per unit"
                        />
                        <InfoCard
                            label="Regular Price"
                            value={`₹${batch.regular_price}`}
                            description="Standard selling price"
                            highlight
                        />
                        <InfoCard
                            label="Sale Price"
                            value={`₹${batch.sale_price}`}
                            description="Discounted selling price"
                        />
                        {batch.price_per_unit && (
                            <InfoCard
                                label="Price Per Unit"
                                value={`₹${batch.price_per_unit}`}
                                description="Price per smallest unit"
                            />
                        )}
                    </div>
                </div>

                {/* Inventory Card */}
                <div className="content-card">
                    <div className="card-header">
                        <h2><span className="icon">📊</span>Inventory Details</h2>
                    </div>
                    <div className="card-content">
                        <InfoCard
                            label="Unit of Measure"
                            value={batch.unit_of_measure}
                        />
                        {batch.units_in_peace && (
                            <InfoCard
                                label="Units in Peace"
                                value={batch.units_in_peace}
                            />
                        )}
                        <InfoCard
                            label="Replacement"
                            value={batch.replacement ? 'Yes' : 'No'}
                            description="Whether replacement is available"
                        />
                        <InfoCard
                            label="Vendor"
                            value={batch.vendor?.vendor_name || 'Not specified'}
                        />
                    </div>
                </div>

                {/* Timeline Card */}
                <div className="content-card">
                    <div className="card-header">
                        <h2><span className="icon">⏳</span>Product Timeline</h2>
                    </div>
                    <div className="card-content">
                        <TimelineCard
                            label="Manufacture Date"
                            value={batch.date_of_manufacture ?? ''}
                            icon="🏭"
                        />
                        <TimelineCard
                            label="Purchase Date"
                            value={batch.purchase_date ?? ''}
                            icon="🛒"
                        />
                        <TimelineCard
                            label="Expiry Date"
                            value={batch.date_of_expiry ?? ''}
                            icon="⚠️"
                            status={expiryStatus}
                        />
                    </div>
                </div>
            </div>

            {/* Additional Details Card */}
            <div className="content-card">
                <div className="card-header">
                    <h2><span className="icon">📋</span>Additional Details</h2>
                </div>
                <div className="details-grid">
                    <DetailCard
                        label="Invoice Number"
                        value={batch.invoice_number || 'Not specified'}
                        icon="🧾"
                    />
                    <DetailCard
                        label="Tax Type"
                        value={batch.tax_type ?? ''}
                        icon="💰"
                    />
                </div>
            </div>

            {/* Variants Section */}
            {isVariableProduct && batch.variants?.length > 0 && (
                <div className="content-card">
                    <div className="card-header">
                        <h2><span className="icon">🧩</span>Product Variants ({batch.variants.length})</h2>
                    </div>
                    <div className="variants-grid">
                        {batch.variants.map((variant: variations, index: number) => (
                            <VariantCard
                                key={variant.id ?? index}
                                variant={variant}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Component for header stat cards
const StatCard = ({ label, value, icon, variant }: {
    label: string;
    value: string | number;
    icon: string;
    variant: string
}) => (
    <div className={`stat-card ${variant}`}>
        <span className="stat-icon">{icon}</span>
        <div>
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
        </div>
    </div>
);

// Component for information cards
const InfoCard = ({ label, value, description, highlight = false }: {
    label: string;
    value: string | number;
    description?: string;
    highlight?: boolean
}) => (
    <div className={`info-card ${highlight ? 'highlight' : ''}`}>
        <p className="info-label">{label}</p>
        <p className="info-value">{value}</p>
        {description && <p className="info-description">{description}</p>}
    </div>
);

// Component for timeline cards
const TimelineCard = ({ label, value, icon, status }: {
    label: string;
    value: string;
    icon: string;
    status?: string;
}) => (
    <div className="timeline-card">
        <span className="timeline-icon">{icon}</span>
        <div>
            <p className="timeline-label">{label}</p>
            <p className="timeline-value">{value}</p>
            {status && (
                <span className={`status-badge ${status === 'Expired' ? 'expired' :
                    status === 'Expiring Soon' ? 'expiring' :
                        'valid'
                    }`}>
                    {status}
                </span>
            )}
        </div>
    </div>
);

// Component for detail cards
const DetailCard = ({ label, value, icon }: {
    label: string;
    value: string | number;
    icon: string
}) => (
    <div className="detail-card">
        <div className="detail-content">
            <span className="detail-icon">{icon}</span>
            <div>
                <p className="detail-label">{label}</p>
                <p className="detail-value">{value}</p>
            </div>
        </div>
    </div>
);

// Component for variant cards
const VariantCard = ({ variant, index }: {
    variant: variations;
    index: number
}) => (
    <div className="variant-card">
        <div className="variant-header">
            <h3>Variant #{index + 1}</h3>
            <span className={`stock-badge ${variant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {variant.stock} in stock
            </span>
        </div>

        {variant.attributes?.length > 0 && (
            <div className="attributes-container">
                {variant.attributes.map((attr, i) => (
                    <span key={i} className="attribute-tag">
                        {attr.attribute}: {attr.value}
                    </span>
                ))}
            </div>
        )}

        <div className="variant-grid">
            <div className="variant-metric blue">
                <p className="metric-label">Regular</p>
                <p className="metric-value">₹{variant.variant_regular_price}</p>
            </div>
            <div className="variant-metric orange">
                <p className="metric-label">Sale</p>
                <p className="metric-value">₹{variant.variant_sale_price}</p>
            </div>
            {variant.variant_price_per_unit && (
                <div className="variant-metric green">
                    <p className="metric-label">Unit Price</p>
                    <p className="metric-value">₹{variant.variant_price_per_unit}</p>
                </div>
            )}
            {variant.variant_units_in_peace && (
                <div className="variant-metric purple">
                    <p className="metric-label">Units/Peace</p>
                    <p className="metric-value">{variant.variant_units_in_peace}</p>
                </div>
            )}
        </div>
    </div>
);

export default ViewBatch;


