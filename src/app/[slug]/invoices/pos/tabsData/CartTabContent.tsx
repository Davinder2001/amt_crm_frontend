'use client';

import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import { useFetchStoreQuery } from '@/slices/store/storeApi';
import React, { useState } from 'react';
import { FiX, FiTrash2, FiShoppingCart, FiList, FiUser, } from 'react-icons/fi';
import { toast } from 'react-toastify';

type CartTabContentProps = {
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
};

type InnerTabType = 'Items' | 'Client';

export default function CartTabContent({
    cart,
    onQtyChange,
    onRemoveItem,
    onClearCart,
    handleSave,
    isSaving,
    handlePrint,
    isPrinting,
    handleMail,
    isMailing,
    clientName, setClientName,
    email, setEmail,
    number, setNumber,
    discountAmount, setDiscountAmount
}: CartTabContentProps) {
    const [activeInnerTab, setActiveInnerTab] = useState<InnerTabType>('Items');
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
    const { data: customers } = useFetchAllCustomersQuery();
    const { data: storeData } = useFetchStoreQuery();

    const baseTotal = cart.reduce((sum, i) => sum + i.quantity * i.selling_price, 0);
    const total = Math.max(0, baseTotal - (isDiscountApplied ? discountAmount : 0));

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
        return true;
    };

    const handleClearAll = () => {
        onClearCart();
        setClientName('');
        setEmail('');
        setNumber('');
        setDiscountAmount(0);
        setIsDiscountApplied(false);
        setShowPaymentDetails(false);
        setActiveInnerTab('Items')
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
                                <table className="cartTable" style={{ margin: 0 }}>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.id}>
                                                <td className="item-name-checkout">
                                                    <small className="delete-btn" onClick={() => onRemoveItem(item.id)}>
                                                        <FiX />
                                                    </small>{' '}
                                                    <span>{item.name}</span>
                                                </td>
                                                <td>
                                                    <td>
                                                        <button
                                                            onClick={() => onQtyChange(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        {item.quantity}
                                                        <button
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
                                                    </td>
                                                </td>
                                                <td>₹{item.quantity * item.selling_price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </>
                        ) : (
                            <div className="emptyCart">
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
                        Total: <strong>₹{total}</strong>
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
                                <label>Discount Amount</label>
                                <input
                                    type="number"
                                    value={discountAmount === 0 ? '' : discountAmount}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setDiscountAmount(isNaN(val) ? 0 : val);
                                    }}
                                    onFocus={(e) => {
                                        if (e.target.value === '0') {
                                            e.target.value = '';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === '') {
                                            setDiscountAmount(0);
                                        }
                                    }}
                                    placeholder="Enter discount amount"
                                    min={0}
                                    max={baseTotal}
                                />
                            </div>
                        )}

                        <div className="section-group">
                            <div className="section-title">Payment Method</div>
                            <div className="options-row">
                                <label className="custom-radio">
                                    <input type="radio" name="pay" />
                                    <span className="radiomark" />
                                    Cash
                                </label>
                                <label className="custom-radio">
                                    <input type="radio" name="pay" />
                                    <span className="radiomark" />
                                    Card
                                </label>
                                <label className="custom-radio">
                                    <input type="radio" name="pay" />
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
