'use client';
import { useState, useEffect } from 'react';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import LoadingState from '@/components/common/LoadingState';
import { 
  useFetchPackageDetailsQuery, 
  useCreatePackageDetailMutation,
  useUpdatePackageDetailMutation,
  useDeletePackageDetailMutation 
} from '@/slices/superadminSlices/package-details/packageDetailsApi';

const PackageDetails = () => {
  const { setTitle } = useBreadcrumb();
  const { data: packageDetails, error, isLoading, refetch } = useFetchPackageDetailsQuery();
  const [createPackageDetail] = useCreatePackageDetailMutation();
  const [updatePackageDetail] = useUpdatePackageDetailMutation();
  const [deletePackageDetail] = useDeletePackageDetailMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ name: '', value: '' });
  const [editingData, setEditingData] = useState({ name: '', value: '' });

  useEffect(() => {
    setTitle('Package Details');
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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this package detail?')) {
      try {
        await deletePackageDetail(String(id)).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete the package detail:', err);
        alert('Failed to delete package detail. Please try again.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };



  const columns = [
    {
      label: 'Name',
      key: 'name' as keyof PackageDetail,
      render: (detail: PackageDetail) => (
        editingId === detail.id ? (
          <input
            type="text"
            value={editingData.name}
            onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
            className="edit-input"
          />
        ) : (
          <span className='package-name'>{detail.name}</span>
        )
      )
    },
    {
      label: 'Value',
      key: 'value' as keyof PackageDetail,
      render: (detail: PackageDetail) => (
        editingId === detail.id ? (
          <input
            type="text"
            value={editingData.value}
            onChange={(e) => setEditingData(prev => ({ ...prev, value: e.target.value }))}
            className="edit-input"
          />
        ) : (
          <span>{detail.value}</span>
        )
      )
    },
    {
      label: 'Actions',
      key: undefined,
      render: (detail: PackageDetail) => (
        <div className="package-detail-action-buttons">
          {editingId === detail.id ? (
            <>
              <span 
                onClick={() => handleSave(detail.id!)}
                title="Save" 
                className={`package-detail-save-icon ${!editingData.name.trim() || !editingData.value.trim() ? 'disabled' : ''}`}
              >
                <FaSave />
              </span>
              <span
                onClick={handleCancel}
                title="Cancel"
                className="package-detail-cancel-icon"
              >
                <FaTimes />
              </span>
            </>
          ) : (
            <>
              <span 
                onClick={() => handleEdit(detail.id!, { name: detail.name, value: detail.value })} 
                title="Edit" 
                className='package-detail-edit-icon'
              >
                <FaEdit />
              </span>
              <span
                title="Delete"
                className="package-detail-delete-icon"
                onClick={() => { if (typeof detail.id === 'number') handleDelete(detail.id); }}
              >
                <FaTrash />
              </span>
            </>
          )}
        </div>
      )
    }
  ];

  if (isLoading) return <LoadingState />;
  if (error) return <div className="error-message">Error loading package details.</div>;

  return (
    <div className="superadmin-package-details-container">
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

      {packageDetails && packageDetails.length > 0 ? (
        <ResponsiveTable
          data={packageDetails.filter((detail): detail is PackageDetail & { id: number } => typeof detail.id === 'number')}
          columns={columns}
          onEdit={(id) => handleEdit(id, { name: '', value: '' })}
        />
      ) : (
        <div className="no-data-message">
          <p>No package details found. Add some using the form above.</p>
        </div>
      )}
    </div>
  );
};

export default PackageDetails; 