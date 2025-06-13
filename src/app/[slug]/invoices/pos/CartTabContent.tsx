'use client';

import { useFetchCompanyAccountsQuery } from '@/slices/company/companyApi';
import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import { useFetchStoreQuery } from '@/slices/store/storeApi';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaTimes, FaWhatsapp } from 'react-icons/fa';
import { FiTrash2, FiShoppingCart, FiList, FiUser, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

type CartTabContentProps = {
    activeTab: TabType;
    cart: CartItem[];
    onQtyChange: (itemId: number, delta: number) => void;
    onRemoveItem: (itemId: number) => void;
    onClearCart: () => void;
    handleSave: () => void;
    isSaving: boolean;
    handlePrint: () => void;
    isPrinting: boolean;
    handleSendWhatsapp: () => void;
    isSendWhatsapp: boolean;
    clientName: string;
    setClientName: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    number: string;
    setNumber: React.Dispatch<React.SetStateAction<string>>;
    discountAmount: number;
    setDiscountAmount: React.Dispatch<React.SetStateAction<number>>;
    discountPercent: number;
    setDiscountPercent: React.Dispatch<React.SetStateAction<number>>;
    discountType: 'amount' | 'percentage';
    setDiscountType: React.Dispatch<React.SetStateAction<'amount' | 'percentage'>>;
    paymentMethod: '' | 'cash' | 'online' | 'card' | 'credit' | 'self';
    serviceChargeAmount: number;
    setServiceChargeAmount: React.Dispatch<React.SetStateAction<number>>;
    serviceChargeType: 'amount' | 'percentage';
    setServiceChargeType: React.Dispatch<React.SetStateAction<'amount' | 'percentage'>>;
    serviceChargePercent: number;
    setServiceChargePercent: React.Dispatch<React.SetStateAction<number>>;
    setPaymentMethod: React.Dispatch<React.SetStateAction<'' | 'cash' | 'online' | 'card' | 'credit' | 'self'>>;
    creditPaymentType: 'full' | 'partial';
    setCreditPaymentType: React.Dispatch<React.SetStateAction<'full' | 'partial'>>;
    partialAmount: number;
    setPartialAmount: React.Dispatch<React.SetStateAction<number>>;
    creditNote: string;
    setCreditNote: (value: string) => void;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    pincode: string;
    setPincode: React.Dispatch<React.SetStateAction<string>>;
    deliveryCharge: number;
    setDeliveryCharge: React.Dispatch<React.SetStateAction<number>>;
    selectedBankAccount: number | null;
    setSelectedBankAccount: React.Dispatch<React.SetStateAction<number | null>>;
};

type InnerTabType = 'Items' | 'Client' | 'Bill';

export default function CartTabContent({
    activeTab, cart, onQtyChange,
    onRemoveItem, onClearCart,
    handleSave, isSaving,
    handlePrint, isPrinting,
    handleSendWhatsapp, isSendWhatsapp,
    clientName, setClientName,
    email, setEmail,
    number, setNumber,
    discountAmount, setDiscountAmount,
    paymentMethod, setPaymentMethod,
    discountType, setDiscountType,
    discountPercent, setDiscountPercent,
    address, setAddress,
    pincode, setPincode,
    deliveryCharge, setDeliveryCharge,
    serviceChargeAmount, setServiceChargeAmount,
    serviceChargePercent, setServiceChargePercent,
    serviceChargeType, setServiceChargeType,
    creditPaymentType, setCreditPaymentType,
    partialAmount, setPartialAmount,
    creditNote, setCreditNote,
    selectedBankAccount, setSelectedBankAccount,

}: CartTabContentProps) {
    const [activeInnerTab, setActiveInnerTab] = useState<InnerTabType>('Client');
    const [showPaymentDetails, setShowPaymentDetails] = useState(true);
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
    const [isServiceChargeApplied, setIsServiceChargeApplied] = useState(false);
    const { data: customers } = useFetchAllCustomersQuery();
    const { data: storeData } = useFetchStoreQuery();
    const { data } = useFetchCompanyAccountsQuery();
    const BankAccountList = data?.accounts;
    console.log('bank accounts', BankAccountList);
    const { companySlug } = useCompany();


    // Calculate base total (sum of all items)
    const baseTotal = cart.reduce((sum, i) => sum + i.quantity * i.final_cost, 0);

    // Calculate service charge (with 18% GST if applied)
    let serviceChargeAmountWithGST = 0;
    if (isServiceChargeApplied) {
        const serviceChargeBeforeGST = serviceChargeType === 'percentage'
            ? (baseTotal * serviceChargePercent) / 100
            : serviceChargeAmount;

        // Add 18% GST to service charge
        serviceChargeAmountWithGST = serviceChargeBeforeGST * 1.18;
    }

    // Calculate subtotal after service charge
    const subtotalAfterServiceCharge = baseTotal + serviceChargeAmountWithGST;

    // Calculate discount (without GST)
    const appliedDiscount = isDiscountApplied
        ? discountType === 'percentage'
            ? (subtotalAfterServiceCharge * discountPercent) / 100
            : Math.min(discountAmount, subtotalAfterServiceCharge) // Ensure discount doesn't make total negative
        : 0;

    // Final total
    const total = Math.max(0, subtotalAfterServiceCharge - appliedDiscount).toFixed(2);

    const innerTabs: InnerTabType[] = ['Client', 'Items', 'Bill'];

    const handleNumberBlur = () => {
        if (!number || !customers?.customers) return;
        const matchedCustomer = customers.customers.find((cust: Customer) => cust.number === number);
        if (matchedCustomer) {
            setClientName(matchedCustomer.name);
            setEmail(matchedCustomer.email || '');
            toast.success(`Customer "${matchedCustomer.name}" found and autofilled!`);
        }
    };

    const validateFields = (): boolean => {
        if (cart.length === 0) {
            setActiveInnerTab('Client');
            toast.error('Please fill in required client details.');

            return false;
        }

        if (!number || !clientName) {
            setActiveInnerTab('Items');
            toast.error('Cart is empty. Please add at least one item.');
            return false;
        }

        // Check for address if Delivery or Pickup tab is active
        if ((activeTab === 'Delivery' || activeTab === 'Pickup') && !address.trim()) {
            setActiveInnerTab('Client');
            toast.error(
                activeTab === 'Delivery'
                    ? 'Please provide a delivery address.'
                    : 'Please provide pickup location.'
            );
            return false;
        }

        // Check for pincode if the Delivery tab is active
        if (activeTab === 'Delivery' && !pincode.trim()) {
            setActiveInnerTab('Client');
            toast.error('Please provide a pincode.');
            return false;
        }

        // Ensure payment method is selected
        if (!paymentMethod) {
            setShowPaymentDetails(true);
            toast.error('Please select a payment method.');
            return false;
        }

        if (paymentMethod === 'online' && !selectedBankAccount) {
            setShowPaymentDetails(true);
            toast.error('Please select a bank account for online payment.');
            return false;
        }

        // Credit payment specific validation
        if (paymentMethod === 'credit') {
            if (creditPaymentType === 'partial') {
                // Only validate partial amount if partial payment is selected
                if (!partialAmount || partialAmount <= 0) {
                    setShowPaymentDetails(true);
                    toast.error('Please specify a valid partial payment amount.');
                    return false;
                }
                if (partialAmount > parseFloat(total)) {
                    setShowPaymentDetails(true);
                    toast.error('Partial amount cannot be greater than total amount.');
                    return false;
                }
            }
        }

        return true;
    };

    const handleClearAll = () => {
        onClearCart();
        setClientName('');
        setEmail('');
        setNumber('');
        setDiscountAmount(0);
        setDiscountPercent(0);
        setDiscountType('amount');
        setIsDiscountApplied(false);
        setActiveInnerTab('Client')
        setPaymentMethod('')
        setAddress('');
        setPincode('');
        setDeliveryCharge(0);
        setServiceChargeType('amount');
        setServiceChargeAmount(0);
        setServiceChargePercent(0);
        setPartialAmount(0);
        setCreditPaymentType('full');
    };

    return (
        <div className="cart-tab-content">
            {/* Nested Tab Bar */}
            <div className="inner-tabs">
                {innerTabs.map(tab => {
                    let Icon;
                    switch (tab) {
                        case 'Client':
                            Icon = FiUser;
                            break;
                        case 'Items':
                            Icon = FiList;
                            break;
                        case 'Bill':
                            Icon = FiFileText;
                            break;
                        default:
                            Icon = null;
                    }
                    return (
                        <button
                            key={tab}
                            className={`inner-tab ${activeInnerTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveInnerTab(tab)}
                        >
                            {Icon && <Icon style={{ marginRight: 6, fontSize: 16 }} />}
                            {tab}
                        </button>
                    )
                })}
                <button className="inner-tab danger" onClick={handleClearAll}>
                    <FiTrash2 style={{ marginRight: 5 }} />
                    <span>Clear All</span>
                </button>
            </div>

            {/* Inner Tab Content */}
            <div className="inner-tab-content">

                {activeInnerTab === 'Items' && (
                    <>
                        {cart.length > 0 ? (
                            <>
                                <div className="cart-items-list">
                                    {cart.map(item => (
                                        <div key={item.id} className="cart-item-row">

                                            <div className="item-image-container">
                                                {/* Placeholder for item image - you can replace with actual image */}
                                                <div className="item-image-placeholder">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            <div className="item-details">
                                                <div className="item-header">
                                                    <span className="item-name">{item.name}</span>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => onRemoveItem(item.id)}
                                                        title="Remove"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>

                                                <div className="item-controls">
                                                    <div className="quantity-control">
                                                        <button
                                                            className="item-quantity-btn"
                                                            onClick={() => onQtyChange(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            −
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button
                                                            className="item-quantity-btn"
                                                            onClick={() => onQtyChange(item.id, 1)}
                                                            disabled={(() => {
                                                                const storeItem = storeData?.find((s: StoreItem) => s.id === item.id);
                                                                return storeItem ? item.quantity >= storeItem.quantity_count : false;
                                                            })()}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="item-price">₹{item.quantity * item.final_cost}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="empty-cart-message">
                                <FiShoppingCart size={80} color="#ccc" />
                                <p>Your cart is empty</p>
                            </div>
                        )}
                    </>
                )}

                {activeInnerTab === 'Client' && (
                    <div className="client-form" >
                        <div className="form-group">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={number}
                                    onChange={(e) => {
                                        const digitsOnly = e.target.value.replace(/\D/g, '');
                                        if (digitsOnly.length <= 10) {
                                            setNumber(digitsOnly);
                                        }
                                    }}
                                    onBlur={handleNumberBlur}
                                    placeholder="Enter 10-digit phone number"
                                    required
                                    maxLength={10}
                                    pattern="\d{10}"
                                />
                            </div>
                            <label>Client Name</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => {
                                    const textOnly = e.target.value.replace(/[^a-zA-Z\s\-'.]/g, '');
                                    setClientName(textOnly);
                                }}
                                placeholder="Enter client name"
                                required
                                pattern="[A-Za-z\s\-'.]+"
                                title="Only letters, spaces, hyphens, apostrophes, and periods are allowed"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email (optional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                            />
                        </div>
                        {activeTab !== 'Cart' &&
                            <>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        placeholder="Enter pincode"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Delivery Charge</label>
                                    <input
                                        type="number"
                                        value={deliveryCharge === 0 ? '' : deliveryCharge}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setDeliveryCharge(isNaN(val) ? 0 : val);
                                        }}
                                        placeholder="Enter delivery charge"
                                        min={0}
                                    />
                                </div>
                            </>
                        }
                    </div>
                )}

                {activeInnerTab === 'Bill' && (
                    <div className="bill-section" >
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
                )}

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
                                            max={baseTotal}
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
                                        max={baseTotal}
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
                                                    onWheel={(e) => (e.target as HTMLInputElement).blur()} // This will remove focus when scrolling
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

                <div className="actions" >
                    <button
                        className="btn"
                        onClick={() => {
                            if (!validateFields()) return;
                            handleSave();
                        }}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>

                    <button
                        className="btn"
                        onClick={() => {
                            if (!validateFields()) return;
                            handlePrint();
                        }}
                        disabled={isPrinting}
                    >
                        {isPrinting ? 'Printing...' : 'Save & Print'}
                    </button>

                    <button
                        className="btn"
                        onClick={() => {
                            if (!validateFields()) return;
                            handleSendWhatsapp();
                        }}
                        disabled={isSendWhatsapp}
                    >
                        {isSendWhatsapp ? 'Sending...' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>Save & <FaWhatsapp /></span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
