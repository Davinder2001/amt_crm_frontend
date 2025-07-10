'use client';

import { memo, useState, useMemo } from 'react';
import {
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useFetchInvoicesQuery,
    useFetchStoreQuery,
    useFetchItemBatchByIdQuery,
} from '@/slices';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { useFetchUsersQuery } from '@/slices/users/userApi';

interface ExpenseFormProps {
    expense?: Expense | null;
    onSuccess: () => void;
    onCancel?: () => void;
}

interface BatchSelection {
    itemId: number;
    batchIds: number[];
}

interface FormDataState {
    heading: string;
    description: string;
    price: string;
    file: File | null;
    tags: Tag[];
    status: 'pending' | 'paid';
}



interface OptionProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}

export const RelationOption = ({ id, label, checked, onChange }: OptionProps) => (
    <label htmlFor={id} className="relation-option">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <span>{label}</span>
    </label>
);

interface Props {
    label: string;
    active: boolean;
    onToggle: () => void;
    searchValue: string;
    onSearch: (val: string) => void;
    children: React.ReactNode;
}

export const RelationCard = ({ label, active, onToggle, searchValue, onSearch, children }: Props) => (
    <div className={`relation-card ${active ? 'active' : ''}`}>
        <div className="card-header">
            <label className="toggle">
                <input type="checkbox" checked={active} onChange={onToggle} />
                <span>{label}</span>
            </label>
        </div>

        {active && (
            <>
                <div className="card-search">
                    <div className="search-input-wrapper">
                        <span className="search-icon">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder={`Search ${label.toLowerCase()}s...`}
                            value={searchValue}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card-body">{children}</div>
            </>
        )}
    </div>
);

