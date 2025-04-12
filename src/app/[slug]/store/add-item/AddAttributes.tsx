
// {
//     "name": "Premium T-Shirt",
//     "quantity_count": 100,
//     "measurement": "pcs",
//     "purchase_date": "2025-04-01",
//     "date_of_manufacture": "2025-03-20",
//     "date_of_expiry": null,
//     "brand_name": "StyleX",
//     "replacement": "7 Days Return",
//     "category": "Clothing",
//     "vendor_name": "FashionVendor",
//     "cost_price": 180,
//     "selling_price": 250,
//     "availability_stock": 100,
//     "variants": [
//       {
//         "price": 250,
//         "color": 20,
//         "attributes": [
//           {
//             // this is suppose for "price" variation attribute id's
//             "attribute_id": 1,
//             "attribute_value_id": 1
//           },
//                {
//                 // this is suppose for "color" variation attribute id's
//             "attribute_id": 2,
//             "attribute_value_id": 2
//           }
//         ]
//       },
//       {
//         "price": 260,
//         "stock": 25,
//         "attributes": [
//           {
//             "attribute_id": 1,
//             "attribute_value_id": 2
//           }
//         ]
//       }
//     ]
//   }






















'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import { useFetchAttributesQuery } from '@/slices/store/storeApi';
import { FaTimes } from 'react-icons/fa';

interface Props {
    onChange: (combinations: variations[]) => void;
}

// You can later move this component into its own file
const VariationsTab = () => {
    return <div>Variations content goes here (you can replace this with a real component).</div>;
};

const AddAttributes: React.FC<Props> = ({ onChange }) => {
    const { data: attributes } = useFetchAttributesQuery();
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('attributes');
    const [combinations, setCombinations] = useState<variations[]>([
        { attributes: [], price: 0 }
    ]);

    useEffect(() => {
        onChange(combinations);
    }, [combinations, onChange]);

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

    const tabs: { key: string; label: string; content: ReactNode }[] = [
        {
            key: 'attributes',
            label: 'Attributes',
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
        },
        {
            key: 'variations',
            label: 'Variations',
            content: <VariationsTab />
        }
    ];

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="attributes">Attributes</label>
                <button type="button" onClick={() => setShowModal(true)} className="buttons">
                    Add Attributes
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
                        <button onClick={() => setShowModal(false)}>Done</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                    opacity: 0;
                    z-index: 999999;
                }

                .modal-overlay.show {
                    opacity: 1;
                    pointer-events: auto;
                }

                .modal-content {
                    position: relative;
                    background: #fff;
                    width: 100%;
                    height: 80%;
                    overflow-y: hidden;
                    border-radius: 12px 12px 0 0;
                    padding: 1.5rem;
                    transform: translateY(100%);
                    transition: transform 0.3s ease-in-out;
                    display: flex;
                    flex-direction: column;
                }

                .modal-inner {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }

                .modal-overlay.show .modal-content {
                    transform: translateY(0%);
                }

                .modal-overlay.hide .modal-content {
                    transform: translateY(100%);
                }

                .close-modal {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #e0e0e0;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    font-size: 16px;
                    color: #333;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                    transition: background 0.2s;
                }

                .close-modal:hover {
                    background-color: #d5d5d5;
                }

                .tabs-sidebar {
                    width: 150px;
                    border-right: 1px solid #eee;
                    padding-right: 1rem;
                    display: flex;
                    flex-direction: column;
                }

                .tab-button {
                    padding: 10px;
                    background: none;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                    font-weight: 500;
                    border-radius: 6px;
                    margin-bottom: 6px;
                    transition: background 0.2s;
                }

                .tab-button.active {
                    background-color: #f0f0f0;
                    font-weight: 600;
                }

                .tab-content {
                    flex: 1;
                    padding-left: 1.5rem;
                    overflow-y: auto;
                }

                .variation-block {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .remove-button {
                    background: #ff4d4f;
                    color: #fff;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                }

                select,
                input {
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                }
            `}</style>
        </>
    );
};

export default AddAttributes;
