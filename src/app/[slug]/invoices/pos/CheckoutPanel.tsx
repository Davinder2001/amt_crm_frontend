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
    const [deliveryBoyId, setDeliveryBoyId] = useState<number | null>(null);


    const cartItemCount = cart.length;

    const buildPayload = (): CreateInvoicePayload => {
        const invoiceItems = cart.map((cartItem) => {
            // Ensure item_id is always a number and never undefined
            const parsedItemId = typeof cartItem.itemId === 'string' ? parseInt(cartItem.itemId, 10) : cartItem.itemId;
            if (typeof parsedItemId !== 'number' || isNaN(parsedItemId)) {
                throw new Error('Invalid item_id in cart item');
            }

            // Find the original item from the items array
            const originalItem = items.find(i => i.id === parsedItemId);
            if (!originalItem) {
                throw new Error(`Original item not found for id: ${parsedItemId}`);
            }

            // Base item properties
            const baseItem: cartBaseItem = {
                item_id: parsedItemId,
                product_type: cartItem.product_type,
                unit_of_measure: cartItem.unit_of_measure,
                cost_price: originalItem.cost_price,
                regular_price: originalItem.regular_price,
                sale_price: originalItem.sale_price,
                sale_by: cartItem.useUnitPrice ? 'unit' : 'piece',
                quantity: cartItem.quantity // Always use 'quantity'
            };

            // Include batch details if the item has batches
            if (cartItem.batches?.[0]?.batch_id) {
                const batchId = cartItem.batches[0].batch_id;
                baseItem.batch_id = batchId;

                // Find the original batch
                const originalBatch = originalItem.batches?.find(b => b.id === batchId);
                if (originalBatch) {
                    // For simple products, include batch prices
                    if (cartItem.product_type === 'simple_product') {
                        baseItem.cost_price = originalBatch.cost_price;
                        baseItem.regular_price = originalBatch.regular_price;
                        baseItem.sale_price = originalBatch.sale_price;

                        if (cartItem.useUnitPrice && originalBatch.price_per_unit) {
                            baseItem.price_per_unit = originalBatch.price_per_unit;
                        }
                    }
                }
            }

            // Handle variable products with variants
            if (cartItem.variants?.[0]?.variant_id) {
                const variantId = cartItem.variants[0].variant_id;
                baseItem.variant_id = variantId;

                // Find the original variant (either from item or batch)
                let originalVariant;
                if (originalItem.variants) {
                    originalVariant = originalItem.variants.find(v => v.id === variantId);
                } else if (baseItem.batch_id && originalItem.batches) {
                    const batch = originalItem.batches.find(b => b.id === baseItem.batch_id);
                    originalVariant = batch?.variants?.find(v => v.id === variantId);
                }

                if (originalVariant) {
                    baseItem.variant_regular_price = originalVariant.variant_regular_price;
                    baseItem.variant_sale_price = originalVariant.variant_sale_price;

                    if (cartItem.useUnitPrice && originalVariant.variant_price_per_unit) {
                        baseItem.variant_price_per_unit = originalVariant.variant_price_per_unit;
                    }
                }
            }

            return baseItem as cartBaseItem;
        });

        return {
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
            delivery_boy: deliveryBoyId,
            items: invoiceItems
        };
    };


    function appendToFormData(formData: FormData, data: CreateInvoicePayload) {
        // Append regular fields
        for (const [key, value] of Object.entries(data)) {
            if (key !== 'items' && value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        }

        // Handle items array specially
        if (data.items && data.items.length > 0) {
            data.items.forEach((item, index) => {
                for (const [itemKey, itemValue] of Object.entries(item)) {
                    if (itemValue !== undefined && itemValue !== null) {
                        formData.append(`items[${index}][${itemKey}]`, itemValue.toString());
                    }
                }
            });
        }
    }

    // 1) Save only
    const handleSave = async () => {
        try {
            const payload = buildPayload();
            const formData = new FormData();
            appendToFormData(formData, payload);
            const invoice = await createInvoice(formData).unwrap();
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
            const formData = new FormData();
            appendToFormData(formData, payload);
            const pdfBlob = await printInvoice(formData).unwrap();
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
            const formData = new FormData();
            appendToFormData(formData, payload);
            const invoice = await whatsappInvoice(formData).unwrap();
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
                    deliveryBoyId={deliveryBoyId}
                    setDeliveryBoyId={setDeliveryBoyId}
                />
            </div>
        </>
    );
}
