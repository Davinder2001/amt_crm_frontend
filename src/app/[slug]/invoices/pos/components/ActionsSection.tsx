// components/cart/ActionsSection.tsx
'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

type ActionsSectionProps = {
    validateFields: () => boolean;
    handleSave: () => void;
    isSaving: boolean;
    handlePrint: () => void;
    isPrinting: boolean;
    handleSendWhatsapp: () => void;
    isSendWhatsapp: boolean;
};

export default function ActionsSection({
    validateFields,
    handleSave,
    isSaving,
    handlePrint,
    isPrinting,
    handleSendWhatsapp,
    isSendWhatsapp
}: ActionsSectionProps) {
    return (
        <div className="actions">
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
                    handleSendWhatsapp();
                }}
                disabled={isSendWhatsapp}
            >
                {isSendWhatsapp ? 'Sending...' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>Save & <FaWhatsapp /></span>}
            </button>
        </div>
    );
}