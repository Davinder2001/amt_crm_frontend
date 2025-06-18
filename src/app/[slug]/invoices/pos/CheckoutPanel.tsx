'use client';

import React, { useState } from 'react';
import { FiShoppingCart, FiTruck, FiUser } from 'react-icons/fi';
import {
    useCreateInvoiceMutation,
    usePrintInvoiceMutation,
    useWhatsappInvoiceMutation,
} from '@/slices/invoices/invoice';
import CartTabContent from './CartTabContent';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';

type CheckoutPanelProps = {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    cart: CartItem[];
    onQtyChange: (itemId: number | string, delta: number | string) => void;
    onRemoveItem: (itemId: number | string) => void;
    onClearCart: () => void;
    onClose?: () => void;
    items: StoreItem[];
};

const tabs: TabType[] = ['Cart', 'Delivery', 'Pickup'];

export default function CheckoutPanel({
    activeTab,
    onTabChange,
    cart,
    onQtyChange,
    onRemoveItem,
    onClearCart,
    onClose,
    items
}: CheckoutPanelProps) {

    // RTK Query hooks
    const [createInvoice, { isLoading: isSaving }] = useCreateInvoiceMutation();
    const [printInvoice, { isLoading: isPrinting }] = usePrintInvoiceMutation();
    const [whatsappInvoice, { isLoading: isSendWhatsapp }] = useWhatsappInvoiceMutation();
    const [clientName, setClientName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'' | 'cash' | 'online' | 'card' | 'credit' | 'self'>('');
    const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const [serviceChargeType, setServiceChargeType] = useState<'amount' | 'percentage'>('amount');
    const [serviceChargeAmount, setServiceChargeAmount] = useState(0);
    const [serviceChargePercent, setServiceChargePercent] = useState(0);
    const [creditPaymentType, setCreditPaymentType] = useState<'full' | 'partial'>('full');
    const [partialAmount, setPartialAmount] = useState(0);
    const [creditNote, setCreditNote] = useState('');
    const [selectedBankAccount, setSelectedBankAccount] = useState<number | null>(null);
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
    const router = useRouter();
    const { companySlug } = useCompany();


    const cartItemCount = cart.length;

    const buildPayload = (): CreateInvoicePayload => ({
        number: number,
        client_name: clientName,
        email: email,
        invoice_date: new Date().toISOString().split('T')[0],
        discount_price: discountAmount,
        discount_percentage: discountPercent,
        discount_type: discountType,
        serviceChargeAmount: serviceChargeAmount,
        serviceChargePercent: serviceChargePercent,
        serviceChargeType: serviceChargeType,
        creditPaymentType: creditPaymentType,
        partialAmount: partialAmount,
        credit_note: creditNote,
        bank_account_id: selectedBankAccount || undefined,
        item_type: activeTab,
        payment_method: paymentMethod,
        address: address,
        pincode: pincode,
        delivery_charge: deliveryCharge,
        items: cart.map(i => ({
            item_id: typeof i.id === 'string' ? parseInt(i.id, 10) : i.id,
            quantity: i.quantity,
            final_cost: i.final_cost,
        })),
    });


    // 1) Save only
    const handleSave = async () => {
        try {
            const payload = buildPayload();
            const invoice = await createInvoice(payload).unwrap();
            if (invoice.status === true) {
                toast.success(invoice.message || 'Invoice created successfully.');
                router.push(`/${companySlug}/invoices`);
            } else {
                toast.error(invoice.message || invoice.error || 'Failed to create invoice.');
            }
        } catch (err) {
            console.error('Save error:', err);
        }
    };

    // 2) Save & Print
    const handlePrint = async () => {
        try {
            const payload = buildPayload();
            const pdfBlob = await printInvoice(payload).unwrap();
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
        } catch (err) {
            console.error('Print error:', err);
        }
    };

    // 3) Save & whatsapp (or KOT)
    const handleSendWhatsapp = async () => {
        try {
            const payload = buildPayload();
            const invoice = await whatsappInvoice(payload).unwrap();
            if (invoice.status === true) {
                toast.success(invoice.message);
                router.push(`/${companySlug}/invoices`);
            } else {
                toast.error(invoice.message || invoice.error || 'Failed to create invoice.');
            }
        } catch (err) {
            console.error('Mail error:', err);
        }
    };

    return (
        <>
            {onClose && (
                <button
                    className="close-checkout-btn"
                    onClick={onClose}
                >
                    <FaArrowLeft />
                </button>
            )}
            <div className="checkout">
                <div className="tabs">
                    {tabs.map(tab => {
                        let Icon;
                        switch (tab) {
                            case 'Cart':
                                Icon = FiShoppingCart;
                                break;
                            case 'Delivery':
                                Icon = FiTruck;
                                break;
                            case 'Pickup':
                                Icon = FiUser;
                                break;
                            default:
                                Icon = null;
                        }

                        return (
                            <button
                                key={tab}
                                className={`tab ${tab === activeTab ? 'active' : ''}`}
                                onClick={() => onTabChange(tab)}
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                {Icon && <Icon style={{ fontSize: 16 }} />}
                                <span style={{ position: 'relative', display: 'inline-block' }}>
                                    {tab}
                                    {tab === 'Cart' && cartItemCount > 0 && (
                                        <span
                                            className="cart-badge"
                                        >
                                            {cartItemCount}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <CartTabContent
                    activeTab={activeTab}
                    cart={cart}
                    onQtyChange={onQtyChange}
                    onRemoveItem={onRemoveItem}
                    onClearCart={onClearCart}
                    handleSave={handleSave}
                    isSaving={isSaving}
                    handlePrint={handlePrint}
                    isPrinting={isPrinting}
                    handleSendWhatsapp={handleSendWhatsapp}
                    isSendWhatsapp={isSendWhatsapp}
                    clientName={clientName}
                    setClientName={setClientName}
                    email={email}
                    setEmail={setEmail}
                    number={number}
                    setNumber={setNumber}
                    discountAmount={discountAmount}
                    setDiscountAmount={setDiscountAmount}
                    discountType={discountType}
                    setDiscountType={setDiscountType}
                    discountPercent={discountPercent}
                    setDiscountPercent={setDiscountPercent}
                    serviceChargeAmount={serviceChargeAmount}
                    setServiceChargeAmount={setServiceChargeAmount}
                    serviceChargeType={serviceChargeType}
                    setServiceChargeType={setServiceChargeType}
                    serviceChargePercent={serviceChargePercent}
                    setServiceChargePercent={setServiceChargePercent}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    address={address}
                    setAddress={setAddress}
                    pincode={pincode}
                    setPincode={setPincode}
                    deliveryCharge={deliveryCharge}
                    setDeliveryCharge={setDeliveryCharge}
                    creditPaymentType={creditPaymentType}
                    setCreditPaymentType={setCreditPaymentType}
                    creditNote={creditNote}
                    setCreditNote={setCreditNote}
                    partialAmount={partialAmount}
                    setPartialAmount={setPartialAmount}
                    selectedBankAccount={selectedBankAccount}
                    setSelectedBankAccount={setSelectedBankAccount}
                    items={items}
                />
                <div className="content">
                    {activeTab === 'Cart' && (
                        <>

                        </>
                    )}

                    {activeTab === 'Delivery' && (
                        <div className="delivery">

                        </div>
                    )}

                    {activeTab === 'Pickup' && (
                        <div className="pickup">

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
