'use client';

import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import { useFetchStoreQuery } from '@/slices/store/storeApi';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FiTrash2, FiShoppingCart, FiList, FiUser } from 'react-icons/fi';
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
    handleMail: () => void;
    isMailing: boolean;
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
    paymentMethod: '' | 'cash' | 'online' | 'card' | 'credit';
    serviceChargeAmount: number;
    setServiceChargeAmount: React.Dispatch<React.SetStateAction<number>>;
    serviceChargeType: 'amount' | 'percentage';
    setServiceChargeType: React.Dispatch<React.SetStateAction<'amount' | 'percentage'>>;
    serviceChargePercent: number;
    setServiceChargePercent: React.Dispatch<React.SetStateAction<number>>;
    setPaymentMethod: React.Dispatch<React.SetStateAction<'' | 'cash' | 'online' | 'card' | 'credit'>>;
    creditPaymentType: 'full' | 'partial';
    setCreditPaymentType: React.Dispatch<React.SetStateAction<'full' | 'partial'>>;
    partialAmount: number;
    setPartialAmount: React.Dispatch<React.SetStateAction<number>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    pincode: string;
    setPincode: React.Dispatch<React.SetStateAction<string>>;
    deliveryCharge: number;
    setDeliveryCharge: React.Dispatch<React.SetStateAction<number>>;
};

type InnerTabType = 'Items' | 'Client';

export default function CartTabContent({
    activeTab, cart, onQtyChange,
    onRemoveItem, onClearCart,
    handleSave, isSaving,
    handlePrint, isPrinting,
    handleMail, isMailing,
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

}: CartTabContentProps) {
    const [activeInnerTab, setActiveInnerTab] = useState<InnerTabType>('Items');
    const [showPaymentDetails, setShowPaymentDetails] = useState(true);
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
    const [isServiceChargeApplied, setIsServiceChargeApplied] = useState(false);
    const { data: customers } = useFetchAllCustomersQuery();
    const { data: storeData } = useFetchStoreQuery();

    const baseTotal = cart.reduce((sum, i) => sum + i.quantity * i.final_cost, 0);
    // const total = Math.max(0, baseTotal - (isDiscountApplied ? discountAmount : 0));

    const appliedDiscount = isDiscountApplied
        ? discountType === 'percentage'
            ? (baseTotal * discountPercent) / 100
            : discountAmount
        : 0;

    const total = (Math.max(0, baseTotal - appliedDiscount)).toFixed(2);


    const innerTabs: InnerTabType[] = ['Items', 'Client'];

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
            setActiveInnerTab('Items');
            toast.error('Cart is empty. Please add at least one item.');
            return false;
        }

        if (!number || !clientName) {
            setActiveInnerTab('Client');
            toast.error('Please fill in required client details.');
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
        setActiveInnerTab('Items')
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
                        case 'Items':
                            Icon = FiList;
                            break;
                        case 'Client':
                            Icon = FiUser;
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
                    Clear All
                </button>
            </div>

            {/* Inner Tab Content */}
            <div className="inner-tab-content">

                {activeInnerTab === 'Items' && (
                    <>
                        {cart.length > 0 ? (
                            <>
                                <div className="cart-labels">
                                    <span className="label-name">Item</span>
                                    <span className="label-quantity">Qty</span>
                                    <span className="label-price">Price</span>
                                </div>
                                <div className="cart-items-list">
                                    {cart.map(item => (
                                        <div key={item.id} className="cart-item-row">
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => onRemoveItem(item.id)}>
                                                    <FaTimes />
                                                </button>
                                            </div>

                                            <div className="item-quantity">
                                                <button
                                                    className="item-quantity-btn"
                                                    onClick={() => onQtyChange(item.id, -1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    className="item-quantity-btn"
                                                    onClick={() => onQtyChange(item.id, 1)}
                                                    disabled={
                                                        (() => {
                                                            const storeItem = storeData?.find((s: StoreItem) => s.id === item.id);
                                                            return storeItem ? item.quantity >= storeItem.quantity_count : false;
                                                        })()
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="item-price">
                                                ₹{item.quantity * item.final_cost}
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
                    <div className="client-form" style={{ padding: '10px' }}>
                        <div className="form-group">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder="Enter phone number"
                                    onBlur={handleNumberBlur}
                                    required
                                />
                            </div>
                            <label>Client Name</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Enter client name"
                                required
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

                <div className="toggle-total-outer">
                    <div
                        className="sectionToggle"
                        onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                    >
                        <span>{showPaymentDetails ? '▼' : '▲'}</span>
                        <span>Payments & Discount</span>
                    </div>
                    <div className="total">
                        Total:{' '}
                        <strong>
                            ₹{total}
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
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="section-group">
                            <div className="section-title">Discount Options*</div>
                            <div className="options-row">
                                <label className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={isDiscountApplied}
                                        onChange={(e) => setIsDiscountApplied(e.target.checked)}
                                    />
                                    <span className="checkmark" />
                                    Discount
                                </label>
                                <label className="custom-checkbox">
                                    <input type="checkbox" />
                                    <span className="checkmark" />
                                    Complimentary
                                </label>
                            </div>
                        </div>
                        {isDiscountApplied && (
                            <div className="discount-input-container">
                                <label>Discount Type</label>
                                <div className="options-row">
                                    <label className="custom-radio">
                                        <input
                                            type="radio"
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
                                            type="radio"
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
                                        value="credit"
                                        checked={paymentMethod === 'credit'}
                                        onChange={() => setPaymentMethod('credit')}
                                    />
                                    <span className="radiomark" />
                                    Credit
                                </label>

                                {paymentMethod === 'credit' && (
                                    <div className="credit-options" style={{ marginTop: 10 }}>
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
                                                    placeholder="Enter partial payment amount"
                                                    min={0}
                                                    max={parseFloat(total)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>


                    </div>
                )}

                <div className="actions" style={{ padding: '10px' }}>
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
                            handleMail();
                        }}
                        disabled={isMailing}
                    >
                        {isMailing ? 'Sending...' : 'Save & Mail'}
                    </button>
                </div>
            </div>
        </div>
    );
}
