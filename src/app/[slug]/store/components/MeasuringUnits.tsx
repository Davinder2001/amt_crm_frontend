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
    const [nameError, setNameError] = useState<string | null>(null);

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

        // Client-side duplicate check
        const isDuplicate = units.some(
            unit => unit.name.toLowerCase() === unitName.trim().toLowerCase()
        );

        if (isDuplicate) {
            setNameError('A unit with this name already exists');
            return;
        }

        try {
            setIsSubmitting(true);
            setNameError(null); // Clear any previous errors

            const response = await createMeasuringUnit({
                name: unitName
            }).unwrap();

            if (response && response.unit) {
                const newUnit = response.unit;
                toast.success(response.message || 'Measuring unit created successfully');
                onUnitAdded(newUnit);
                onUnitSelect(newUnit.id);
                setAddUnitModalOpen(false);
                setUnitName('');
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (err) {
            console.error('Error creating measuring unit:', err);
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
                    <div className="vendors-scroll">
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
                    </div>
                    <li
                        onClick={() => {
                            setAddUnitModalOpen(true);
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
                        <FaPlus /> Add New Unit
                    </li>
                </ul>
            )}

            <Modal
                isOpen={addUnitModalOpen}
                onClose={() => {
                    setAddUnitModalOpen(false)
                    setNameError(null);
                }}
                title="Add New Measuring Unit"
                width="500px"
            >
                <Box sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Unit Name"
                        value={unitName}
                        onChange={(e) => {
                            setUnitName(e.target.value);
                            setNameError(null);
                        }}
                        variant="outlined"
                        size="small"
                        error={!!nameError}
                        helperText={nameError}
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