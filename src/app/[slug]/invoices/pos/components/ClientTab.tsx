'use client';

import { useFetchEmployesQuery } from '@/slices';
import React from 'react';

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
    handleNumberBlur: () => void;

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
    handleNumberBlur
}: ClientTabProps) {
    const { data: employeeData, isLoading: isEmployeeLoading } = useFetchEmployesQuery();

    return (
        <div className="client-form">
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
                        >
                            <option value="">Select an employee</option>
                            {employeeData?.employees?.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}
        </div>
    );
}
