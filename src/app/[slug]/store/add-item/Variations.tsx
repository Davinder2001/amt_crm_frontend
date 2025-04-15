'use client';
import { useFetchAttributesQuery } from '@/slices/store/storeApi';
import React, { useState } from 'react';

interface Props {
    onChange: (combinations: variations[]) => void;
    setShowModal: (value: boolean) => void;
}

const Variations: React.FC<Props> = ({ onChange, setShowModal }) => {
    const { data: attributes } = useFetchAttributesQuery();
    const [combinations, setCombinations] = useState<variations[]>([
        { attributes: [], price: 0 }
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
                attribute_value_id: valueId
            });

            updated[comboIndex].attributes = currentAttributes;
            return updated;
        });
    };

    const handlePriceChange = (comboIndex: number, price: number) => {
        setCombinations(prev => {
            const updated = [...prev];
            updated[comboIndex].price = price;
            return updated;
        });
    };

    const handleAddCombination = () => {
        setCombinations(prev => [...prev, { attributes: [], price: 0 }]);
    };

    const handleRemoveCombination = (index: number) => {
        setCombinations(prev => prev.filter((_, i) => i !== index));
    };

    const handleDone = () => {
        setShowModal(false);
        onChange(combinations);
    };

    const handleReset = () => {
        setCombinations([{ attributes: [], price: 0 }]);
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
                        <label>Price</label>
                        <input
                            type="number"
                            value={combo.price}
                            onChange={e => handlePriceChange(index, +e.target.value)}
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

            <button type="button" onClick={handleAddCombination}>
                Add More
            </button>

            <div style={{ marginTop: '1rem' }}>
                <button type="button" onClick={handleReset}>
                    Reset
                </button>
                <button type="button" onClick={handleDone}>
                    Done
                </button>
            </div>
        </>
    );
};

export default Variations;
