'use client';
import React, { useState, useRef, useEffect } from 'react';
import type { JSX } from 'react';
import { useDeletePackageMutation, useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi';
import { useRouter } from 'next/navigation';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaChevronDown, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingState from '@/components/common/LoadingState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';

const PackagesView = () => {
  const { data, error, isLoading } = useFetchPackagesQuery();
  const [deletePackage] = useDeletePackageMutation();
  const router = useRouter();
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackagePlan | null>(null);
  const [isPackageDetailOpen, setIsPackageDetailOpen] = useState(false);
  const categoriesCellRef = useRef<HTMLDivElement | null>(null);

  const [deleteState, setDeleteState] = useState<{
    id: number | null;
    name: string;
    showDialog: boolean;
  }>({
    id: null,
    name: "",
    showDialog: false
  });

  const handleDeleteInit = (id: number, name: string) => {
    setDeleteState({
      id,
      name,
      showDialog: true
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteState.id) return;

    try {
      await deletePackage(String(deleteState.id)).unwrap();
      setDeleteState({
        id: null,
        name: "",
        showDialog: false
      });
    } catch (error) {
      console.error("Failed to delete package:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteState({
      id: null,
      name: "",
      showDialog: false
    });
  };

  const handleToggle = (event: React.MouseEvent, planId: number) => {
    const newId = openCategoryId === planId ? null : planId;
    setOpenCategoryId(newId);
    if (newId) {
      categoriesCellRef.current = (event.currentTarget as HTMLElement).closest('.categories-cell');
    }
  };

  const handleViewDetails = (pkg: PackagePlan) => {
    setSelectedPackage(pkg);
    setIsPackageDetailOpen(true);
  };

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

  const columns: {
    label: string;
    key: keyof PackagePlan | undefined;
    render: (plan: PackagePlan) => JSX.Element;
  }[] = [
      {
        label: 'Package Name',
        key: 'name',
        render: (plan: PackagePlan) => (
          <div
            className="clickable-cell"
            onClick={() => handleViewDetails(plan)}
          >
            {plan.name}
          </div>
        )
      },
      {
        label: 'Monthly Price',
        key: 'monthly_price',
        render: (plan: PackagePlan) => (
          <div
            className="clickable-cell"
            onClick={() => handleViewDetails(plan)}
          >
            {Math.floor(Number(plan.monthly_price))}
          </div>
        )
      },
      {
        label: 'Annual Price',
        key: 'annual_price',
        render: (plan: PackagePlan) => (
          <div
            className="clickable-cell"
            onClick={() => handleViewDetails(plan)}
          >
            {plan.annual_price}
          </div>
        )
      },
      {
        label: 'Three years Price',
        key: 'three_years_price',
        render: (plan: PackagePlan) => (
          <div
            className="clickable-cell"
            onClick={() => handleViewDetails(plan)}
          >
            {plan.three_years_price}
          </div>
        )
      },
      {
        label: 'Applicable Categories',
        key: 'business_categories',
        render: (plan: PackagePlan) => (
          <div className="categories-cell">
            <div
              className="categories-toggle"
              onClick={(e) => {
                e.stopPropagation();
                if (plan.id !== undefined) handleToggle(e, plan.id);
              }}
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
            <span
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/superadmin/packages/edit/${plan.id}`);
              }}
              title="Edit"
              className='package-edit-icon'
            >
              <FaEdit />
            </span>
            <span
              title="Delete"
              className="package-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof plan.id === 'number') handleDeleteInit(plan.id, plan.name);
              }}
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
    <>
      <div className="superadmin-packages-container">
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/superadmin/packages/create')}
            className='buttons'
          >
            <FaPlus /> Create New Package
          </button>
        </div>

        <ResponsiveTable
          data={Array.isArray(data) ? data.filter((plan): plan is PackagePlan & { id: number } => typeof plan.id === 'number') : []}
          columns={columns}
          onEdit={(id) => router.push(`/superadmin/packages/edit/${id}`)}
          cardViewKey='name'
        />

        <Modal
          isOpen={isPackageDetailOpen}
          onClose={() => setIsPackageDetailOpen(false)}
          title={`Package Details - ${selectedPackage?.name || ''}`}
          width="900px"
        >
          {selectedPackage && (
            <div className="package-details">
              {/* Categories Section */}
              <div className="detail-section">
                <h3>Applicable Business Categories</h3>
                <div className="categories-grid">
                  {selectedPackage.business_categories.map((category: BusinessCategory) => (
                    <div key={category.id} className="category-item">
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and Limits Cards */}
              <div className="detail-section">
                <h3>Pricing & Limits</h3>
                <div className="price-limits-grid">
                  {selectedPackage.limits?.map((limit: Limit) => {
                    // Determine which price to show based on variant type
                    let priceLabel = '';
                    let priceValue = '';

                    switch (limit.variant_type) {
                      case 'monthly':
                        priceLabel = 'Monthly Price';
                        priceValue = `₹${Number(selectedPackage.monthly_price).toFixed(2)}`;
                        break;
                      case 'annual':
                        priceLabel = 'Annual Price';
                        priceValue = `₹${Number(selectedPackage.annual_price).toFixed(2)}`;
                        break;
                      case 'three_years':
                        priceLabel = 'Three Years Price';
                        priceValue = `₹${Number(selectedPackage.three_years_price).toFixed(2)}`;
                        break;
                      default:
                        priceLabel = 'Price';
                        priceValue = 'N/A';
                    }

                    return (
                      <div key={limit.id} className="price-limit-card">
                        <div className="card-header">
                          <h4>{limit.variant_type.replace('_', ' ').toUpperCase()}</h4>
                        </div>
                        <div className="card-body">
                          <div className="price-section">
                            <div className="price-row">
                              <span className="price-label">{priceLabel}:</span>
                              <span className="price-value">{priceValue}</span>
                            </div>
                          </div>
                          <div className="limits-section">
                            <div className="limit-row">
                              <span className="limit-label">Employees:</span>
                              <span className="limit-value">{limit.employee_numbers}</span>
                            </div>
                            <div className="limit-row">
                              <span className="limit-label">Items:</span>
                              <span className="limit-value">{limit.items_number}</span>
                            </div>
                            <div className="limit-row">
                              <span className="limit-label">Daily Tasks:</span>
                              <span className="limit-value">{limit.daily_tasks_number}</span>
                            </div>
                            <div className="limit-row">
                              <span className="limit-label">Invoices:</span>
                              <span className="limit-value">{limit.invoices_number}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>

      <ConfirmDialog
        isOpen={deleteState.showDialog}
        title="Delete Package"
        message={`Are you sure you want to delete "${deleteState.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="delete"
      />
    </>
  );
};

export default PackagesView;  