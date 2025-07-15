// components/cart/BillTab.tsx
'use client';

import React from 'react';

type BillTabProps = {
    baseTotal: number;
    serviceChargeAmountWithGST: number;
    subtotalAfterServiceCharge: number;
    appliedDiscount: number;
    total: string;
    isServiceChargeApplied: boolean;
    serviceChargeType: 'amount' | 'percentage';
    serviceChargePercent: number;
    serviceChargeAmount: number;
    isDiscountApplied: boolean;
    discountType: 'amount' | 'percentage';
    discountPercent: number;
    discountAmount: number;
};

export default function BillTab({
    baseTotal,
    serviceChargeAmountWithGST,
    subtotalAfterServiceCharge,
    appliedDiscount,
    total,
    isServiceChargeApplied,
    serviceChargeType,
    serviceChargePercent,
    serviceChargeAmount,
    isDiscountApplied,
    discountType,
    discountPercent,
    discountAmount
}: BillTabProps) {
    return (
        <div className="bill-section">
            <div className="total-section">
                <div className="total-row">
                    <span>Base Total:</span>
                    <span>₹{baseTotal.toFixed(2)}</span>
                </div>

                {isServiceChargeApplied && (
                    <div className="total-row">
                        <span>
                            Service Charge ({serviceChargeType === 'percentage'
                                ? `${serviceChargePercent}%`
                                : `₹${serviceChargeAmount}`}) + 18% GST:
                        </span>
                        <span>₹{serviceChargeAmountWithGST.toFixed(2)}</span>
                    </div>
                )}

                <div className="total-row subtotal">
                    <span>Subtotal:</span>
                    <span>₹{subtotalAfterServiceCharge.toFixed(2)}</span>
                </div>

                {isDiscountApplied && (
                    <div className="total-row">
                        <span>
                            Discount ({discountType === 'percentage'
                                ? `${discountPercent}%`
                                : `₹${discountAmount}`}):
                        </span>
                        <span>-₹{appliedDiscount.toFixed(2)}</span>
                    </div>
                )}

                <div className="total-row grand-total">
                    <span>Final Cost:</span>
                    <span>₹{total}</span>
                </div>
            </div>
        </div>
    );
}