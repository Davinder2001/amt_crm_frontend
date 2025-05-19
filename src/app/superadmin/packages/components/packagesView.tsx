// 'use client';
// import React from 'react';
// import { useFetchPackagesQuery } from '@/slices/superadminSlices/packages/packagesApi';
// import Loader from '@/components/common/Loader';
// import { useRouter } from 'next/navigation';
// import { FaPlus } from 'react-icons/fa';

// const PackagesView = () => {
//   const { data, error, isLoading } = useFetchPackagesQuery();
//   const router = useRouter();

//   if (isLoading) return <Loader />;
//   if (error) return <div className="error-message">Error loading packages.</div>;

//   return (
//     <div className="superadmin-packages-container">
//       <div className="header">
//         <h2>Pick Your Perfect Plan</h2>
//         <button onClick={() => router.push('/superadmin/packages/create')} className='buttons'>
//           <FaPlus /> Create New Package
//         </button>
//       </div>

//       <div className="packages-grid">
//         {Array.isArray(data) && data.length > 0 ?
//           (data.map((plan) => {
//             return <div key={plan.id} className="package-card">
//               <div className="ribbon">1 Year</div>
//               <h3 className="planPrice">₹ {plan.price ?? 0} / Year</h3>
//               <ul className="features">
//                 <li>👥 {plan.employee_numbers} Employees</li>
//                 <li>📦 {plan.items_number} Items</li>
//                 <li>📋 {plan.daily_tasks_number} Tasks/day</li>
//                 <li>🧾 {plan.invoices_number} Invoices</li>
//               </ul>
//               {plan.business_categories?.length > 0 && (
//                 <div className="categories">
//                   <h4>Business Categories</h4>
//                   <ul>
//                     {plan.business_categories.map((category) => (
//                       <li key={category.id}>{category.name}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           })) : (
//             <div className="no-packages-message">
//               <div className="empty-box-icon">📦</div>
//               <h3>No packages available</h3>
//               <p>We couldn't find any packages for this category.</p>
//               <div className="suggestions">
//                 <p>Try selecting a different category or check back later!</p>
//                 <div className="wave-hand">👋</div>
//               </div>
//             </div>
//           )}

//       </div>
//     </div>
//   );
// };

// export default PackagesView;











'use client';
import { useState } from 'react';
import { useFetchPackagesQuery, useUpdatePackageMutation } from '@/slices/superadminSlices/packages/packagesApi';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaPlus } from 'react-icons/fa';
import { Categories } from 'emoji-picker-react';

const PackagesView = () => {
  const { data, error, isLoading } = useFetchPackagesQuery();
  const router = useRouter();
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

  const [editId, setEditId] = useState<number | null>(null);
  const [editableFields, setEditableFields] = useState({
    employee_numbers: '',
    items_number: '',
    daily_tasks_number: '',
    invoices_number: ''
  });
  const [updatePackage] = useUpdatePackageMutation();
  const handleFieldChange = (field: string, value: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (plan: PackagePlan) => {
    await updatePackage({
      id: plan.id,
      data: {
        ...plan,
        ...editableFields,
        employee_numbers: +editableFields.employee_numbers,
        items_number: +editableFields.items_number,
        daily_tasks_number: +editableFields.daily_tasks_number,
        invoices_number: +editableFields.invoices_number,
      }
    });
    setEditId(null);
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">Error loading packages.</div>;

  return (
    <div className="superadmin-packages-container">
      <div className="header">
        <h2>Pick Your Perfect Plan</h2>
        <button onClick={() => router.push('/superadmin/packages/create')} className='buttons'>
          <FaPlus /> Create New Package
        </button>
      </div>

      <div className="packages-grid">
        {Array.isArray(data) && data.length > 0 ?
          (
            data.map((plan) => {
              const isEditing = editId === plan.id;

              const handleContentEdit = (
                e: React.FormEvent<HTMLSpanElement>,
                field: string,
                plan: any
              ) => {
                const value = (e.target as HTMLSpanElement).innerText;
                updatePackage({
                  id: plan.id,
                  data: {
                    ...plan,
                    [field]: +value,
                  },
                });
              };

              return (
                <div key={plan.id} className="package-card">
                  <div className="ribbon">1 Year</div>
                  <h3 className="planPrice">
                    ₹{' '}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentEdit(e, 'price', plan)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.target as HTMLElement).blur();
                        }
                      }}
                    >
                      {plan.price ?? 0}
                    </span>{' '}
                    / Year
                  </h3>

                  <ul className="features">
                    <li>
                      👥{' '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit(e, 'employee_numbers', plan)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }
                        }}
                      >
                        {plan.employee_numbers}
                      </span>{' '}
                      Employees
                    </li>
                    <li>
                      📦{' '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit(e, 'items_number', plan)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }
                        }}
                      >
                        {plan.items_number}
                      </span>{' '}
                      Items
                    </li>
                    <li>
                      📋{' '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit(e, 'daily_tasks_number', plan)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }
                        }}
                      >
                        {plan.daily_tasks_number}
                      </span>{' '}
                      Tasks/day
                    </li>
                    <li>
                      🧾{' '}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit(e, 'invoices_number', plan)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }
                        }}
                      >
                        {plan.invoices_number}
                      </span>{' '}
                      Invoices
                    </li>
                  </ul>

                  {plan.business_categories?.length > 0 && (
                    <div className="categories">
                      <div
                        className="categories-header"
                        onClick={() =>
                          setOpenCategoryId(openCategoryId === plan.id ? null : plan.id)
                        }
                      >
                        <span className='business-categories-count-outer' ><span className='business-categories-count'>{plan.business_categories.length}</span> Categories</span>
                        <span className={`dropdown-icon ${openCategoryId === plan.id ? 'open' : ''}`}>
                          <FaChevronDown />
                        </span>
                      </div>

                      {openCategoryId === plan.id && (
                        <ul className="category-list">
                          {plan.business_categories.map((category) => {
                            const isChecked = plan.business_categories.some((c) => c.id === category.id);

                            const toggleCategory = async () => {
                              const updatedCategories = isChecked
                                ? plan.business_categories.filter((c) => c.id !== category.id)
                                : [...plan.business_categories, category];

                              await updatePackage({
                                id: plan.id,
                                data: {
                                  ...plan,
                                  business_categories: updatedCategories,
                                },
                              });
                            };

                            return (
                              <li key={category.id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={toggleCategory}
                                  />
                                  {category.name}
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="no-packages-message">
              <div className="empty-box-icon">📦</div>
              <h3>No packages available</h3>
              <p>We couldn't find any packages for this category.</p>
              <div className="suggestions">
                <p>Try selecting a different category or check back later!</p>
                <div className="wave-hand">👋</div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default PackagesView;
