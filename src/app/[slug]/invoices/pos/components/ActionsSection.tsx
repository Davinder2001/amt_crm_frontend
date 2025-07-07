// components/cart/ActionsSection.tsx
'use client';

import React from 'react';

type ActionsSectionProps = {
    validateFields: () => boolean;
    handleSave: () => void;
    isSaving: boolean;
    handlePrint: () => void;
    isPrinting: boolean;
    handleShareInvoice: () => void;
    isSharing: boolean;
};

export default function ActionsSection({
    validateFields,
    handleSave,
    isSaving,
    handlePrint,
    isPrinting,
    handleShareInvoice,
    isSharing
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
                    handleShareInvoice();
                }}
                disabled={isSharing}
            >
                {isSharing ? 'Sending...' : 'Save & Share'}
            </button>
        </div>
    );
}