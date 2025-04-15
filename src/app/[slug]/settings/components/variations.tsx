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
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

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
      setIsCanvasOpen(false); // Close canvas after successful creation
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
    <div className="container">
      <h1 className="title">Variations</h1>

      {/* Open Canvas Button */}
      <button
        type="button"
        onClick={() => setIsCanvasOpen(true)}
        className='buttons'
      >
        + Add Variation Attribute
      </button>

      {/* Sliding Canvas */}
      <div
        className={`canvas ${isCanvasOpen ? 'open' : ''}`}
      >
        <div className="canvas-content">
          <h2 className="canvas-title">Create New Attribute</h2>
          {/* Create Attribute Form */}
          <div className="form-container">
            <input
              type="text"
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              placeholder="New attribute name"
              className="input"
            />

            {/* Multiple Values Input */}
            <div className="values-container">
              <label className="label">Attribute Values</label>
              {values.map((val, index) => (
                <div key={index} className="value-row">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder={`Value ${index + 1}`}
                    className="input"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeValueField(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNewValueField}
                className="add-value-btn"
              >
                + Add another value
              </button>
            </div>

            <button type="button" onClick={handleCreate} className="submit-btn">
              Add Attribute
            </button>
            <button type="button" onClick={() => setIsCanvasOpen(false)} className="close-btn">
              Close
            </button>

          </div>
        </div>
      </div>

      {/* Attributes Table */}
      <table className="attributes-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Attribute</th>
            <th>Values</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes?.map((attribute, index) => (
            <tr key={attribute.id}>
              <td>{index + 1}</td>
              <td>{attribute.name}</td>
              <td>
                {attribute.values?.map((v) => v.value).join(', ') || '—'}
              </td>
              <td>
                <select
                  value={attribute.status}
                  onChange={() => handleStatusChange(attribute.id)}
                  className="status-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => handleDelete(attribute.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .container {
          padding: 16px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .open-canvas-btn {
          background-color: #009693;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 16px;
          border: none;
        }
        .canvas {
          position: fixed;
          top: 0;
          left: -30%;
          width: 30%;
          height: 100%;
          background-color: white;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 999999;
          padding: 16px;
          overflow-y: auto;
          transition: transform 0.3s ease;
        }
        .canvas.open {
          transform: translateX(100%); /* Slide the canvas in */
        }
        .canvas-content {
          margin-top: 32px;
        }
        .canvas-title {
          font-size: 24px;
          margin-bottom: 16px;
        }
        .form-container {
          margin-bottom: 24px;
        }
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .values-container {
          margin-bottom: 16px;
        }
        .value-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .remove-btn {
          background-color: red;
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          margin-left: 8px;
          cursor: pointer;
          border: none;
        }
        .add-value-btn {
          color: blue;
          text-decoration: underline;
          cursor: pointer;
        }
        .submit-btn {
          background-color: #009693;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 16px;
        }
        .close-btn {
          color: red;
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0
        }
        .attributes-table {
          width: 100%;
          border-collapse: collapse;
        }
        .attributes-table th, .attributes-table td {
          padding: 12px;
          border: 1px solid #ccc;
          text-align: left;
        }
        .status-select {
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .delete-btn {
          color: red;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Variations;
