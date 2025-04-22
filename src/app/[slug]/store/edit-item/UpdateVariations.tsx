'use client';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  variants: variations[];
  setVariants: (combinations: variations[]) => void;
  setShowModal: (value: boolean) => void;
}

const UpdateVariations: React.FC<Props> = ({ variants, setVariants, setShowModal }) => {
  const [combinations, setCombinations] = useState<variations[]>([]);

  // Generate attribute options from existing variants
  const attributeOptions: AttributeOption[] = useMemo(() => {
    const map = new Map<string, Set<string>>();
    variants.forEach(variant => {
      variant.attributes.forEach(attr => {
        if (!map.has(attr.attribute)) {
          map.set(attr.attribute, new Set());
        }
        map.get(attr.attribute)!.add(attr.value);
      });
    });

    return Array.from(map.entries()).map(([attribute, values]) => ({
      attribute,
      values: Array.from(values),
    }));
  }, [variants]);

  // Initialize combinations from passed-in variants
  useEffect(() => {
    const initialized = variants.map(variant => ({
      ...variant,
      attributes: variant.attributes.map(attr => ({ ...attr })),
    }));
    setCombinations(initialized.length > 0 ? initialized : [{ attributes: [], price: 0 }]);
  }, [variants]);

  const handleAttributeChange = (
    comboIndex: number,
    attributeKey: string,
    value: string
  ) => {
    setCombinations(prev => {
      const updated = [...prev];
      const combo = { ...updated[comboIndex] };

      // Ensure we clone deeply to avoid mutation
      const updatedAttrs = [...combo.attributes];
      const attrIndex = updatedAttrs.findIndex(a => a.attribute === attributeKey);

      if (attrIndex !== -1) {
        updatedAttrs[attrIndex] = { ...updatedAttrs[attrIndex], value };
      } else {
        updatedAttrs.push({
          attribute: attributeKey, value,
          attribute_id: '',
          attribute_value_id: '',
          final_cost: 0
        });
      }

      updated[comboIndex] = { ...combo, attributes: updatedAttrs };
      return updated;
    });
  };

  const handlePriceChange = (comboIndex: number, price: number) => {
    setCombinations(prev => {
      const updated = [...prev];
      updated[comboIndex] = { ...updated[comboIndex], price };
      return updated;
    });
  };

  const handleAddCombination = () => {
    const newCombo: variations = {
      attributes: attributeOptions.map(attr => ({
        attribute: attr.attribute,
        value: '',
        attribute_id: '',
        attribute_value_id: '',
        final_cost: 0
      })),
      price: 0,
    };
    setCombinations(prev => [...prev, newCombo]);
  };

  const handleRemoveCombination = (index: number) => {
    setCombinations(prev => prev.filter((_, i) => i !== index));
  };

  const handleDone = () => {
    setVariants(combinations);
    setShowModal(false);
  };

  const handleReset = () => {
    setCombinations([{ attributes: [], price: 0 }]);
  };

  return (
    <>
      {combinations.map((combo, index) => (
        <div key={index} className="variation-block">
          {attributeOptions.map(attr => (
            <div key={attr.attribute} style={{ marginBottom: '12px' }}>
              <label>{attr.attribute}</label>
              <select
                value={
                  combo.attributes.find(a => a.attribute === attr.attribute)?.value || ''
                }
                onChange={e =>
                  handleAttributeChange(index, attr.attribute, e.target.value)
                }
              >
                <option value="">Select {attr.attribute}</option>
                {attr.values.map(val => (
                  <option key={val} value={val}>
                    {val}
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

export default UpdateVariations;
