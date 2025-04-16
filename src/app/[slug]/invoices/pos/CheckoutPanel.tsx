'use client';

import React, { useState } from 'react';

type ItemType = { name: string; price: number; qty: number };
type TabType = 'DineIn' | 'Delivery' | 'Pickup';

type Props = {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    cart: ItemType[];
    onQtyChange: (itemName: string, delta: number) => void;
};

const tabs: TabType[] = ['DineIn', 'Delivery', 'Pickup'];

export default function CheckoutPanel({ activeTab, onTabChange, cart, onQtyChange }: Props) {
    const [showPaymentDetails, setShowPaymentDetails] = useState(true);
    const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

    return (
        <div className="checkout">
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${tab === activeTab ? 'active' : ''}`}
                        onClick={() => onTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="content">
                {activeTab === 'DineIn' && (
                    <>
                        {cart.length > 0 && (
                            <table className="cartTable">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.name}>
                                            <td>{item.name}</td>
                                            <td>
                                                <button onClick={() => onQtyChange(item.name, -1)}>-</button>
                                                {item.qty}
                                                <button onClick={() => onQtyChange(item.name, 1)}>+</button>
                                            </td>
                                            <td>₹{item.qty * item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="sectionToggle" onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
                            <span>{showPaymentDetails ? '▼' : '▲'}</span>
                            <span>Discounts & Payment</span>
                        </div>

                        {showPaymentDetails && (
                            <div className="discounts">
                                <div className="checkboxGroup">
                                    <label><input type="checkbox" /> Bogo</label>
                                    <label><input type="checkbox" /> Complimentary</label>
                                </div>
                                <div className="radioGroup">
                                    <label><input type="radio" name="pay" /> Cash</label>
                                    <label><input type="radio" name="pay" /> Card</label>
                                    <label><input type="radio" name="pay" /> Due</label>
                                </div>
                            </div>
                        )}

                        <div className="total">
                            Total: <strong>₹{total}</strong>
                        </div>

                        <div className="actions">
                            <button className="btn">Save</button>
                            <button className="btn">Print</button>
                            <button className="btn">KOT</button>
                        </div>
                    </>
                )}

                {activeTab === 'Delivery' && (
                    <div className="form">
                        <h4>Delivery Details</h4>
                        <input type="text" placeholder="Customer Name" />
                        <input type="text" placeholder="Phone Number" />
                        <textarea placeholder="Delivery Address" />
                        <div className="actions">
                            <button className="btn">Save</button>
                            <button className="btn">Send</button>
                        </div>
                    </div>
                )}

                {activeTab === 'Pickup' && (
                    <div className="form">
                        <h4>Pickup Details</h4>
                        <input type="text" placeholder="Customer Name" />
                        <input type="text" placeholder="Phone Number" />
                        <div className="actions">
                            <button className="btn">Save</button>
                            <button className="btn">Notify</button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .checkout {
                    width: 350px;
                    background: #fff;
                    border-left: 1px solid #ccc;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    font-family: sans-serif;
                }

                .tabs {
                    display: flex;
                    border-bottom: 1px solid #ccc;
                }

                .tab {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    background: #eee;
                    cursor: pointer;
                    font-weight: bold;
                }

                .tab.active {
                    background: #009688;
                    color: white;
                }

                .content {
                    padding: 12px;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .cartTable {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .cartTable th,
                .cartTable td {
                    padding: 6px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }

                .cartTable button {
                    margin: 0 4px;
                    padding: 2px 6px;
                }

                .sectionToggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    background: #f1f1f1;
                    padding: 8px;
                    border-radius: 4px;
                }

                .discounts {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background: #fafafa;
                }

                .checkboxGroup,
                .radioGroup {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .total {
                    text-align: right;
                    font-size: 16px;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                }

                .btn {
                    flex: 1;
                    padding: 10px;
                    background: #009688;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .form input,
                .form textarea {
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                .form textarea {
                    resize: vertical;
                }
            `}</style>
        </div>
    );
}
