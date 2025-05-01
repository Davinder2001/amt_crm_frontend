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
    paymentMethod: '' | 'cash' | 'online' | 'card' | 'due';
    setPaymentMethod: React.Dispatch<React.SetStateAction<'' | 'cash' | 'online' | 'card' | 'due'>>;
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
    deliveryCharge, setDeliveryCharge

}: CartTabContentProps) {
    const [activeInnerTab, setActiveInnerTab] = useState<InnerTabType>('Items');
    const [showPaymentDetails, setShowPaymentDetails] = useState(true);
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
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


        if ((activeTab === 'Delivery' || activeTab === 'Pickup') && !address.trim()) {
            setActiveInnerTab('Client');
            toast.error(
                activeTab === 'Delivery'
                    ? 'Please provide a delivery address.'
                    : 'Please provide pickup location.'
            );
            return false;
        }

        if (activeTab === 'Delivery' && !pincode.trim()) {
            setActiveInnerTab('Client');
            toast.error('Please provide a pincode.');
            return false;
        }

        if (!paymentMethod) {
            setShowPaymentDetails(true);
            toast.error('Please select a payment method.');
            return false;
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
                        <span>Discounts & Payment</span>
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
                            <div className="section-title">Discount Options</div>
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
                            <div className="section-title">Payment Method</div>
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
                                        value="due"
                                        checked={paymentMethod === 'due'}
                                        onChange={() => setPaymentMethod('due')}
                                    />
                                    <span className="radiomark" />
                                    Due
                                </label>
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
