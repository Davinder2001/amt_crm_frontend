'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import { useFetchAttributesQuery } from '@/slices/store/storeApi';
import { FaTimes } from 'react-icons/fa';
import Variations from '../../settings/components/variations';

interface Props {
    onChange: (combinations: variations[]) => void;
    variations: variations[];
}

const AddAttributes: React.FC<Props> = ({ onChange, variations }) => {
    const { data: attributes } = useFetchAttributesQuery();
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('variations');
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
        onChange(combinations);
        setShowModal(false);
    };

    const handleReset = () => {
        setCombinations([{ attributes: [], price: 0 }])
    }

    const tabs: { key: string; label: string; content: ReactNode }[] = [
        {
            key: 'attributes',
            label: 'Attributes',
            content: <Variations />
        },
        {
            key: 'variations',
            label: 'Variations',
            content: (
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
                                    onChange={e =>
                                        handlePriceChange(index, +e.target.value)
                                    }
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
                </>
            )
        }
    ];

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="attributes">Attributes</label>
                <button type="button" onClick={() => setShowModal(true)} className="buttons add-attr">
                    Add Attributes  {variations.filter(v => v.attributes.length > 0 || v.price > 0).length > 0 && (
                        <span>
                            {variations.filter(v => v.attributes.length > 0 || v.price > 0).length}
                        </span>
                    )}
                </button>
            </div>

            <div className={`modal-overlay ${showModal ? 'show' : 'hide'}`}>
                <div className="modal-content">
                    <span onClick={() => setShowModal(false)} className="close-modal">
                        <FaTimes />
                    </span>
                    <div className="modal-inner">
                        <aside className="tabs-sidebar">
                            {tabs.map(tab => (
                                <button
                                    type="button"
                                    key={tab.key}
                                    className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </aside>

                        <section className="tab-content">
                            {tabs.find(tab => tab.key === activeTab)?.content}
                        </section>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <button type="button" onClick={handleReset}>Reset</button>
                        <button type="button" onClick={handleDone}>Done</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddAttributes;
