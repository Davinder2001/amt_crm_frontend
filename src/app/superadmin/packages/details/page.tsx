'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import LoadingState from '@/components/common/LoadingState';
import { 
  useFetchPackageDetailsQuery, 
  useCreatePackageDetailMutation,
  useUpdatePackageDetailMutation,
  useDeletePackageDetailMutation 
} from '@/slices/superadminSlices/package-details/packageDetailsApi';

const PackageDetailsPage = () => {
  const { setTitle } = useBreadcrumb();
  const { data: packageDetails, error, isLoading, refetch } = useFetchPackageDetailsQuery();
  const [createPackageDetail] = useCreatePackageDetailMutation();
  const [updatePackageDetail] = useUpdatePackageDetailMutation();
  const [deletePackageDetail] = useDeletePackageDetailMutation();
  const router = useRouter();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ name: '', value: '' });
  const [editingData, setEditingData] = useState({ name: '', value: '' });

  useEffect(() => {
    setTitle('Package Details Management');
  }, [setTitle]);

  const handleAddNew = () => {
    if (newItem.name.trim() && newItem.value.trim()) {
      createPackageDetail(newItem)
        .unwrap()
        .then(() => {
          setNewItem({ name: '', value: '' });
          refetch();
        })
        .catch((error) => {
          console.error('Failed to create package detail:', error);
          alert('Failed to create package detail. Please try again.');
        });
    }
  };

  const handleEdit = (id: number, currentData: { name: string; value: string }) => {
    setEditingId(id);
    setEditingData(currentData);
  };

  const handleSave = (id: number) => {
    if (editingData.name.trim() && editingData.value.trim()) {
      updatePackageDetail({ id, ...editingData })
        .unwrap()
        .then(() => {
          setEditingId(null);
          setEditingData({ name: '', value: '' });
          refetch();
        })
        .catch((error) => {
          console.error('Failed to update package detail:', error);
          alert('Failed to update package detail. Please try again.');
        });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({ name: '', value: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this package detail?')) {
      deletePackageDetail(String(id))
        .unwrap()
        .then(() => {
          refetch();
        })
        .catch((error) => {
          console.error('Failed to delete package detail:', error);
          alert('Failed to delete package detail. Please try again.');
        });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <div className="error-message">Error loading package details.</div>;

  return (
    <div className="package-details-management-container">
      <div className="page-header">
        <h1>Package Details Management</h1>
        <button 
          onClick={() => router.push('/superadmin/packages')} 
          className="btn-back"
        >
          ← Back to Packages
        </button>
      </div>

      {/* Add New Item Section */}
      <div className="add-new-section">
        <h3>Add New Package Detail</h3>
        <div className="add-form">
          <input
            type="text"
            placeholder="Enter name"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            onKeyPress={(e) => handleKeyPress(e, handleAddNew)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter value"
            value={newItem.value}
            onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
            onKeyPress={(e) => handleKeyPress(e, handleAddNew)}
            className="input-field"
          />
          <button 
            onClick={handleAddNew}
            disabled={!newItem.name.trim() || !newItem.value.trim()}
            className="btn-add"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* Package Details Table */}
      <div className="package-details-table">
        <h3>Existing Package Details</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packageDetails?.map((detail) => (
                <tr key={detail.id}>
                  <td>
                    {editingId === detail.id ? (
                      <input
                        type="text"
                        value={editingData.name}
                        onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                        className="edit-input"
                      />
                    ) : (
                      detail.name
                    )}
                  </td>
                  <td>
                    {editingId === detail.id ? (
                      <input
                        type="text"
                        value={editingData.value}
                        onChange={(e) => setEditingData(prev => ({ ...prev, value: e.target.value }))}
                        className="edit-input"
                      />
                    ) : (
                      detail.value
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingId === detail.id ? (
                      <>
                        <button 
                          onClick={() => handleSave(detail.id!)}
                          disabled={!editingData.name.trim() || !editingData.value.trim()}
                          className="btn-save"
                          title="Save"
                        >
                          <FaSave />
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="btn-cancel"
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEdit(detail.id!, { name: detail.name, value: detail.value })}
                          className="btn-edit"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(detail.id!)}
                          className="btn-delete"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {(!packageDetails || packageDetails.length === 0) && (
                <tr>
                  <td colSpan={3} className="no-data">
                    No package details found. Add some using the form above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage; 