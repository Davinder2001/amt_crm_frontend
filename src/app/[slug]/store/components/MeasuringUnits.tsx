'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaPlus } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import { useCreateMeasuringUnitMutation } from '@/slices/company/companyApi';
import { toast } from 'react-toastify';
import { Box, TextField } from '@mui/material';

interface MeasuringUnitsProps {
    units: MeasuringUnit[];
    selectedUnit: number | null;
    onUnitSelect: (unitId: number) => void;
    onUnitAdded: (newUnit: MeasuringUnit) => void;
}

const MeasuringUnits: React.FC<MeasuringUnitsProps> = ({
    units,
    selectedUnit,
    onUnitSelect,
    onUnitAdded
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [addUnitModalOpen, setAddUnitModalOpen] = useState(false);
    const [unitName, setUnitName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createMeasuringUnit] = useCreateMeasuringUnitMutation();
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
        if (!unitName) return;

        try {
            setIsSubmitting(true);
            const response = await createMeasuringUnit({
                name: unitName
            }).unwrap();

            const newUnit = response.data;
            toast.success('Measuring unit created successfully');
            onUnitAdded(newUnit);
            onUnitSelect(newUnit.id);
            setAddUnitModalOpen(false);
            setUnitName('');
        } catch (err) {
            console.error('Error creating measuring unit:', err);
            toast.error('Failed to create measuring unit');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedUnitObj = units.find((u) => u.id === selectedUnit);

    return (
        <div className="addvendor-dropdown" ref={dropdownRef}>
            <div className="vendors-header" onClick={() => setIsOpen((prev) => !prev)}>
                {selectedUnitObj ? selectedUnitObj.name : 'Select Unit'}
                <FaChevronDown size={14} />
            </div>

            {isOpen && (
                <ul className="vendors-menu">
                    {units.map((unit) => (
                        <li
                            key={unit.id}
                            className={`vendor-name ${unit.id === selectedUnit ? 'active' : ''}`}
                            onClick={() => {
                                onUnitSelect(unit.id);
                                setIsOpen(false);
                            }}
                        >
                            {unit.name}
                        </li>
                    ))}
                    <li
                        onClick={() => {
                            setAddUnitModalOpen(true);
                            setIsOpen(false);
                        }}
                        style={{
                            padding: '8px 10px',
                            color: '#384b70',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            borderTop: '1px solid #ddd'
                        }}
                    >
                        <FaPlus /> Add New Unit
                    </li>
                </ul>
            )}

            <Modal
                isOpen={addUnitModalOpen}
                onClose={() => setAddUnitModalOpen(false)}
                title="Add New Measuring Unit"
                width="500px"
            >
                <Box sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Unit Name"
                        value={unitName}
                        onChange={(e) => setUnitName(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#384b70',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#384b70',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#384b70',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#384b70',
                                '&.Mui-focused': {
                                    color: '#384b70',
                                },
                            },
                        }}
                        placeholder="e.g. kg, pcs, liters"
                    />
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <button onClick={() => setAddUnitModalOpen(false)} className="buttons cancel-btn">
                            Cancel
                        </button>
                        <button
                            className="buttons"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !unitName}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Unit'}
                        </button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default MeasuringUnits;