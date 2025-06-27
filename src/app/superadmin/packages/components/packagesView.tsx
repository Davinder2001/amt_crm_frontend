'use client';
import { useState, useRef, useEffect } from 'react';
import { useDeletePackageMutation, useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi';
import { useRouter } from 'next/navigation';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaChevronDown, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import LoadingState from '@/components/common/LoadingState';

const PackagesView = () => {
  const { setTitle } = useBreadcrumb();
  const { data, error, isLoading } = useFetchPackagesQuery();
  const [deletepackage] = useDeletePackageMutation();
  const router = useRouter();
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const categoriesCellRef = useRef<HTMLDivElement | null>(null);
  // Updated toggle handler with ref capture
  const handleToggle = (event: React.MouseEvent, planId: number) => {
    const newId = openCategoryId === planId ? null : planId;
    setOpenCategoryId(newId);
    if (newId) {
      categoriesCellRef.current = (event.currentTarget as HTMLElement).closest('.categories-cell');
    }
  };
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await deletepackage(String(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete the package:', err);
        alert('Failed to delete package. Please try again.');
      }
    }
  };

  useEffect(() => {
    setTitle('All packages Plan');
  }, [setTitle]);


  // Add this effect right after your other useEffect hooks
  // Example state for form data (adjust fields as needed)
  const [formData, setFormData] = useState<{ name: string; package_type: string }>({ name: '', package_type: 'yearly' });

  useEffect(() => {
    // Only modify name if package type changes and name exists
    if (formData.name.trim()) {
      const typeText = formData.package_type === 'monthly' ? 'Monthly' : 'Yearly';
      const suffix = `(${typeText})`;

      // Check if name already has a type suffix
      const hasExistingSuffix = /\(\s*(Monthly|Yearly)\s*\)$/.test(formData.name);

      setFormData(prev => ({
        ...prev,
        name: hasExistingSuffix
          ? prev.name.replace(/\(\s*(Monthly|Yearly)\s*\)$/, suffix)
          : `${prev.name} ${suffix}`
      }));
    }
  }, [formData.package_type, formData.name]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openCategoryId !== null &&
        categoriesCellRef.current &&
        !categoriesCellRef.current.contains(event.target as Node)
      ) {
        setOpenCategoryId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openCategoryId]);
  const columns = [
    {
      label: 'Package Name',
      key: 'name' as keyof PackagePlan,
      render: (plan: PackagePlan) => <span className='package-name'>{plan.name}</span>
    },
    {
      label: 'Monthly Price',
      key: 'annual_price' as keyof PackagePlan,
      render: (plan: PackagePlan) => (
        <span>{Math.floor(Number(plan.monthly_price))}</span>
      )
    },

    {
      label: 'Annual Price',
      key: 'annual_price' as keyof PackagePlan,
      render: (plan: PackagePlan) => (
        <span className="">{plan.annual_price}</span>
      )
    },
    {
      label: 'Three years Price',
      key: 'three_years_price' as keyof PackagePlan,
      render: (plan: PackagePlan) => (
        <span className="">{plan.three_years_price}</span>
      )
    },
    {
      label: 'Applicable Categories',
      key: 'business_categories' as keyof PackagePlan,
      render: (plan: PackagePlan) => (
        <div className="categories-cell">
          <div
            className="categories-toggle"
            onClick={(e) => plan.id !== undefined && handleToggle(e, plan.id)}
          >
            <span className='categories-show'>
              <span>{plan.business_categories.length}</span>
              Categor{plan.business_categories.length === 1 ? 'y' : 'ies'}
            </span>
            <FaChevronDown className={`toggle-icon ${openCategoryId === plan.id ? 'open' : ''}`} />
          </div>

          {openCategoryId === plan.id && (
            <div className="category-dropdown">
              {plan.business_categories.map((category) => (
                <div key={category.id} className="category-item">
                  <label>
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Actions',
      key: undefined,
      render: (plan: PackagePlan) => (
        <div className="package-action-buttons">
          <span onClick={() => router.push(`/superadmin/packages/edit/${plan.id}`)} title="Edit" className='package-edit-icon' >
            <FaEdit />
          </span>
          <span
            title="Delete"
            className="package-delete-icon"
            onClick={() => { if (typeof plan.id === 'number') handleDelete(plan.id); }}
          >
            <FaTrash />
          </span>

        </div>
      )
    }
  ];


  if (isLoading) return <LoadingState />;
  if (error) return <div className="error-message">Error loading packages.</div>;

  return (
    <div className="superadmin-packages-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button onClick={() => router.push('/superadmin/packages/create')} className='buttons'>
          <FaPlus /> Create New Package
        </button>
      </div>

      <ResponsiveTable
        data={Array.isArray(data) ? data.filter((plan): plan is PackagePlan & { id: number } => typeof plan.id === 'number') : []}
        columns={columns}
        onEdit={(id) => router.push(`/superadmin/packages/edit/${id}`)}
      />
    </div>
  );
};

export default PackagesView;