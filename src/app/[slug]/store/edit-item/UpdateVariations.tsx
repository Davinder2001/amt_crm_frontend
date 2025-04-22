import React, { useEffect, useState } from 'react';
import { useFetchVariationsQuery } from '@/slices/store/storeApi';

interface Props {
  variants: variations[];
  setVariants: (combinations: variations[]) => void;
}

const UpdateVariations: React.FC<Props> = ({ variants, setVariants }) => {
  const { data: attributes } = useFetchVariationsQuery();
  const [existingCombinations, setExistingCombinations] = useState<variations[]>([]);
  const [newCombinations, setNewCombinations] = useState<variations[]>([]);
  const [initialVariants, setInitialVariants] = useState<variations[]>([]);

  // Load existing variants on mount
  useEffect(() => {
    const initialized = variants.map(variant => ({
      ...variant,
      attributes: variant.attributes.map(attr => ({ ...attr })),
    }));
    setExistingCombinations(initialized);
    setInitialVariants(JSON.parse(JSON.stringify(initialized)));
  }, [variants]);

  const hasChanges = () => {
    const serialize = (arr: variations[]) =>
      JSON.stringify(
        arr.map(item => ({
          ...item,
          attributes: item.attributes.sort((a, b) =>
            a.attribute_id > b.attribute_id ? 1 : -1
          ), // sort for consistent comparison
        }))
      );

    return (
      serialize(existingCombinations) !== serialize(initialVariants) ||
      newCombinations.length > 0
    );
  };

  // Handlers for existing combinations
  const handleExistingChange = (comboIndex: number, key: string, value: string) => {
    setExistingCombinations(prev => {
      const updated = [...prev];
      const combo = { ...updated[comboIndex] };
      const attrs = [...combo.attributes];
      const attrIndex = attrs.findIndex(a => a.attribute === key);
      if (attrIndex !== -1) {
        attrs[attrIndex] = { ...attrs[attrIndex], value };
      } else {
        attrs.push({ attribute: key, value, attribute_id: '', attribute_value_id: '', final_cost: 0 });
      }
      updated[comboIndex] = { ...combo, attributes: attrs };
      return updated;
    });
  };

  const handleExistingPriceChange = (index: number, price: number) => {
    setExistingCombinations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], price };
      return updated;
    });
  };

  // Handlers for new combinations
  const handleNewAttributeChange = (
    comboIndex: number,
    attributeId: number,
    valueId: string
  ) => {
    setNewCombinations(prev => {
      const updated = [...prev];
      const attrs = updated[comboIndex].attributes.filter(attr => attr.attribute_id !== attributeId);

      // Find the selected attribute name and value
      const selectedAttribute = attributes?.find(attr => attr.id === attributeId);
      const selectedValue = selectedAttribute?.values.find(val => val.id === Number(valueId));

      attrs.push({
        attribute_id: attributeId,
        attribute_value_id: valueId,
        attribute: selectedAttribute?.name || '', // Set the attribute name
        value: selectedValue?.value || '', // Set the attribute value
        final_cost: 0
      });

      updated[comboIndex].attributes = attrs;
      return updated;
    });
  };

  const handleNewPriceChange = (index: number, price: number) => {
    setNewCombinations(prev => {
      const updated = [...prev];
      updated[index].price = price;
      return updated;
    });
  };

  const handleAddNewCombination = () => {
    setNewCombinations(prev => [...prev, { attributes: [], price: 0 }]);
  };

  const handleRemoveNewCombo = (index: number) => {
    setNewCombinations(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingCombo = (index: number) => {
    setExistingCombinations(prev => prev.filter((_, i) => i !== index));
  };

  // handleDone function now resets newCombinations to clear the fields after setting the variants
  const handleDone = () => {
    setVariants([...existingCombinations, ...newCombinations]); // Send both existing and new combinations together
    setNewCombinations([]); // Reset the new combinations to clear the fields
  };

  const handleReset = () => {
    setNewCombinations([]);
  };

  return (
    <div>
      {/* Existing Combinations Section */}
      {existingCombinations.map((combo, index) => (
        <div key={`existing-${index}`} className="variation-block">
          {combo.attributes.map(attr => (
            <div key={attr.attribute} style={{ marginBottom: '12px' }}>
              <label>{attr.attribute}</label>
              <select
                value={attr.value}
                onChange={e => handleExistingChange(index, attr.attribute, e.target.value)}
              >
                <option value="">Select {attr.attribute}</option>
                {attributes?.map(attribute => (
                  attribute.name === attr.attribute &&
                  attribute.values.map(val => (
                    <option key={val.id} value={val.value}>
                      {val.value}
                    </option>
                  ))
                ))}
              </select>
            </div>
          ))}
          <div style={{ marginBottom: '12px' }}>
            <label>Price</label>
            <input
              type="number"
              value={combo.price}
              onChange={e => handleExistingPriceChange(index, +e.target.value)}
            />
          </div>
          <button type="button" onClick={() => handleRemoveExistingCombo(index)}>
            Remove
          </button>
          <hr />
        </div>
      ))}

      {/* New Combinations Section */}
      {newCombinations.map((combo, index) => (
        <div key={`new-${index}`} className="variation-block">
          {attributes?.map(attr => (
            <div key={attr.id} style={{ marginBottom: '12px' }}>
              <label>{attr.name}</label>
              <select
                value={combo.attributes.find(a => a.attribute_id === attr.id)?.attribute_value_id || ''}
                onChange={e =>
                  handleNewAttributeChange(index, attr.id, e.target.value)
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
              onChange={e => handleNewPriceChange(index, +e.target.value)}
            />
          </div>
          <button type="button" onClick={() => handleRemoveNewCombo(index)}>
            Remove
          </button>
          <hr />
        </div>
      ))}

      <button type="button" onClick={handleAddNewCombination}>
        Add New
      </button>

      {hasChanges() && (
        <div style={{ marginTop: '1rem' }}>
          <button type="button" onClick={handleReset}>
            Reset New
          </button>
          <button type="button" onClick={handleDone}>
            Done
          </button>
        </div>
      )}

    </div>
  );
};

export default UpdateVariations;
