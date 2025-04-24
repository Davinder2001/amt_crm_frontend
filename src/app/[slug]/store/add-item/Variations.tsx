'use client';
import { useFetchVariationsQuery } from '@/slices/store/storeApi';
import React, { useState } from 'react';

interface Props {
    onChange: (combinations: variations[]) => void;
    setShowModal: (value: boolean) => void;
}

const Variations: React.FC<Props> = ({ onChange, setShowModal }) => {
    const { data: attributes } = useFetchVariationsQuery();
    const [combinations, setCombinations] = useState<variations[]>([
        { attributes: [], price: 0, regular_price: 0 }
    ]);

    const handleAttributeChange = (
        comboIndex: number,
        attributeId: number,
        valueId: string
    ) => {
        setCombinations(prev => {
            const updated = [...prev];
            const currentAttributes = updated[comboIndex].attributes.filter(
                attr => attr.attribute_id !== attributeId
            );

            currentAttributes.push({
                attribute_id: attributeId,
                attribute_value_id: valueId,
                attribute: '',
                value: '',
                final_cost: 0
            });

            updated[comboIndex].attributes = currentAttributes;
            return updated;
        });
    };

    const handlePriceChange = (comboIndex: number, price: number, regular_price?: number) => {
        setCombinations(prev => {
            const updated = [...prev];
            updated[comboIndex].price = price;
            if (regular_price !== undefined) {
                updated[comboIndex].regular_price = regular_price;
            }
            return updated;
        });
    };

    const handleAddCombination = () => {
        setCombinations(prev => [...prev, { attributes: [], price: 0, regular_price: 0 }]);
    };

    const handleRemoveCombination = (index: number) => {
        setCombinations(prev => prev.filter((_, i) => i !== index));
    };

    const handleDone = () => {
        setShowModal(false);
        onChange(combinations);
    };

    const handleReset = () => {
        setCombinations([{ attributes: [], price: 0, regular_price: 0 }]);
    };

    return (
        <>
            {combinations.map((combo, index) => (
                <div key={index} className="variation-block">
                    {attributes?.map(attr => (
                        <div key={attr.id} style={{ marginBottom: '12px' }}>
                            <label>{attr.name}</label>
                            <select
                                value={
                                    combo.attributes.find(a => a.attribute_id === attr.id)
                                        ?.attribute_value_id || ''
                                }
                                onChange={e =>
                                    handleAttributeChange(index, attr.id, e.target.value)
                                }
                            >
                                <option value="">Select {attr.name}</option>
                                {attr.values.map(val => (
                                    <option key={val.id} value={val.id}>
                                        {val.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <div style={{ marginBottom: '12px' }}>
                        <label>Regular Price</label>
                        <input
                            type="number"
                            value={combo.regular_price === 0 ? '' : combo.regular_price}
                            onChange={e => {
                                const val = Number(e.target.value);
                                handlePriceChange(index, combo.price, isNaN(val) ? 0 : val);
                            }}
                            placeholder="e.g. 300.00"
                            min={0}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label>Price</label>
                        <input
                            type="number"
                            value={combo.price === 0 ? '' : combo.price}
                            onChange={e => {
                                const val = Number(e.target.value);
                                handlePriceChange(index, isNaN(val) ? 0 : val, combo.regular_price);
                            }}
                            placeholder="e.g. 250.00"
                            min={0}
                        />
                    </div>

                    {index > 0 && (
                        <button
                            type="button"
                            onClick={() => handleRemoveCombination(index)}
                            className="remove-button"
                        >
                            Remove
                        </button>
                    )}
                    <hr />
                </div>
            ))}

            <button type="button" onClick={handleAddCombination} className="buttons">
                Add More
            </button>

            <div style={{ marginTop: '1rem' }} className='variation-buttons-container'>
                <button type="button" onClick={handleReset} className="buttons">
                    Reset
                </button>
                <button type="button" onClick={handleDone} className="buttons">
                    Done
                </button>
            </div>
        </>
    );
};

export default Variations;
