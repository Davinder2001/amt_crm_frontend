'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { 
  useCreatePackageDetailMutation, 
  useUpdatePackageDetailMutation,
  useFetchSinglePackageDetailQuery 
} from '@/slices/superadminSlices/package-details/packageDetailsApi';
import LoadingState from '@/components/common/LoadingState';

interface PackageDetailFormProps {
  mode: 'add' | 'edit';
  id?: string;
}

const PackageDetailForm = ({ mode, id }: PackageDetailFormProps) => {
  const { setTitle } = useBreadcrumb();
  const router = useRouter();
  const [createPackageDetail] = useCreatePackageDetailMutation();
  const [updatePackageDetail] = useUpdatePackageDetailMutation();
  
  const { data: packageDetail, isLoading: detailLoading } = useFetchSinglePackageDetailQuery(id!, {
    skip: mode === 'add' || !id
  });

  const [formData, setFormData] = useState<CreatePackageDetailRequest>({
    name: '',
    value: ''
  });

  const [multipleItems, setMultipleItems] = useState<Array<{ name: string; value: string }>>([
    { name: '', value: '' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [multipleErrors, setMultipleErrors] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    setTitle(mode === 'add' ? 'Create Package Detail' : 'Edit Package Detail');
  }, [setTitle, mode]);

  useEffect(() => {
    if (mode === 'edit' && packageDetail) {
      setFormData({
        name: packageDetail.name,
        value: packageDetail.value
      });
    }
  }, [mode, packageDetail]);

  const validateForm = () => {
    if (mode === 'add') {
      // Validate multiple items for create mode
      const newMultipleErrors: Array<Record<string, string>> = [];
      let isValid = true;

      multipleItems.forEach((item) => {
        const itemErrors: Record<string, string> = {};
        
        if (!item.name.trim()) {
          itemErrors.name = 'Name is required';
          isValid = false;
        }
        
        if (!item.value.trim()) {
          itemErrors.value = 'Value is required';
          isValid = false;
        }
        
        newMultipleErrors.push(itemErrors);
      });

      setMultipleErrors(newMultipleErrors);
      return isValid;
    } else {
      // Validate single item for edit mode
      const newErrors: Record<string, string> = {};

      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.value.trim()) {
        newErrors.value = 'Value is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'add') {
        // Create multiple package details
        const promises = multipleItems.map(item => 
          createPackageDetail({ name: item.name, value: item.value })
        );
        
        await Promise.all(promises);
        alert(`${multipleItems.length} package detail(s) created successfully!`);
        
        // Reset form after successful creation
        setMultipleItems([{ name: '', value: '' }]);
        setMultipleErrors([]);
      } else {
        if (id) {
          await updatePackageDetail({ id: parseInt(id), ...formData }).unwrap();
          alert('Package detail updated successfully!');
        }
        router.push('/superadmin/packages');
      }
    } catch (error) {
      console.error('Error saving package detail:', error);
      alert('Failed to save package detail. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultipleInputChange = (index: number, field: 'name' | 'value', value: string) => {
    setMultipleItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });

    // Clear error when user starts typing
    if (multipleErrors[index]?.[field]) {
      setMultipleErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = { ...newErrors[index], [field]: '' };
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setMultipleItems(prev => [...prev, { name: '', value: '' }]);
    setMultipleErrors(prev => [...prev, {}]);
  };

  const removeItem = (index: number) => {
    if (multipleItems.length > 1) {
      setMultipleItems(prev => prev.filter((_, i) => i !== index));
      setMultipleErrors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const clearForm = () => {
    setMultipleItems([{ name: '', value: '' }]);
    setMultipleErrors([]);
  };

  if (mode === 'edit' && detailLoading) {
    return <LoadingState />;
  }

  return (
    <div className="package-detail-form-container">
      <div className="form-header">
        <h2>{mode === 'add' ? 'Create New Package Detail' : 'Edit Package Detail'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="package-detail-form">
        {mode === 'add' ? (
          // Multiple items form for create mode
          <div className="multiple-items-form">
            <div className="form-header-actions">
              <h3>Add Package Details</h3>
              <button 
                type="button" 
                onClick={addItem} 
                className="btn-add-item"
              >
                + Add Another Item
              </button>
            </div>
            
            {multipleItems.map((item, index) => (
              <div key={index} className="item-group">
                <div className="item-header">
                  <h4>Item {index + 1}</h4>
                  {multipleItems.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeItem(index)}
                      className="btn-remove-item"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`name-${index}`}>Name *</label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      value={item.name}
                      onChange={(e) => handleMultipleInputChange(index, 'name', e.target.value)}
                      placeholder="Enter name"
                      className={multipleErrors[index]?.name ? 'error' : ''}
                    />
                    {multipleErrors[index]?.name && (
                      <span className="error-message">{multipleErrors[index].name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`value-${index}`}>Value *</label>
                    <input
                      type="text"
                      id={`value-${index}`}
                      value={item.value}
                      onChange={(e) => handleMultipleInputChange(index, 'value', e.target.value)}
                      placeholder="Enter value"
                      className={multipleErrors[index]?.value ? 'error' : ''}
                    />
                    {multipleErrors[index]?.value && (
                      <span className="error-message">{multipleErrors[index].value}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Single item form for edit mode
          <>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="value">Value *</label>
              <input
                type="text"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter value"
                className={errors.value ? 'error' : ''}
              />
              {errors.value && <span className="error-message">{errors.value}</span>}
            </div>
          </>
        )}

        <div className="form-actions">
          {mode === 'add' ? (
            <>
              <button type="button" onClick={clearForm} className="btn-clear">
                Clear Form
              </button>
              <button type="button" onClick={() => router.push('/superadmin/packages')} className="btn-secondary">
                Done
              </button>
              <button type="submit" className="btn-primary">
                Create Package Details
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => router.push('/superadmin/packages')} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Package Detail
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PackageDetailForm; 