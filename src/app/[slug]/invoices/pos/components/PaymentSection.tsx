// components/cart/PaymentSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';

type PaymentSectionProps = {
    showPaymentDetails: boolean;
    setShowPaymentDetails: React.Dispatch<React.SetStateAction<boolean>>;
    total: string;
    isServiceChargeApplied: boolean;
    setIsServiceChargeApplied: React.Dispatch<React.SetStateAction<boolean>>;
    serviceChargeType: 'amount' | 'percentage';
    setServiceChargeType: React.Dispatch<React.SetStateAction<'amount' | 'percentage'>>;
    serviceChargeAmount: number;
    setServiceChargeAmount: React.Dispatch<React.SetStateAction<number>>;
    serviceChargePercent: number;
    setServiceChargePercent: React.Dispatch<React.SetStateAction<number>>;
    isDiscountApplied: boolean;
    setIsDiscountApplied: React.Dispatch<React.SetStateAction<boolean>>;
    discountType: 'amount' | 'percentage';
    setDiscountType: React.Dispatch<React.SetStateAction<'amount' | 'percentage'>>;
    discountAmount: number;
    setDiscountAmount: React.Dispatch<React.SetStateAction<number>>;
    discountPercent: number;
    setDiscountPercent: React.Dispatch<React.SetStateAction<number>>;
    paymentMethod: '' | 'cash' | 'online' | 'card' | 'credit' | 'self';
    setPaymentMethod: React.Dispatch<React.SetStateAction<'' | 'cash' | 'online' | 'card' | 'credit' | 'self'>>;
    BankAccountList: BankAccount[]; // Replace with proper type
    selectedBankAccount: number | null;
    setSelectedBankAccount: React.Dispatch<React.SetStateAction<number | null>>;
    companySlug: string;
    creditPaymentType: 'full' | 'partial';
    setCreditPaymentType: React.Dispatch<React.SetStateAction<'full' | 'partial'>>;
    partialAmount: number;
    setPartialAmount: React.Dispatch<React.SetStateAction<number>>;
    creditNote: string;
    setCreditNote: (value: string) => void;
};

