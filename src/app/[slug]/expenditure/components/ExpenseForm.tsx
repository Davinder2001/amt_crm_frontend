'use client';

import { memo, useState } from 'react';
import {
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useFetchInvoicesQuery,
    useFetchStoreQuery,
} from '@/slices';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { useFetchUsersQuery } from '@/slices/users/userApi';

interface ExpenseFormProps {
    expense?: Expense | null;
    onSuccess: () => void;
    onCancel?: () => void;
}

export default memo(function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
    const [createExpense] = useCreateExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const { data: invoicesData } = useFetchInvoicesQuery();
    const storeData = useFetchStoreQuery();
    const { data: usersData } = useFetchUsersQuery();

    const invoices = invoicesData?.invoices ?? [];
    const items = storeData.data ?? [];
    const users = usersData?.users ?? [];

    const [selectedTypes, setSelectedTypes] = useState({
        invoice: false,
        item: false,
        user: false
    });

    const [selectedOptions, setSelectedOptions] = useState({
        invoices: [] as number[],
        items: [] as number[],
        users: [] as number[]
    });

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
        value: string | number | File | null
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTypeChange = (type: keyof typeof selectedTypes) => {
        setSelectedTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleOptionChange = (type: keyof typeof selectedOptions, id: number) => {
        setSelectedOptions(prev => {
            const currentSelection = [...prev[type]];
            const index = currentSelection.indexOf(id);

            if (index > -1) {
                currentSelection.splice(index, 1);
            } else {
                currentSelection.push(id);
            }

            return {
                ...prev,
                [type]: currentSelection
            };
        });
    };

    const openImageModal = () => setIsImageModalOpen(true);
    const closeImageModal = () => setIsImageModalOpen(false);

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
            formDataPayload.append('heading', formData.heading);
            formDataPayload.append('description', formData.description || '');
            formDataPayload.append('price', Number(formData.price).toString());
            formDataPayload.append('status', formData.status);

            selectedOptions.invoices.forEach(id => {
                formDataPayload.append('invoice_ids[]', id.toString());
            });
            selectedOptions.items.forEach(id => {
                formDataPayload.append('item_ids[]', id.toString());
            });
            selectedOptions.users.forEach(id => {
                formDataPayload.append('user_ids[]', id.toString());
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
            <div className='expense-form-header'>

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
                                <Image width={500} height={500} src={imagePreview!} alt="Full Preview" />
                            </div>
                        </div>
                    )}
                </div>
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


            <div className="relation-group">
                <label>Add Relations</label>

                <div className="relation-group">
                    <label>Add Relations</label>

                    <div className="relation-dropdown">
                        <label className="dropdown-toggle">
                            <input
                                type="checkbox"
                                checked={selectedTypes.invoice}
                                onChange={() => handleTypeChange('invoice')}
                            />
                            <span>Invoice</span>
                        </label>

                        {selectedTypes.invoice && (
                            <div className="dropdown-content">
                                <div className="options-list">
                                    {invoices.map((invoice) => (
                                        <div key={invoice.id} className="option-item">
                                            <input
                                                type="checkbox"
                                                id={`invoice-${invoice.id}`}
                                                checked={selectedOptions.invoices.includes(invoice.id)}
                                                onChange={() => handleOptionChange('invoices', invoice.id)}
                                            />
                                            <label htmlFor={`invoice-${invoice.id}`}>
                                                {invoice.invoice_number} - ${invoice.amount}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relation-dropdown">
                        <label className="dropdown-toggle">
                            <input
                                type="checkbox"
                                checked={selectedTypes.item}
                                onChange={() => handleTypeChange('item')}
                            />
                            <span>Item</span>
                        </label>

                        {selectedTypes.item && (
                            <div className="dropdown-content">
                                <div className="options-list">
                                    {items.map((item) => (
                                        <div key={item.id} className="option-item">
                                            <input
                                                type="checkbox"
                                                id={`item-${item.id}`}
                                                checked={selectedOptions.items.includes(item.id)}
                                                onChange={() => handleOptionChange('items', item.id)}
                                            />
                                            <label htmlFor={`item-${item.id}`}>
                                                {item.name} - ${item.price}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relation-dropdown">
                        <label className="dropdown-toggle">
                            <input
                                type="checkbox"
                                checked={selectedTypes.user}
                                onChange={() => handleTypeChange('user')}
                            />
                            <span>User</span>
                        </label>

                        {selectedTypes.user && (
                            <div className="dropdown-content">
                                <div className="options-list">
                                    {users.map((user) => (
                                        <div key={user.id} className="option-item">
                                            <input
                                                type="checkbox"
                                                id={`user-${user.id}`}
                                                checked={selectedOptions.users.includes(user.id)}
                                                onChange={() => handleOptionChange('users', user.id)}
                                            />
                                            <label htmlFor={`user-${user.id}`}>
                                                {user.name} - {user.email}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <div className="form-group button-group">
                {onCancel && (
                    <button
                        type="button"
                        className="btn buttons cancel-btn"
                        onClick={() => {
                            setFormData({
                                heading: '',
                                description: '',
                                price: '',
                                file: null,
                                tags: [],
                                status: 'pending'
                            });
                            setSelectedOptions({
                                invoices: [],
                                items: [],
                                users: []
                            });
                            setSelectedTypes({
                                invoice: false,
                                item: false,
                                user: false
                            });
                            setErrors({});
                            onCancel();
                        }}
                    >
                        Cancel
                    </button>
                )}
                <button type="submit" className="button submit-btn">
                    {expense ? 'Update Expense' : 'Add Expense'}
                </button>
            </div>
        </form>
    );
});