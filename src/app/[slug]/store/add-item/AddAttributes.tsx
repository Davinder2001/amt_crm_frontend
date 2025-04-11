
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



























// /store/add-item/AddAttributes.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { useFetchAttributesQuery } from '@/slices/store/storeApi';

interface Props {
    onChange: (combinations: variations[]) => void;
}

const AddAttributes: React.FC<Props> = ({ onChange }) => {
    const { data: attributes } = useFetchAttributesQuery();
    const [showModal, setShowModal] = useState(false);
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

    return (
        <>
            <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="attributes">Attributes</label>
                <button type="button" onClick={() => setShowModal(true)}>
                    Add Attributes
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Configure Variations</h3>
                        {combinations.map((combo, index) => (
                            <div key={index} className="variation-block">
                                {attributes?.map(attr => (
                                    <div key={attr.id} style={{ marginBottom: '8px' }}>
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

                                <div style={{ marginBottom: '10px' }}>
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
                                    <button type="button" onClick={() => handleRemoveCombination(index)}>
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
                            <button onClick={() => setShowModal(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddAttributes;
