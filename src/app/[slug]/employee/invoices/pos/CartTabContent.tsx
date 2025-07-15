'use client';

import { useFetchCompanyAccountsQuery } from '@/slices/company/companyApi';
import { useFetchAllCustomersQuery } from '@/slices/customers/customerApi';
import { useCompany } from '@/utils/Company';
import React, { useState } from 'react';
import { FiTrash2, FiList, FiUser, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ItemsTab from './components/ItemsTab';
import ClientTab from './components/ClientTab';
import BillTab from './components/BillTab';
import PaymentSection from './components/PaymentSection';
import ActionsSection from './components/ActionsSection';
import { useFetchSelectedCompanyQuery } from '@/slices';

type CartTabContentProps = {
    activeTab: TabType;
    cart: CartItem[];
    onQtyChange: (itemId: number | string, delta: number | string) => void;
    onRemoveItem: (itemId: number | string) => void;
    onClearCart: () => void;
    handleSave: () => void;
    isSaving: boolean;
    handlePrint: () => void;
    isPrinting: boolean;
    handleShareInvoice: () => void;
    isSharing: boolean;
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
    deliveryBoyId: number | null;
    setDeliveryBoyId: React.Dispatch<React.SetStateAction<number | null>>;
    items: StoreItem[];
};

type InnerTabType = 'Items' | 'Client' | 'Bill';

export default function CartTabContent({
    activeTab, cart, onQtyChange,
    onRemoveItem, onClearCart,
    handleSave, isSaving,
    handlePrint, isPrinting,
    handleShareInvoice, isSharing,
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
    deliveryBoyId, setDeliveryBoyId,
    items

}: CartTabContentProps) {
    const [activeInnerTab, setActiveInnerTab] = useState<InnerTabType>('Client');
    const [showPaymentDetails, setShowPaymentDetails] = useState(true);
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
    const [isServiceChargeApplied, setIsServiceChargeApplied] = useState(false);
    const { data: customers } = useFetchAllCustomersQuery();
    const { data } = useFetchCompanyAccountsQuery();
    const BankAccountList = data?.accounts;
    const { companySlug } = useCompany();
    const { data: selectedCompanyData } = useFetchSelectedCompanyQuery();
    const company = selectedCompanyData?.selected_company;
    const [signatureRequired, setSignatureRequired] = useState(false);
    // Check for company_signature field (adjust if your API uses a different name)
    const hasSignature = !!company?.company_signature && company.company_signature !== '';


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
                    <ItemsTab
                        cart={cart}
                        items={items}
                        onQtyChange={onQtyChange}
                        onRemoveItem={onRemoveItem}
                    />
                )}

                {activeInnerTab === 'Client' && (
                    <ClientTab
                        activeTab={activeTab}
                        clientName={clientName}
                        setClientName={setClientName}
                        email={email}
                        setEmail={setEmail}
                        number={number}
                        setNumber={setNumber}
                        address={address}
                        setAddress={setAddress}
                        pincode={pincode}
                        setPincode={setPincode}
                        deliveryCharge={deliveryCharge}
                        setDeliveryCharge={setDeliveryCharge}
                        customers={customers}
                        companySlug={companySlug}
                        deliveryBoyId={deliveryBoyId}
                        setDeliveryBoyId={setDeliveryBoyId}
                        hasSignature={hasSignature}
                        signatureRequired={signatureRequired}
                        setSignatureRequired={setSignatureRequired}
                    />
                )}

                {activeInnerTab === 'Bill' && (
                    <BillTab
                        baseTotal={baseTotal}
                        serviceChargeAmountWithGST={serviceChargeAmountWithGST}
                        subtotalAfterServiceCharge={subtotalAfterServiceCharge}
                        appliedDiscount={appliedDiscount}
                        total={total}
                        isServiceChargeApplied={isServiceChargeApplied}
                        serviceChargeType={serviceChargeType}
                        serviceChargePercent={serviceChargePercent}
                        serviceChargeAmount={serviceChargeAmount}
                        isDiscountApplied={isDiscountApplied}
                        discountType={discountType}
                        discountPercent={discountPercent}
                        discountAmount={discountAmount}
                    />
                )}

                <PaymentSection
                    showPaymentDetails={showPaymentDetails}
                    setShowPaymentDetails={setShowPaymentDetails}
                    total={total}
                    isServiceChargeApplied={isServiceChargeApplied}
                    setIsServiceChargeApplied={setIsServiceChargeApplied}
                    serviceChargeType={serviceChargeType}
                    setServiceChargeType={setServiceChargeType}
                    serviceChargeAmount={serviceChargeAmount}
                    setServiceChargeAmount={setServiceChargeAmount}
                    serviceChargePercent={serviceChargePercent}
                    setServiceChargePercent={setServiceChargePercent}
                    isDiscountApplied={isDiscountApplied}
                    setIsDiscountApplied={setIsDiscountApplied}
                    discountType={discountType}
                    setDiscountType={setDiscountType}
                    discountAmount={discountAmount}
                    setDiscountAmount={setDiscountAmount}
                    discountPercent={discountPercent}
                    setDiscountPercent={setDiscountPercent}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    BankAccountList={BankAccountList || []}
                    selectedBankAccount={selectedBankAccount}
                    setSelectedBankAccount={setSelectedBankAccount}
                    companySlug={companySlug}
                    creditPaymentType={creditPaymentType}
                    setCreditPaymentType={setCreditPaymentType}
                    partialAmount={partialAmount}
                    setPartialAmount={setPartialAmount}
                    creditNote={creditNote}
                    setCreditNote={setCreditNote}
                />
                <ActionsSection
                    validateFields={validateFields}
                    handleSave={handleSave}
                    isSaving={isSaving}
                    handlePrint={handlePrint}
                    isPrinting={isPrinting}
                    handleShareInvoice={handleShareInvoice}
                    isSharing={isSharing}
                />
            </div>
        </div>
    );
}
