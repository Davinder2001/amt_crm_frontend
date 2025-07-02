'use client';

import { memo, useState } from 'react';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '@/slices';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface ExpenseFormProps {
    expense?: Expense | null;
    onSuccess: () => void;
    onCancel?: () => void;
}

export default memo(function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
    const [createExpense] = useCreateExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [tagError, setTagError] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const openImageModal = () => setIsImageModalOpen(true);
    const closeImageModal = () => setIsImageModalOpen(false);

    const [formData, setFormData] = useState<ExpenseCreateRequest | ExpenseUpdateRequest>({
        heading: expense?.heading || '',
        description: expense?.description || '',
        price: expense?.price?.toString() || '',
        file: null,
        tags: expense?.tags || [],
        status: expense?.status || 'pending'
    });
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleChange('file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleRemoveImage = () => {
        handleChange('file', null);
        setImagePreview(null);
    };

    const handleChange = (
        field: keyof typeof formData,
        value: string | number | File | null | { name: string }[]
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (!trimmedTag) return;

        if (formData.tags.some(tag => tag.name === trimmedTag)) {
            setTagError('This tag already exists');
            return;
        }

        handleChange('tags', [...formData.tags, { name: trimmedTag }]);
        setTagInput('');
        setTagError('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleChange('tags', formData.tags.filter(tag => tag.name !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.heading) newErrors.heading = 'Heading is required';
        if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Valid price is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const formDataPayload = new FormData();
            formDataPayload.append('method', '_PUT');
            formDataPayload.append('heading', formData.heading);
            formDataPayload.append('description', formData.description || '');
            formDataPayload.append('price', Number(formData.price).toString());
            formDataPayload.append('status', formData.status);
            formData.tags.forEach((tag, index) => {
                formDataPayload.append(`tags[${index}][name]`, tag.name);
            });

            if (formData.file) formDataPayload.append('file', formData.file);

            if (expense) {
                await updateExpense({
                    id: expense.id,
                    formdata: formDataPayload as unknown as ExpenseUpdateRequest
                }).unwrap();
            } else {
                if (!formData.file) {
                    setErrors({ ...errors, file: 'File is required' });
                    return;
                }
                await createExpense({ formdata: formDataPayload as unknown as ExpenseCreateRequest }).unwrap();
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving expense:', error);
            setErrors({ form: 'An error occurred while saving the expense' });
        }
    };



    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            {errors.form && <p className="error-message">{errors.form}</p>}

            <div className="form-group heading-group">
                <label>Heading</label>
                <input
                    className="input heading-input"
                    type="text"
                    value={formData.heading}
                    onChange={e => handleChange('heading', e.target.value)}
                    placeholder='Heading'
                />
                {errors.heading && <p className="error-message">{errors.heading}</p>}
            </div>

            <div className="form-group description-group">
                <label>Description</label>
                <textarea
                    className="textarea description-input"
                    value={formData.description ?? ''}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder='Description'
                />
            </div>

            <div className="form-group price-group">
                <label>Price</label>
                <input
                    className="input price-input"
                    type="number"
                    value={formData.price}
                    onChange={e => handleChange('price', e.target.value)}
                    placeholder="123"
                    onWheel={e => e.currentTarget.blur()}
                />
                {errors.price && <p className="error-message">{errors.price}</p>}
            </div>

            <div className="form-group status-group">
                <label>Status</label>
                <select
                    className="select status-select"
                    value={formData.status}
                    onChange={e => handleChange('status', e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </select>
            </div>

            <div className="form-group tag-group">
                <label>Add Tags</label>
                <div className='tag-group-input-btn-wrapper'>
                    <input
                        className="input tag-input add-tag-input"
                        type="text"
                        value={tagInput}
                        onChange={e => {
                            setTagInput(e.target.value);
                            if (tagError) setTagError('');
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder='Add Tags'
                    />
                    <button type="button" className=" add-tag-btn" onClick={handleAddTag}><FaPlus /></button>
                </div>
                {tagError && <p className="error-message">{tagError}</p>}

                <div className="tag-list">
                    {formData.tags.map(tag => (
                        <span key={tag.name} className="tag-item">
                            {tag.name}
                            <button type="button" className="tag-remove-btn" onClick={() => handleRemoveTag(tag.name)}> <FaTimes /> </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="form-group file-group">
                <label>Upload File</label>
                <input
                    className="file-input"
                    type="file"
                    onChange={handleFileChange}
                />

                {errors.file && <p className="error-message">{errors.file}</p>}

                {expense?.file_path && !formData.file && (
                    <p className="current-file">Current file: {expense.file_path}</p>
                )}

                {imagePreview && (
                    <div className="image-preview-wrapper">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            className="image-preview"
                            onClick={openImageModal}
                            width={100}
                            height={100}
                        />


                        <button
                            type="button"
                            className="remove-image-btn"
                            onClick={handleRemoveImage}
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}
                {isImageModalOpen && (
                    <div className="image-modal-overlay" onClick={closeImageModal}>
                        <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="image-modal-close-btn" onClick={closeImageModal}>
                                &times;
                            </button>
                            <Image width={100} height={100} src={imagePreview!} alt="Full Preview" />
                        </div>
                    </div>
                )}


            </div>


            <div className="form-group button-group">
                {onCancel && (
                    <button
                        type="button"
                        className="btn cancel-btn"
                        onClick={() => {
                            setFormData({
                                heading: '',
                                description: '',
                                price: '',
                                file: null,
                                tags: [],
                                status: 'pending'
                            });
                            setErrors({});
                            onCancel();
                        }}
                    >
                        Cancel
                    </button>
                )}
                <button type="submit" className=" button submit-btn">
                    {expense ? 'Update Expense' : 'Add Expense'}
                </button>
            </div>
        </form>
    );
});
