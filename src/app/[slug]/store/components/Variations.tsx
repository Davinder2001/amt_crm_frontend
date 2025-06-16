'use client';
import LoadingState from '@/components/common/LoadingState';
import { useFetchVariationsQuery } from '@/slices/store/storeApi';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';


const emptyVariant = {
    attributes: [],
    regular_price: 0,
    sale_price: 0,
    attribute_value_id: 0
};

interface Props {
    setVariants: (combinations: variations[]) => void;
    variants: variations[];
    unit_of_measure: 'unit' | 'pieces';
}

const Variations: React.FC<Props> = ({ setVariants, variants, unit_of_measure }) => {
    const { data: attributes } = useFetchVariationsQuery();
    const [combinations, setCombinations] = useState<variations[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Populate combinations from passed-in `variants` prop
    useEffect(() => {
        if (!attributes) return;

        setIsLoading(true);
        try {
            if (variants && variants.length > 0) {
                const mappedVariants = variants.map(v => {
                    const mappedAttributes = v.attributes?.map(attr => {
                        const matchedAttribute = attributes.find(a =>
                            a.name.toLowerCase() === attr.attribute?.toLowerCase()
                        );
                        const matchedValue = matchedAttribute?.values.find(
                            val => val.value.toLowerCase() === attr.value?.toLowerCase()
                        );

                        return {
                            attribute_id: matchedAttribute?.id || 0,
                            attribute_value_id: matchedValue?.id?.toString() || '',
                            attribute: attr.attribute || '',
                            value: attr.value || '',
                            final_cost: attr.final_cost ?? 0
                        };
                    }) || [];

                    return {
                        attribute_value_id: mappedAttributes[0]?.attribute_value_id
                            ? Number(mappedAttributes[0].attribute_value_id)
                            : 0,
                        attributes: mappedAttributes,
                        regular_price: Number(v.regular_price) || 0,
                        sale_price: Number(v.sale_price) || 0,
                    };
                });
                setCombinations(mappedVariants);
            } else {
                setCombinations([{
                    attributes: [],
                    regular_price: 0,
                    sale_price: 0,
                    attribute_value_id: 0
                }]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [variants, attributes]);

    const handleAttributeChange = (
        comboIndex: number,
        attributeId: number,
        valueId: string
    ) => {
        setCombinations(prev => {
            const updated = [...prev];
            const attribute = attributes?.find(a => a.id === attributeId);
            const value = attribute?.values.find(v => v.id.toString() === valueId);

            const currentAttributes = updated[comboIndex].attributes.filter(
                attr => attr.attribute_id !== attributeId
            );

            currentAttributes.push({
                attribute_id: attributeId,
                attribute_value_id: valueId,
                attribute: attribute?.name || '',
                value: value?.value || '',
                final_cost: 0
            });

            updated[comboIndex].attributes = currentAttributes;
            return updated;
        });
    };

    const handlePriceChange = (comboIndex: number, sale_price: number, regular_price?: number) => {
        setCombinations(prev => {
            const updated = [...prev];
            updated[comboIndex].sale_price = sale_price;
            if (regular_price !== undefined) {
                updated[comboIndex].regular_price = regular_price;
            }
            return updated;
        });
    };

    const handleUnitFieldChange = (comboIndex: number, field: 'pieces_per_unit' | 'per_unit_cost', value: number | null) => {
        setCombinations(prev => {
            const updated = [...prev];
            updated[comboIndex][field] = value;
            return updated;
        });
    };

    const handleAddCombination = () => {
        setCombinations(prev => [
            ...prev,
            { attribute_value_id: 0, attributes: [], sale_price: 0, regular_price: 0 }
        ]);
    };

    const handleRemoveCombination = (index: number) => {
        setCombinations(prev => prev.filter((_, i) => i !== index));
    };

    const handleDone = () => {
        setVariants(combinations);
    };

    const handleReset = () => {
        setCombinations([emptyVariant]);
        setVariants([emptyVariant]);
    };

    if (isLoading || !attributes) {
        return <LoadingState />;
    }

    return (
        <>
            <div className="variation-container">
                {combinations.map((combo, index) => (
                    <div key={index} className="variation-block">
                        <div className="attr-prices-block">
                            {attributes?.map(attr => {
                                const selectedAttr = combo.attributes.find(a => a.attribute_id === attr.id);
                                return (
                                    <div key={attr.id}>
                                        <label>{attr.name}</label>
                                        <select
                                            value={selectedAttr?.attribute_value_id || ''}
                                            onChange={e =>
                                                handleAttributeChange(index, attr.id, e.target.value)
                                            }
                                        >
                                            <option value="">Select {attr.name}</option>
                                            {attr.values.map(val => (
                                                <option key={val.id} value={val.id.toString()}>
                                                    {val.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}

                            <div>
                                <label>Regular Price</label>
                                <input
                                    type="number"
                                    value={combo.regular_price === 0 ? '' : combo.regular_price}
                                    onChange={e => {
                                        const val = Number(e.target.value);
                                        handlePriceChange(index, combo.sale_price, isNaN(val) ? 0 : val);
                                    }}
                                    placeholder="e.g. 300.00"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label>Sale Price</label>
                                <input
                                    type="number"
                                    value={combo.sale_price === 0 ? '' : combo.sale_price}
                                    onChange={e => {
                                        const val = Number(e.target.value);
                                        handlePriceChange(index, isNaN(val) ? 0 : val, combo.regular_price);
                                    }}
                                    placeholder="e.g. 250.00"
                                    min={0}
                                />
                            </div>
                            {unit_of_measure === 'unit' && (
                                <div>
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        value={combo.stock ?? ''}
                                        onChange={e => {
                                            const val = e.target.value === '' ? null : Number(e.target.value);
                                            setCombinations(prev => {
                                                const updated = [...prev];
                                                updated[index].stock = val;
                                                return updated;
                                            });
                                        }}
                                        placeholder="e.g. 100"
                                        min={0}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Show only if unit_of_measure is "unit" */}
                        <div className="unit-block">
                            {unit_of_measure === 'unit' && (
                                <>
                                    <div>
                                        <label>Pieces per Unit</label>
                                        <input
                                            type="number"
                                            value={combo.pieces_per_unit || ''}
                                            onChange={e => {
                                                const val = e.target.value === '' ? null : Number(e.target.value);
                                                handleUnitFieldChange(index, 'pieces_per_unit', val);
                                            }}
                                            placeholder="e.g. 10"
                                            min={0}
                                        />
                                    </div>
                                    <div>
                                        <label>Per Unit Price</label>
                                        <input
                                            type="number"
                                            value={combo.per_unit_cost || ''}
                                            onChange={e => {
                                                const val = e.target.value === '' ? null : Number(e.target.value);
                                                handleUnitFieldChange(index, 'per_unit_cost', val);
                                            }}
                                            placeholder="e.g. 0.1"
                                            min={0}
                                            step="0.01"
                                        />
                                    </div>
                                </>
                            )}
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

                    </div>
                ))}
            </div>

            <div className='variation-buttons-container'>
                <button type="button" onClick={handleAddCombination} className="buttons">
                    <FaPlus size={12} /> Add More
                </button>
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
