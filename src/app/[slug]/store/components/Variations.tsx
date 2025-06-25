'use client';
import LoadingState from '@/components/common/LoadingState';
import { useFetchVariationsQuery } from '@/slices/store/storeApi';
import React, { useEffect, useState, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';

const emptyVariant = {
    attributes: [],
    variant_regular_price: 0,
    variant_sale_price: 0,
    attribute_value_id: 0,
    variant_stock: 0
};

interface Props {
    setVariants: (combinations: variations[]) => void;
    variants: variations[];
    unit_of_measure: 'unit' | 'pieces';
}

const Variations: React.FC<Props> = ({ setVariants, variants, unit_of_measure }) => {
    const { data: response } = useFetchVariationsQuery();
    const attributes = useMemo(() => response?.data || [], [response]);
    const [combinations, setCombinations] = useState<variations[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Function to check if an attribute value would create a duplicate combination
    const isValueDisabled = useMemo(() => {
        return (comboIndex: number, attributeId: number, valueId: string) => {
            // Check if this would create a duplicate combination
            return combinations.some((combo, idx) => {
                if (idx === comboIndex) return false; // skip current combination

                // Check if this combination would match another combination
                const otherAttributes = combo.attributes.filter(attr => attr.attribute_id !== attributeId);
                const currentAttributes = combinations[comboIndex].attributes.filter(attr => attr.attribute_id !== attributeId);

                // If other attributes match
                const otherAttributesMatch = otherAttributes.every(otherAttr => {
                    return currentAttributes.some(currentAttr =>
                        currentAttr.attribute_id === otherAttr.attribute_id &&
                        currentAttr.attribute_value_id === otherAttr.attribute_value_id
                    );
                });

                // And if the new value matches the other combination's value for this attribute
                const newValueMatches = combo.attributes.some(attr =>
                    attr.attribute_id === attributeId &&
                    attr.attribute_value_id === valueId
                );

                return otherAttributesMatch && newValueMatches;
            });
        };
    }, [combinations]);

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
                        variant_regular_price: Number(v.variant_regular_price) || 0,
                        variant_sale_price: Number(v.variant_sale_price) || 0,
                        variant_stock: typeof v.variant_stock === 'number' ? v.variant_stock : 0,
                        variant_units_in_peace: v.variant_units_in_peace ?? null,
                        variant_price_per_unit: v.variant_price_per_unit ?? null,
                        images: v.images ?? [],
                        final_cost: v.final_cost ?? 0,
                        id: v.id
                    };
                });
                setCombinations(mappedVariants);
            } else {
                setCombinations([{
                    attributes: [],
                    variant_regular_price: 0,
                    variant_sale_price: 0,
                    variant_stock: 0,
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

    const handlePriceChange = (comboIndex: number, variant_sale_price: number, variant_regular_price?: number) => {
        setCombinations(prev => {
            const updated = [...prev];
            updated[comboIndex].variant_sale_price = variant_sale_price;
            if (variant_regular_price !== undefined) {
                updated[comboIndex].variant_regular_price = variant_regular_price;
            }
            return updated;
        });
    };

    const handleUnitFieldChange = (comboIndex: number, field: 'variant_units_in_peace' | 'variant_price_per_unit', value: number | null) => {
        setCombinations(prev => {
            const updated = [...prev];
            updated[comboIndex][field] = value;
            return updated;
        });
    };

    const handleAddCombination = () => {
        setCombinations(prev => [
            ...prev,
            { attribute_value_id: 0, attributes: [], variant_sale_price: 0, variant_regular_price: 0, variant_stock: 0 }
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
                                            {attr.values.map(val => {
                                                const isDisabled = isValueDisabled(index, attr.id, val.id.toString());
                                                return (
                                                    <option
                                                        key={val.id}
                                                        value={val.id.toString()}
                                                        disabled={isDisabled && !(selectedAttr?.attribute_value_id === val.id.toString())}
                                                    >
                                                        {val.value}
                                                        {isDisabled && !(selectedAttr?.attribute_value_id === val.id.toString()) && ' (already selected)'}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                );
                            })}

                            <div>
                                <label>Regular Price</label>
                                <input
                                    type="number"
                                    value={combo.variant_regular_price === 0 ? '' : combo.variant_regular_price}
                                    onChange={e => {
                                        const val = Number(e.target.value);
                                        handlePriceChange(index, combo.variant_sale_price, isNaN(val) ? 0 : val);
                                    }}
                                    placeholder="300.00"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label>Sale Price</label>
                                <input
                                    type="number"
                                    value={combo.variant_sale_price === 0 ? '' : combo.variant_sale_price}
                                    onChange={e => {
                                        const val = Number(e.target.value);
                                        handlePriceChange(index, isNaN(val) ? 0 : val, combo.variant_regular_price);
                                    }}
                                    placeholder="250.00"
                                    min={0}
                                />
                            </div>
                            <div>
                                <label>Stock</label>
                                <input
                                    type="number"
                                    value={combo.variant_stock === 0 ? '' : combo.variant_stock ?? ''}
                                    onChange={e => {
                                        const val = e.target.value === '' ? null : Number(e.target.value);
                                        setCombinations(prev => {
                                            const updated = [...prev];
                                            updated[index].variant_stock = val === null ? 0 : val;
                                            return updated;
                                        });
                                    }}
                                    placeholder="100"
                                    min={0}
                                />
                            </div>

                        </div>

                        {/* Show only if unit_of_measure is "unit" */}
                        <div className="unit-block">
                            {unit_of_measure === 'unit' && (
                                <>
                                    <div>
                                        <label>Pieces per Unit</label>
                                        <input
                                            type="number"
                                            value={combo.variant_units_in_peace || ''}
                                            onChange={e => {
                                                const val = e.target.value === '' ? null : Number(e.target.value);
                                                handleUnitFieldChange(index, 'variant_units_in_peace', val);
                                            }}
                                            placeholder="10"
                                            min={0}
                                        />
                                    </div>
                                    <div>
                                        <label>Per Unit Price</label>
                                        <input
                                            type="number"
                                            value={combo.variant_price_per_unit || ''}
                                            onChange={e => {
                                                const val = e.target.value === '' ? null : Number(e.target.value);
                                                handleUnitFieldChange(index, 'variant_price_per_unit', val);
                                            }}
                                            placeholder="0.1"
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