export default memo(function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
    const [createExpense] = useCreateExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
    const [selectedBatches, setSelectedBatches] = useState<BatchSelection[]>([]);

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

    const [searchTerm, setSearchTerm] = useState({
        invoice: '',
        item: '',
        user: ''
    });

    const filteredInvoices = useMemo(() => {
        if (!searchTerm.invoice) return invoices;
        return invoices.filter(invoice =>
            invoice.invoice_number.toLowerCase().includes(searchTerm.invoice.toLowerCase()) ||
            invoice.amount.toString().includes(searchTerm.invoice)
        );
    }, [invoices, searchTerm.invoice]);

    const filteredItems = useMemo(() => {
        if (!searchTerm.item) return items;
        return items.filter(item =>
            item.name?.toLowerCase().includes(searchTerm.item.toLowerCase()) ||
            String(item.price ?? '').includes(searchTerm.item)
        );
    }, [items, searchTerm.item]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm.user) return users;
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.user.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.user.toLowerCase())
        );
    }, [users, searchTerm.user]);

    const handleSearchChange = (type: keyof typeof searchTerm, value: string) => {
        setSearchTerm(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const [formData, setFormData] = useState<FormDataState>({
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
            setFormData(prev => ({ ...prev, file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, file: null }));
        setImagePreview(null);
    };

    const handleBatchSelection = (itemId: number, batchId: number) => {
        setSelectedBatches(prev => {
            const existingIndex = prev.findIndex(b => b.itemId === itemId);

            if (existingIndex > -1) {
                const updated = [...prev];
                const batchIds = [...updated[existingIndex].batchIds];
                const batchIndex = batchIds.indexOf(batchId);

                if (batchIndex > -1) {
                    batchIds.splice(batchIndex, 1);
                } else {
                    batchIds.push(batchId);
                }

                updated[existingIndex] = { itemId, batchIds };
                return updated;
            }

            return [...prev, { itemId, batchIds: [batchId] }];
        });
    };

    const handleSelectAllBatches = (itemId: number, allBatchIds: number[]) => {
        setSelectedBatches(prev => {
            const existingIndex = prev.findIndex(b => b.itemId === itemId);

            if (existingIndex > -1) {
                const updated = [...prev];
                if (updated[existingIndex].batchIds.length === allBatchIds.length) {
                    updated[existingIndex] = { itemId, batchIds: [] };
                } else {
                    updated[existingIndex] = { itemId, batchIds: [...allBatchIds] };
                }
                return updated;
            }

            return [...prev, { itemId, batchIds: [...allBatchIds] }];
        });
    };

    const handleTypeChange = (type: keyof typeof selectedTypes) => {
        setSelectedTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleOptionChange = (type: keyof typeof selectedOptions, id: number) => {
        if (type === 'items') {
            const isSelected = selectedOptions.items.includes(id);

            if (!isSelected) {
                setExpandedItemId(id);
            } else {
                setSelectedBatches(prev => prev.filter(b => b.itemId !== id));
                setExpandedItemId(null);
            }
        }

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
            formDataPayload.append('description', formData.description);
            formDataPayload.append('price', formData.price);
            formDataPayload.append('status', formData.status);

            selectedOptions.invoices.forEach(id => formDataPayload.append('invoice_ids[]', id.toString()));
            selectedOptions.items.forEach(id => formDataPayload.append('item_ids[]', id.toString()));
            selectedOptions.users.forEach(id => formDataPayload.append('user_ids[]', id.toString()));

            selectedBatches.forEach(batch => {
                batch.batchIds.forEach(batchId => {
                    formDataPayload.append('batch_ids[]', batchId.toString());
                });
            });

            if (formData.file) {
                formDataPayload.append('file', formData.file);
            }

            if (expense) {
                await updateExpense({
                    id: expense.id,
                    formdata: formDataPayload as any
                }).unwrap();
            } else {
                await createExpense({ formdata: formDataPayload as any }).unwrap();
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving expense:', error);
            setErrors({ form: 'An error occurred while saving the expense' });
        }
    };

    const ItemBatches = ({ itemId }: { itemId: number }) => {
        const { data: batchesData, isLoading, isError } = useFetchItemBatchByIdQuery(itemId);
        const selectedBatchIds = selectedBatches.find(b => b.itemId === itemId)?.batchIds || [];
        const allBatchIds = (batchesData?.batch?.variants?.map(v => v.id).filter((id): id is number => id !== undefined)) || [];

        if (isLoading) return <div className="loading-batches">Loading batches...</div>;
        if (isError) return <div className="error-batches">Error loading batches</div>;
        if (!batchesData?.batch?.variants?.length) return <div className="no-batches">No batches available</div>;

        return (
            <div className="batch-options">
                <div className="select-all-batches">
                    <input
                        type="checkbox"
                        id={`select-all-${itemId}`}
                        checked={selectedBatchIds.length === allBatchIds.length && allBatchIds.length > 0}
                        onChange={() => handleSelectAllBatches(itemId, allBatchIds)}
                    />
                    <label htmlFor={`select-all-${itemId}`}>Select All</label>
                </div>
                {batchesData.batch.variants.filter(b => b.id !== undefined).map((batch) => (
                    <div key={batch.id} className="batch-option">
                        <input
                            type="checkbox"
                            id={`batch-${itemId}-${batch.id}`}
                            checked={selectedBatchIds.includes(batch.id)}
                            onChange={() => handleBatchSelection(itemId, batch.id)}
                        />
                        <label htmlFor={`batch-${itemId}-${batch.id}`}>
                            Purchased: {batchesData.batch.purchase_date || 'N/A'}
                        </label>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            {errors.form && <p className="error-message">{errors.form}</p>}

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

            <div className="form-group description-group">
                <label>Description</label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder='Description'
                />
            </div>
            <div className="relation-section">
                <h3 className="section-heading">Tags</h3>

                <div className="relation-card-grid">
                    {/* Invoice Card */}
                    <RelationCard
                        label="Invoice"
                        active={selectedTypes.invoice}
                        onToggle={() => handleTypeChange('invoice')}
                        searchValue={searchTerm.invoice}
                        onSearch={(val) => handleSearchChange('invoice', val)}
                    >
                        {filteredInvoices.map((invoice) => (
                            <RelationOption
                                key={invoice.id}
                                id={`invoice-${invoice.id}`}
                                label={`${invoice.invoice_number} - ₹${invoice.sub_total}`}
                                checked={selectedOptions.invoices.includes(invoice.id)}
                                onChange={() => handleOptionChange('invoices', invoice.id)}
                            />
                        ))}
                    </RelationCard>

                    {/* Item Card */}
                    <RelationCard
                        label="Item"
                        active={selectedTypes.item}
                        onToggle={() => handleTypeChange('item')}
                        searchValue={searchTerm.item}
                        onSearch={(val) => handleSearchChange('item', val)}
                    >
                        {filteredItems.map((item) => (
                            <div key={item.id} className="relation-item-with-batch">
                                <RelationOption
                                    id={`item-${item.id}`}
                                    label={`${item.name} `}
                                    checked={selectedOptions.items.includes(item.id)}
                                    onChange={() => handleOptionChange('items', item.id)}
                                />
                                {selectedOptions.items.includes(item.id) && (
                                    <div className="batch-section">
                                        <button
                                            className="toggle-batch-btn"
                                            onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                                        >
                                            {expandedItemId === item.id ? 'Hide Batches' : 'Show Batches'}
                                        </button>
                                        {expandedItemId === item.id && <ItemBatches itemId={item.id} />}
                                    </div>
                                )}
                            </div>
                        ))}
                    </RelationCard>

                    {/* User Card */}
                    <RelationCard
                        label="User"
                        active={selectedTypes.user}
                        onToggle={() => handleTypeChange('user')}
                        searchValue={searchTerm.user}
                        onSearch={(val) => handleSearchChange('user', val)}
                    >
                        {filteredUsers.map((user) => (
                            <RelationOption
                                key={user.id}
                                id={`user-${user.id}`}
                                label={`${user.name} (${user.email})`}
                                checked={selectedOptions.users.includes(user.id)}
                                onChange={() => handleOptionChange('users', user.id)}
                            />
                        ))}
                    </RelationCard>
                </div>
            </div>


            <div className="form-group button-group">
                {onCancel && (
                    <button
                        type="button"
                        className="cancel-btn buttons"
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
                            setSelectedBatches([]);
                            setExpandedItemId(null);
                            setErrors({});
                            onCancel();
                        }}
                    >
                        Cancel
                    </button>
                )}
                <button type="submit" className="submit-btn">
                    {expense ? 'Update Expense' : 'Add Expense'}
                </button>
            </div>
        </form>
    )
});