'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaPlus } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import { useCreateTaxMutation } from '@/slices/company/companyApi';
import { toast } from 'react-toastify';
import { Box, TextField } from '@mui/material';

interface Tax {
    id: number;
    name: string;
    rate: number;
}

interface AddTaxProps {
    taxes: Tax[];
    selectedTaxId: number | null;
    onTaxSelect: (taxId: number) => void;
    onTaxAdded: (newTax: Tax) => void;
}

const AddTax: React.FC<AddTaxProps> = ({ taxes, selectedTaxId, onTaxSelect, onTaxAdded, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [addTaxModalOpen, setAddTaxModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', rate: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createTax] = useCreateTaxMutation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        if (!form.name || !form.rate) return;

        try {
            setIsSubmitting(true);
            const response = await createTax({
                name: form.name,
                rate: parseFloat(form.rate)
            }).unwrap();

            const newTax = response.data;
            toast.success('Tax created successfully');
            onTaxAdded(newTax);
            onTaxSelect(newTax.id);
            setAddTaxModalOpen(false);
            setForm({ name: '', rate: '' });
        } catch (err) {
            console.error('Error creating tax:', err);
            toast.error('Failed to create tax');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedTax = taxes.find((t) => t.id === selectedTaxId);

    return (
        <div className="addvendor-dropdown" ref={dropdownRef}>
            <div className="vendors-header"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {selectedTax ? `${selectedTax.name} - ${selectedTax.rate}%` : 'Select Tax'}
                <FaChevronDown size={14} />
            </div>

            {isOpen && (
                <ul className="vendors-menu">
                    <div className="vendors-scroll">
                        {taxes.map((tax) => (
                            <li
                                key={tax.id}
                                className={`vendor-name ${tax.id === selectedTaxId ? 'active' : ''}`}
                                onClick={() => {
                                    onTaxSelect(tax.id);
                                    setIsOpen(false);
                                }}
                            >
                                {tax.name} - {tax.rate}%
                            </li>
                        ))}
                    </div>
                    <li
                        onClick={() => {
                            setAddTaxModalOpen(true);
                            setIsOpen(false);
                        }}
                        style={{
                            padding: '8px 10px',
                            color: 'var(--primary-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            borderTop: '1px solid #ddd',
                            position: 'sticky',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                            zIndex: 9
                        }}
                    >
                        <FaPlus /> Add New Tax
                    </li>
                </ul>
            )}

            <Modal
                isOpen={addTaxModalOpen}
                onClose={() => setAddTaxModalOpen(false)}
                title="Add New Tax"
                width="500px"
            >
                <Box sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Tax Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'var(--primary-color)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--primary-color)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-color)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--primary-color)',
                                '&.Mui-focused': {
                                    color: 'var(--primary-color)',
                                },
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Tax Rate (%)"
                        value={form.rate}
                        onChange={(e) => setForm({ ...form, rate: e.target.value })}
                        variant="outlined"
                        type="number"
                        size="small"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'var(--primary-color)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--primary-color)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-color)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--primary-color)',
                                '&.Mui-focused': {
                                    color: 'var(--primary-color)',
                                },
                            },
                        }}
                    />
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <button onClick={() => setAddTaxModalOpen(false)} className="buttons cancel-btn">Cancel</button>
                        <button className="buttons" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Tax'}
                        </button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default AddTax;
