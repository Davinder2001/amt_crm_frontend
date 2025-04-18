'use client';

import React, { useState } from 'react';
import { FiShoppingCart, FiTruck, FiUser } from 'react-icons/fi';
import {
    useCreateInvoiceMutation,
    usePrintInvoiceMutation,
    useMailInvoiceMutation,
} from '@/slices/invoices/invoice';
import CartTabContent from './tabsData/CartTabContent';

type CheckoutPanelProps = {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    cart: CartItem[];
    onQtyChange: (itemId: number, delta: number) => void;
    onRemoveItem: (itemId: number) => void;
    onClearCart: () => void;
};

const tabs: TabType[] = ['Cart', 'Delivery', 'Pickup'];

export default function CheckoutPanel({
    activeTab,
    onTabChange,
    cart,
    onQtyChange,
    onRemoveItem,
    onClearCart,
}: CheckoutPanelProps) {

    // RTK Query hooks
    const [createInvoice, { isLoading: isSaving }] = useCreateInvoiceMutation();
    const [printInvoice, { isLoading: isPrinting }] = usePrintInvoiceMutation();
    const [mailInvoice, { isLoading: isMailing }] = useMailInvoiceMutation();
    const [clientName, setClientName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');

    const buildPayload = (): CreateInvoicePayload => ({
        number: number,
        client_name: clientName,
        email: email,
        invoice_date: new Date().toISOString().split('T')[0],
        items: cart.map(i => ({
            item_id: i.id,
            quantity: i.quantity,
            unit_price: i.selling_price,
            description: i.description || i.name,
            total: i.quantity * i.selling_price,
        })),
    });


    // 1) Save only
    const handleSave = async () => {
        try {
            const payload = buildPayload();
            const invoice = await createInvoice(payload).unwrap();
            console.log('Invoice saved:', invoice);
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

    // 3) Save & Mail (or KOT)
    const handleMail = async () => {
        try {
            const payload = buildPayload();
            const invoice = await mailInvoice(payload).unwrap();
            console.log('Invoice mailed:', invoice);
        } catch (err) {
            console.error('Mail error:', err);
        }
    };

    return (
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
                        >
                            {Icon && <Icon style={{ marginRight: 6, fontSize: 16 }} />}
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div className="content">
                {activeTab === 'Cart' && (
                    <>
                        <CartTabContent
                            cart={cart}
                            onQtyChange={onQtyChange}
                            onRemoveItem={onRemoveItem}
                            onClearCart={onClearCart}
                            handleSave={handleSave}
                            isSaving={isSaving}
                            handlePrint={handlePrint}
                            isPrinting={isPrinting}
                            handleMail={handleMail}
                            isMailing={isMailing}
                            clientName={clientName}
                            setClientName={setClientName}
                            email={email}
                            setEmail={setEmail}
                            number={number}
                            setNumber={setNumber}
                        />

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
        </div>
    );
}
