'use client';
import React, { useState } from 'react';
import {
  useFetchAttributesQuery,
  useCreateAttributeMutation,
  useDeleteAttributeMutation,
  useToggleAttributeStatusMutation,
} from '@/slices/store/storeApi';

const Variations = () => {
  const { data: attributes, isLoading, isError } = useFetchAttributesQuery();
  const [createAttribute] = useCreateAttributeMutation();
  const [deleteAttribute] = useDeleteAttributeMutation();
  const [toggleStatus] = useToggleAttributeStatusMutation();

  const [newAttributeName, setNewAttributeName] = useState('');
  const [values, setValues] = useState<string[]>(['']);

  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...values];
    updated[index] = newValue;
    setValues(updated);
  };

  const addNewValueField = () => {
    setValues([...values, '']);
  };

  const removeValueField = (index: number) => {
    const updated = [...values];
    updated.splice(index, 1);
    setValues(updated);
  };

  const handleCreate = async () => {
    if (!newAttributeName.trim()) return;
    const filteredValues = values.filter((v) => v.trim() !== '');
    if (filteredValues.length === 0) return;

    try {
      await createAttribute({ name: newAttributeName, values: filteredValues }).unwrap();
      setNewAttributeName('');
      setValues(['']);
    } catch (error) {
      console.error('Error creating attribute:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this attribute?')) {
      try {
        await deleteAttribute(id).unwrap();
      } catch (error) {
        console.error('Error deleting attribute:', error);
      }
    }
  };

  const handleStatusChange = async (id: number) => {
    try {
      await toggleStatus(id).unwrap();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (isLoading) return <p>Loading attributes...</p>;
  if (isError) return <p>Failed to load attributes.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Variations</h1>

      {/* Create Attribute Form */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={newAttributeName}
          onChange={(e) => setNewAttributeName(e.target.value)}
          placeholder="New attribute name"
          className="border px-3 py-2 rounded w-full max-w-sm"
        />

        {/* Multiple Values Input */}
        <div className="space-y-2">
          <label className="block font-medium">Attribute Values</label>
          {values.map((val, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={val}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder={`Value ${index + 1}`}
                className="border px-3 py-2 rounded w-full max-w-sm"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeValueField(index)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addNewValueField}
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            + Add another value
          </button>
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Add Attribute
        </button>
      </div>

      {/* Attributes Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">#</th>
            <th className="border px-4 py-2 text-left">Attribute</th>
            <th className="border px-4 py-2 text-left">Values</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes?.map((attribute, index) => (
            <tr key={attribute.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{attribute.name}</td>
              <td className="border px-4 py-2">
                {attribute.values?.map((v) => v.value).join(', ') || '—'}
              </td>
              <td className="border px-4 py-2">
                <select
                  value={attribute.status}
                  onChange={() => handleStatusChange(attribute.id)}
                  className="border rounded px-2 py-1"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(attribute.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Variations;
