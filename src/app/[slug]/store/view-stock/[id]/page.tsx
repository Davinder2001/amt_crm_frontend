'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    useFetchStoreItemQuery,
    useFetchItemBatchByIdQuery,
} from '@/slices';
import LoadingState from '@/components/common/LoadingState';

const ViewBatch = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = Number(params?.id);
    const batchId = Number(searchParams.get('batchId'));

    const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(id);
    const { data: batchResponse, isLoading: isBatchLoading } = useFetchItemBatchByIdQuery(batchId);

    const batch: storeItemBatch | undefined = batchResponse?.batch;

    if (isItemLoading || isBatchLoading) return <LoadingState />;
    if (!item || !batch) return <div className="text-red-500 p-4">Item or Batch not found.</div>;

    const isVariableProduct = batch.product_type === 'variable_product';

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Batch Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Item Name" value={item.name} />
                <Detail label="Batch ID" value={batch.id} />
                <Detail label="Product Type" value={batch.product_type} />
                <Detail label="Cost Price" value={`₹${batch.cost_price}`} />
                <Detail label="Quantity" value={batch.quantity} />
                <Detail label="Purchase Date" value={batch.purchase_date} />
                <Detail label="Manufacture Date" value={batch.date_of_manufacture} />
                <Detail label="Expiry Date" value={batch.date_of_expiry} />
                <Detail label="Invoice Number" value={batch.invoice_number || '-'} />
                <Detail label="Tax Type" value={batch.tax_type} />
                <Detail label="Unit of Measure" value={batch.unit_of_measure} />
                {batch.units_in_peace && <Detail label="Units in Peace" value={batch.units_in_peace} />}
                {batch.price_per_unit && <Detail label="Price Per Unit" value={`₹${batch.price_per_unit}`} />}
                <Detail label="Regular Price" value={`₹${batch.regular_price}`} />
                <Detail label="Sale Price" value={`₹${batch.sale_price}`} />
                <Detail label="Replacement" value={batch.replacement} />
                <Detail label="Vendor" value={batch.vendor?.vendor_name ?? 'N/A'} />
            </div>

            {isVariableProduct && batch.variants?.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mt-8 mb-2">Variants</h2>
                    <div className="space-y-4">
                        {batch.variants.map((variant: variations, index: number) => (
                            <div key={variant.id ?? index} className="border p-4 rounded shadow-sm">
                                <p className="font-semibold">Variant #{index + 1}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <Detail label="Regular Price" value={`₹${variant.variant_regular_price}`} />
                                    <Detail label="Sale Price" value={`₹${variant.variant_sale_price}`} />
                                    <Detail label="Stock" value={variant.stock} />
                                    {variant.variant_units_in_peace && (
                                        <Detail label="Units in Peace" value={variant.variant_units_in_peace} />
                                    )}
                                    {variant.variant_price_per_unit && (
                                        <Detail
                                            label="Price Per Unit"
                                            value={`₹${variant.variant_price_per_unit}`}
                                        />
                                    )}
                                    {variant.attributes?.map((attr, i) => (
                                        <Detail key={i} label={attr.attribute} value={attr.value} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Detail = ({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) => (
    <div>
        <span className="block text-gray-600 text-sm">{label}</span>
        <span className="text-base font-medium">{value ?? '-'}</span>
    </div>
);

export default ViewBatch;
