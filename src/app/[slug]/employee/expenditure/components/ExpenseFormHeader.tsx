'use client';

import Image from 'next/image';

import type { Dispatch, SetStateAction } from 'react';

 interface FormDataState {
    heading: string;
    description: string;
    price: string;
    file: File | null;
    tags: Tag[];
    status: 'pending' | 'paid';
}


interface ExpenseFormHeaderProps {
    formData: FormDataState;
    setFormData: Dispatch<SetStateAction<FormDataState>>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: Record<string, string>;
    expense?: Expense | null;
    imagePreview: string | null;
    isImageModalOpen: boolean;
    closeImageModal: () => void;
}


export default function ExpenseFormHeader({
    formData,
    setFormData,
    handleFileChange,
    errors,
    expense,
    imagePreview,
    isImageModalOpen,
    closeImageModal
}: ExpenseFormHeaderProps) {
    return (
        <div className='expense-form-header'>
            <div className="form-group heading-group">
                <label>Heading</label>
                <input
                    type="text"
                    value={formData.heading}
                    onChange={e => setFormData(prev => ({ ...prev, heading: e.target.value }))}
                    placeholder='Heading'
                />
                {errors.heading && <p className="error-message">{errors.heading}</p>}
            </div>

            <div className="form-group price-group">
                <label>Price</label>
                <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="123"
                    onWheel={e => e.currentTarget.blur()}
                />
                {errors.price && <p className="error-message">{errors.price}</p>}
            </div>

            <div className="form-group status-group">
                <label>Status</label>
                <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'pending' | 'paid' }))}
                >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </select>
            </div>

            <div className="form-group file-group">
                <label>Upload File</label>
                <input type="file" onChange={handleFileChange} />
                {errors.file && <p className="error-message">{errors.file}</p>}

                {expense?.file_path && !formData.file && (
                    <p className="current-file">Current file: {expense.file_path}</p>
                )}

                {isImageModalOpen && (
                    <div className="image-modal-overlay" onClick={closeImageModal}>
                        <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button onClick={closeImageModal}>&times;</button>
                            <Image width={500} height={500} src={imagePreview!} alt="Full Preview" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 