import React, { useEffect, useState } from 'react';
import { useFetchVariationsQuery } from '@/slices/store/storeApi';

interface Props {
  variants: variations[];
  setVariants: (combinations: variations[]) => void;
}

type PriceField = number;

type AttributeValue = {
  attribute_id: string | number;
  attribute_value_id: string;
  attribute: string;
  value: string;
  final_cost: number;
};

type FieldValue = PriceField | AttributeValue;

const UpdateVariations: React.FC<Props> = ({ variants, setVariants }) => {
  const { data: attributes } = useFetchVariationsQuery();
  const [existingCombinations, setExistingCombinations] = useState<variations[]>([]);
  const [newCombinations, setNewCombinations] = useState<variations[]>([]);
  const [initialVariants, setInitialVariants] = useState<variations[]>([]);

  useEffect(() => {
    const initialized = variants.map(variant => ({
      ...variant,
      attributes: variant.attributes.map(attr => ({ ...attr })),
    }));
    setExistingCombinations(initialized);
    setInitialVariants(JSON.parse(JSON.stringify(initialized)));

    // Show new blank if no existing combos
    if (initialized.length === 0) {
      setNewCombinations([{ attributes: [], price: 0, regular_price: 0 }]);
    } else {
      setNewCombinations([]); // clean up
    }
  }, [variants]);

  const hasChanges = () => {
    const serialize = (arr: variations[]) =>
      JSON.stringify(
        arr.map(item => ({
          ...item,
          attributes: item.attributes.sort((a, b) =>
            a.attribute_id > b.attribute_id ? 1 : -1
          ),
        }))
      );

    return (
      serialize(existingCombinations) !== serialize(initialVariants) ||
      newCombinations.length > 0
    );
  };

  const handleFieldChange = (
    index: number,
    field: string,
    value: FieldValue,
    isNew: boolean
  ) => {
    if (isNew) {
      setNewCombinations(prev => {
        const updated = [...prev];
        if (field === 'price' || field === 'regular_price') {
          updated[index][field] = value as PriceField; // type cast to PriceField
        } else {
          const attrs = updated[index].attributes;
          const attrIndex = attrs.findIndex(a => a.attribute_id === (value as AttributeValue).attribute_id);
          if (attrIndex !== -1) {
            attrs[attrIndex] = value as AttributeValue;
          } else {
            attrs.push(value as AttributeValue); // type cast to AttributeValue
          }
        }
        return updated;
      });
    } else {
      setExistingCombinations(prev => {
        const updated = [...prev];
        if (field === 'price' || field === 'regular_price') {
          updated[index][field] = value as PriceField;
        } else {
          const attrs = updated[index].attributes;
          const attrIndex = attrs.findIndex(a => a.attribute === field);
          if (attrIndex !== -1) {
            attrs[attrIndex] = { ...attrs[attrIndex], value: (value as AttributeValue).value };
          } else {
            attrs.push({
              attribute: field,
              value: (value as AttributeValue).value,
              attribute_id: '',
              attribute_value_id: '',
              final_cost: 0,
            });
          }
        }
        return updated;
      });
    }
  };

  const handleAddNewCombination = () => {
    setNewCombinations(prev => [...prev, { attributes: [], price: 0, regular_price: 0 }]);
  };

  const handleRemoveNewCombo = (index: number) => {
    setNewCombinations(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingCombo = (index: number) => {
    setExistingCombinations(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // If no existing left, show a blank new combo
      if (updated.length === 0) {
        setNewCombinations([{ attributes: [], price: 0, regular_price: 0 }]);
      }
      return updated;
    });
  };

  const handleDone = () => {
    const merged = [...existingCombinations, ...newCombinations];
    setExistingCombinations(merged);
    setInitialVariants(JSON.parse(JSON.stringify(merged)));
    setNewCombinations([]);
    setVariants(merged);
  };

  const handleReset = () => {
    // Always reset to one blank new
    setNewCombinations([{ attributes: [], price: 0, regular_price: 0 }]);
  };

  return (
    <div className='tab-content'>
      {/* Existing Combinations */}
      {existingCombinations.map((combo, index) => (
        <div key={`existing-${index}`} className="variation-block attributes-table">
          {combo.attributes.map(attr => (
            <div key={attr.attribute} style={{ marginBottom: '12px' }}>
              <label>{attr.attribute}</label>
              <select
                value={attr.value}
                onChange={e => {
                  const selectedValue = e.target.value;
                  const attributeValue: AttributeValue = {
                    attribute_id: attr.attribute_id,
                    attribute_value_id: selectedValue, // We assume the selected value is the `attribute_value_id`
                    attribute: attr.attribute,
                    value: selectedValue, // The actual value of the attribute
                    final_cost: 0, // Assuming `final_cost` is zero for now, you can update this as needed
                  };
                  handleFieldChange(index, attr.attribute, attributeValue, false);
                }}
              >
                <option value="">Select {attr.attribute}</option>
                {attributes?.map(attribute =>
                  attribute.name === attr.attribute &&
                  attribute.values.map(val => (
                    <option key={val.id} value={val.id}>
                      {val.value}
                    </option>
                  ))
                )}
              </select>
            </div>
          ))}
          <div style={{ marginBottom: '12px' }}>
            <label>Price</label>
            <input
              type="number"
              value={combo.price}
              onChange={e => handleFieldChange(index, 'price', +e.target.value, false)}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Regular Price</label>
            <input
              type="number"
              value={combo.regular_price}
              onChange={e => handleFieldChange(index, 'regular_price', +e.target.value, false)}
            />
          </div>
          <button type="button" onClick={() => handleRemoveExistingCombo(index)}>
            Remove
          </button>
          <hr />
        </div>
      ))}

      {/* New Combinations - only shown if explicitly added or no existing */}
      {newCombinations.length > 0 && (
        <>
          {newCombinations.map((combo, index) => (
            <div key={`new-${index}`} className="variation-block">
              {attributes?.map(attr => (
                <div key={attr.id} style={{ marginBottom: '12px' }}>
                  <label>{attr.name}</label>
                  <select
                    value={combo.attributes.find(a => a.attribute_id === attr.id)?.attribute_value_id || ''}
                    onChange={e => {
                      const selectedValue = e.target.value;
                      const attributeValue: AttributeValue = {
                        attribute_id: String(attr.id),
                        attribute_value_id: selectedValue,
                        attribute: attr.name,
                        value: attr.values.find(v => v.id === +e.target.value)?.value || '',
                        final_cost: 0,
                      };
                      handleFieldChange(index, attr.name, attributeValue, true);
                    }}
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
                  onChange={e => handleFieldChange(index, 'price', +e.target.value, true)}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Regular Price</label>
                <input
                  type="number"
                  value={combo.regular_price}
                  onChange={e => handleFieldChange(index, 'regular_price', +e.target.value, true)}
                />
              </div>
              <button type="button" onClick={() => handleRemoveNewCombo(index)} className='remove-button'>
                Remove
              </button>
              <hr />
            </div>
          ))}
        </>
      )}

      {/* Always visible "Add New" */}
      <button type="button" onClick={handleAddNewCombination} className='buttons'>
        Add New
      </button>

      {/* Show Done/Reset if needed */}
      {hasChanges() && (
        <div className='variation-buttons-container'>
          <button type="button" onClick={handleReset} className='buttons'>
            Reset New
          </button>
          <button type="button" onClick={handleDone} className='buttons'>
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateVariations;