export default function PaymentSection({
    showPaymentDetails,
    setShowPaymentDetails,
    total,
    isServiceChargeApplied,
    setIsServiceChargeApplied,
    serviceChargeType,
    setServiceChargeType,
    serviceChargeAmount,
    setServiceChargeAmount,
    serviceChargePercent,
    setServiceChargePercent,
    isDiscountApplied,
    setIsDiscountApplied,
    discountType,
    setDiscountType,
    discountAmount,
    setDiscountAmount,
    discountPercent,
    setDiscountPercent,
    paymentMethod,
    setPaymentMethod,
    BankAccountList,
    selectedBankAccount,
    setSelectedBankAccount,
    companySlug,
    creditPaymentType,
    setCreditPaymentType,
    partialAmount,
    setPartialAmount,
    creditNote,
    setCreditNote
}: PaymentSectionProps) {
    return (
        <>
            <div className="toggle-total-outer">
                <div
                    className="sectionToggle"
                    onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                >
                    <span>{showPaymentDetails ? '-' : '+'}</span>
                    <span>Payments & Discount</span>
                </div>
                <div className="total">
                    Final Cost:{' '}
                    <strong>
                        ₹
                        {total}
                    </strong>
                </div>
            </div>

            {showPaymentDetails && (
                <div className="payment-section">
                    <div className="section-group">
                        <div className="options-row" style={{ marginBottom: 5 }}>
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isServiceChargeApplied}
                                    onChange={(e) => setIsServiceChargeApplied(e.target.checked)}
                                />
                                <span className="checkmark" />
                                <div className="section-title" style={{ margin: 0 }}>Service Charges*</div>
                            </label>
                        </div>

                        {isServiceChargeApplied && (
                            <div className="discount-input-container" style={{ marginBottom: 10 }}>
                                <div className="options-row">
                                    <label className="custom-radio">
                                        <input
                                            type="radio"
                                            name="serviceChargeType"
                                            value="amount"
                                            checked={serviceChargeType === 'amount'}
                                            onChange={() => setServiceChargeType('amount')}
                                        />
                                        <span className="radiomark" />
                                        Fixed Amount
                                    </label>

                                    <label className="custom-radio">
                                        <input
                                            type="radio"
                                            name="serviceChargeType"
                                            value="percentage"
                                            checked={serviceChargeType === 'percentage'}
                                            onChange={() => setServiceChargeType('percentage')}
                                        />
                                        <span className="radiomark" />
                                        Percentage
                                    </label>
                                </div>

                                {serviceChargeType === 'amount' ? (
                                    <input
                                        type="number"
                                        value={serviceChargeAmount === 0 ? '' : serviceChargeAmount}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setServiceChargeAmount(isNaN(val) ? 0 : val);
                                        }}
                                        placeholder="Enter service charge amount"
                                        min={0}
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    />

                                ) : (
                                    <input
                                        type="number"
                                        value={serviceChargePercent === 0 ? '' : serviceChargePercent}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setServiceChargePercent(isNaN(val) ? 0 : val);
                                        }}
                                        placeholder="Enter service charge %"
                                        min={0}
                                        max={100}
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="section-group">
                        <div className="options-row">
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isDiscountApplied}
                                    onChange={(e) => setIsDiscountApplied(e.target.checked)}
                                />
                                <span className="checkmark" />
                                <div className="section-title" style={{ margin: 0 }}> Discount*</div>
                            </label>
                        </div>
                    </div>
                    {isDiscountApplied && (
                        <div className="discount-input-container">
                            <label>Discount Type</label>
                            <div className="options-row">
                                <label className="custom-radio">
                                    <input
                                        type="checkbox"
                                        name="discountType"
                                        value="amount"
                                        checked={discountType === 'amount'}
                                        onChange={() => setDiscountType('amount')}
                                    />
                                    <span className="radiomark" />
                                    Fixed Amount
                                </label>

                                <label className="custom-radio">
                                    <input
                                        type="checkbox"
                                        name="discountType"
                                        value="percentage"
                                        checked={discountType === 'percentage'}
                                        onChange={() => setDiscountType('percentage')}
                                    />
                                    <span className="radiomark" />
                                    Percentage
                                </label>
                            </div>

                            {discountType === 'amount' ? (
                                <input
                                    type="number"
                                    value={discountAmount === 0 ? '' : discountAmount}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setDiscountAmount(isNaN(val) ? 0 : val);
                                    }}
                                    placeholder="Enter discount amount"
                                    min={0}
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                />
                            ) : (
                                <input
                                    type="number"
                                    value={discountPercent === 0 ? '' : discountPercent}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setDiscountPercent(isNaN(val) ? 0 : val);
                                    }}
                                    placeholder="Enter discount %"
                                    min={0}
                                    max={100}
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                />
                            )}
                        </div>
                    )}

                    <div className="section-group">
                        <div className="section-title">Payment Method*</div>
                        <div className="options-row">
                            <label className="custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                />
                                <span className="radiomark" />
                                Cash
                            </label>

                            <label className="custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={() => setPaymentMethod('online')}
                                />
                                <span className="radiomark" />
                                Online
                            </label>

                            {paymentMethod === 'online' && BankAccountList && BankAccountList.length > 0 && (
                                <div className="bank-account-selection" style={{ width: '100%', marginTop: '10px' }}>
                                    <label>Select Bank Account*</label>
                                    <select
                                        value={selectedBankAccount || ''}
                                        onChange={(e) => setSelectedBankAccount(Number(e.target.value) || null)}
                                        required
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    >
                                        <option value="">Select Bank Account</option>
                                        {BankAccountList.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.bank_name} - {account.account_number} ({account.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {paymentMethod === 'online' && (!BankAccountList || BankAccountList.length === 0) && (
                                <div style={{ color: 'red', marginTop: '10px' }}>
                                    No bank accounts available. Please add <Link href={`/${companySlug}/settings#bank-accounts`}>bank accounts in</Link> settings.
                                </div>
                            )}

                            <label className="custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <span className="radiomark" />
                                Card
                            </label>

                            <label className="custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'self'}
                                    onChange={() => setPaymentMethod('self')}
                                />
                                <span className="radiomark" />
                                Self consumption
                            </label>

                            <label className="custom-radio">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="credit"
                                    checked={paymentMethod === 'credit'}
                                    onChange={() => setPaymentMethod('credit')}
                                />
                                <span className="radiomark" />
                                Credit
                            </label>

                            {paymentMethod === 'credit' && (
                                <div className="credit-options" style={{ width: '100%' }}>
                                    <div className="options-row">
                                        <label className="custom-radio">
                                            <input
                                                type="radio"
                                                name="creditPaymentType"
                                                value="full"
                                                checked={creditPaymentType === 'full'}
                                                onChange={() => setCreditPaymentType('full')}
                                            />
                                            <span className="radiomark" />
                                            Full Payment
                                        </label>

                                        <label className="custom-radio">
                                            <input
                                                type="radio"
                                                name="creditPaymentType"
                                                value="partial"
                                                checked={creditPaymentType === 'partial'}
                                                onChange={() => setCreditPaymentType('partial')}
                                            />
                                            <span className="radiomark" />
                                            Partial Payment
                                        </label>
                                    </div>

                                    {creditPaymentType === 'partial' && (
                                        <div className="form-group" style={{ marginTop: 10 }}>
                                            <input
                                                type="number"
                                                value={partialAmount === 0 ? '' : partialAmount}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setPartialAmount(isNaN(val) ? 0 : val);
                                                }}
                                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                                placeholder="Enter partial payment amount"
                                                min={0}
                                                max={parseFloat(total)}
                                            />
                                        </div>
                                    )}

                                    <div className="form-group" style={{ marginTop: 10 }}>
                                        <label>Credit Note (Optional)</label>
                                        <textarea
                                            value={creditNote}
                                            onChange={(e) => setCreditNote(e.target.value)}
                                            placeholder="Enter any notes about this credit transaction"
                                            rows={3}
                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}