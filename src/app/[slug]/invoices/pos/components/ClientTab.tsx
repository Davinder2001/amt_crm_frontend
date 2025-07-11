'use client';

import { useFetchEmployesQuery } from '@/slices';
import React, { useState, useEffect, useRef } from 'react';

type ClientTabProps = {
    activeTab: string;
    clientName: string;
    setClientName: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    number: string;
    setNumber: React.Dispatch<React.SetStateAction<string>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    pincode: string;
    setPincode: React.Dispatch<React.SetStateAction<string>>;
    deliveryCharge: number;
    setDeliveryCharge: React.Dispatch<React.SetStateAction<number>>;
    deliveryBoyId: number | null;
    setDeliveryBoyId: React.Dispatch<React.SetStateAction<number | null>>;
    customers?: { customers: Customer[] };
    companySlug: string;
};

export default function ClientTab({
    activeTab,
    clientName,
    setClientName,
    email,
    setEmail,
    number,
    setNumber,
    address,
    setAddress,
    pincode,
    setPincode,
    deliveryCharge,
    setDeliveryCharge,
    deliveryBoyId,
    setDeliveryBoyId,
    customers,
}: ClientTabProps) {
    const { data: employeeData, isLoading: isEmployeeLoading } = useFetchEmployesQuery();
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter customers based on input
    useEffect(() => {
        if (number && customers?.customers) {
            const filtered = customers.customers.filter(customer =>
                customer.number.includes(number)
            );
            setFilteredCustomers(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setFilteredCustomers([]);
            setShowDropdown(false);
        }
    }, [number, customers]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCustomerSelect = (customer: Customer) => {
        setNumber(customer.number);
        setClientName(customer.name);
        setEmail(customer.email || '');
        setAddress(customer.address || '');
        setShowDropdown(false);

        // Focus back on the input
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/\D/g, '');
        if (digitsOnly.length <= 10) {
            setNumber(digitsOnly);
        }
    };

    const handleInputFocus = () => {
        if (number.length > 0) {
            setShowDropdown(true);
        }
    };

    return (
        <div className="client-form">
            <div className="form-group">
                <label>Phone Number</label>
                <div className="dropdown-container" ref={dropdownRef}>
                    <input
                        ref={inputRef}
                        type="tel"
                        value={number}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Enter 10-digit phone number"
                        required
                        maxLength={10}
                        pattern="\d{10}"
                    />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            {filteredCustomers.map(customer => (
                                <div
                                    key={customer.id}
                                    className="dropdown-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCustomerSelect(customer);
                                    }}
                                >
                                    <div className="customer-number">{customer.number}</div>
                                    <div className="customer-name">{customer.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="form-group">
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

            {activeTab !== 'Cart' && (
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

                    <div className="form-group">
                        <label>Select Delivery Boy</label>
                        <select
                            value={deliveryBoyId ?? ''}
                            onChange={(e) => setDeliveryBoyId(e.target.value === '' ? null : Number(e.target.value))}
                            disabled={isEmployeeLoading}
                            className={`select-field ${deliveryBoyId === null ? 'common-placeholder' : ''}`}
                        >
                            <option value="" >Select an employee</option>
                            {employeeData?.employees?.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </>
            )}

            <style jsx>{`
                .dropdown-container {
                    position: relative;
                }
                
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    max-height: 200px;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .dropdown-item {
                    padding: 8px 12px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                }
                
                .dropdown-item:hover {
                    background-color: #f5f5f5;
                }
                
                .customer-number {
                    font-weight: 600;
                }
                
                .customer-name {
                    color: #666;
                }
            `}</style>
        </div>
    );
}